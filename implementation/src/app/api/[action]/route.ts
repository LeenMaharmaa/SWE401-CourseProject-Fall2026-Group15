import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes } from 'node:crypto';
import { db, checkPassword, hashPassword, historyFor, owned, profileFor, userFor, type User } from '@/lib/db';
import { analyzeJobDescription, compareProfile, generateInterviewMaterials, modelName, optimizeExperience, sampleMode } from '@/lib/ai';
import { calculateScore, profileSchema, validateDescription, type Analysis, type Comparison, type Profile } from '@/lib/domain';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const idSchema = z.number().int().positive();
const reply = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
type Context = { params: Promise<{ action: string }> };
export async function GET(request: NextRequest, context: Context) {
  const { action } = await context.params;
  if (action !== 'state') return reply({ error: 'Not found.' }, 404);
  try {
    const user = userFor(request.cookies.get('sb-session')?.value || '');
    if (!user) return reply({ user: null, sampleMode: sampleMode(), configured: Boolean(process.env.GEMINI_API_KEY), model: modelName() });
    return reply({ user, profile: profileFor(user.id), history: historyFor(user.id), sampleMode: sampleMode(), configured: Boolean(process.env.GEMINI_API_KEY), model: modelName() });
  } catch { return reply({ error: 'Unable to open the local database. Check the terminal and restart the app.' }, 500); }
}
export async function POST(request: NextRequest, context: Context) {
  try {
    const { action } = await context.params;
    const body = await request.json();
    if (action === 'login' || action === 'register') {
      const email = z.string().trim().includes('@', { message: 'Email must contain @.' }).parse(body.email).toLowerCase();
      const password = z.string().min(6, 'Password must have at least six characters.').parse(body.password);
      let user: User;
      if (action === 'register') {
        const name = z.string().trim().min(1, 'Enter your name.').parse(body.name);
        if (body.consent !== true) throw new Error('Please accept the data consent notice.');
        if (db().prepare('SELECT id FROM accounts WHERE email=?').get(email)) throw new Error('That account already exists. Please sign in.');
        const result = db().prepare('INSERT INTO accounts(name,email,password,consent) VALUES(?,?,?,1)').run(name, email, hashPassword(password));
        user = { id: Number(result.lastInsertRowid), name, email };
        db().prepare('INSERT INTO profiles(user_id,data) VALUES(?,?)').run(user.id, JSON.stringify({ skills: '', qualifications: '', experience: '' }));
      } else {
        const row = db().prepare('SELECT * FROM accounts WHERE email=?').get(email) as (User & { password: string }) | undefined;
        if (!row || !checkPassword(password, row.password)) throw new Error('Email or password is incorrect.');
        user = { id: row.id, name: row.name, email: row.email };
      }
      const token = randomBytes(32).toString('hex');
      db().prepare('INSERT INTO sessions(token,user_id) VALUES(?,?)').run(token, user.id);
      const response = reply({ user });
      response.cookies.set('sb-session', token, { httpOnly: true, sameSite: 'lax', path: '/' });
      return response;
    }
    const token = request.cookies.get('sb-session')?.value || '';
    const user = userFor(token);
    if (!user) return reply({ error: 'Please sign in to continue.' }, 401);
    if (action === 'logout') {
      db().prepare('DELETE FROM sessions WHERE token=?').run(token);
      const response = reply({ ok: true }); response.cookies.delete('sb-session'); return response;
    }
    if (action === 'profile') {
      const profile = profileSchema.parse(body);
      db().prepare('UPDATE profiles SET data=? WHERE user_id=?').run(JSON.stringify(profile), user.id);
      return reply({ profile });
    }
    if (action === 'analyze') {
      profileSchema.parse(profileFor(user.id));
      const text = validateDescription(z.string().parse(body.text));
      const analysis = await analyzeJobDescription(text);
      const descriptionId = Number(db().prepare('INSERT INTO descriptions(user_id,text) VALUES(?,?)').run(user.id, text).lastInsertRowid);
      const id = Number(db().prepare('INSERT INTO analyses(user_id,description_id,data,model) VALUES(?,?,?,?)').run(user.id, descriptionId, JSON.stringify(analysis), modelName()).lastInsertRowid);
      return reply({ id, data: analysis, text, model: modelName(), saved: false });
    }
    if (action === 'save-analysis') {
      const id = idSchema.parse(body.id); owned('analyses', id, user.id);
      db().prepare('UPDATE analyses SET saved=1 WHERE id=? AND user_id=?').run(id, user.id);
      return reply({ ok: true });
    }
    if (action === 'compare') {
      const analysisId = idSchema.parse(body.analysisId);
      const row = owned('analyses', analysisId, user.id);
      if (!row.saved) throw new Error('Finish reviewing and save the analysis first.');
      const analysis = JSON.parse(String(row.data)) as Analysis;
      const profile = profileFor(user.id);
      const data = await compareProfile(analysis, profile);
      const id = Number(db().prepare('INSERT INTO comparisons(user_id,analysis_id,data,profile,model) VALUES(?,?,?,?,?)').run(user.id, analysisId, JSON.stringify(data), JSON.stringify(profile), modelName()).lastInsertRowid);
      return reply({ comparisonId: id });
    }
    if (action === 'calculate') {
      const row = owned('comparisons', idSchema.parse(body.comparisonId), user.id);
      const analysis = owned('analyses', Number(row.analysis_id), user.id);
      const data = calculateScore(JSON.parse(String(analysis.data)), JSON.parse(String(row.data)) as Comparison);
      return reply({ ...data, comparisonId: row.id, analysisId: row.analysis_id, title: JSON.parse(String(analysis.data)).title, profile: JSON.parse(String(row.profile)) as Profile, model: row.model });
    }
    if (action === 'save-score') {
      const row = owned('comparisons', idSchema.parse(body.comparisonId), user.id);
      const analysis = owned('analyses', Number(row.analysis_id), user.id);
      const result = { ...calculateScore(JSON.parse(String(analysis.data)), JSON.parse(String(row.data))), title: JSON.parse(String(analysis.data)).title, profile: JSON.parse(String(row.profile)), model: row.model };
      db().prepare('INSERT OR IGNORE INTO compatibilities(user_id,analysis_id,comparison_id,data) VALUES(?,?,?,?)').run(user.id, Number(row.analysis_id), Number(row.id), JSON.stringify(result));
      return reply({ ok: true });
    }
    if (action === 'optimize') {
      const profile = profileSchema.parse(profileFor(user.id));
      const result = await optimizeExperience(profile);
      const data = { ...result, original: profile.experience, profile, model: modelName() };
      const id = Number(db().prepare('INSERT INTO optimizations(user_id,data) VALUES(?,?)').run(user.id, JSON.stringify(data)).lastInsertRowid);
      return reply({ id, ...data, reviewed: false });
    }
    if (action === 'accept') {
      const row = owned('optimizations', idSchema.parse(body.id), user.id);
      if (body.reviewed !== true) throw new Error('Confirm that you reviewed the suggestion before accepting.');
      const suggested = z.string().trim().min(1, 'The suggested experience cannot be empty.').parse(body.suggested);
      const data = { ...JSON.parse(String(row.data)), suggested };
      db().prepare('UPDATE optimizations SET data=?,reviewed=1 WHERE id=? AND user_id=?').run(JSON.stringify(data), Number(row.id), user.id);
      return reply({ ok: true });
    }
    if (action === 'practice') {
      let text: string; let descriptionId: number | undefined;
      if (body.analysisId) {
        const analysis = owned('analyses', idSchema.parse(body.analysisId), user.id);
        if (!analysis.saved) throw new Error('Select a saved analysis.');
        descriptionId = Number(analysis.description_id);
        text = String(owned('descriptions', descriptionId, user.id).text);
      } else { text = validateDescription(z.string().parse(body.text)); }
      const result = await generateInterviewMaterials(text);
      if (!descriptionId) descriptionId = Number(db().prepare('INSERT INTO descriptions(user_id,text) VALUES(?,?)').run(user.id, text).lastInsertRowid);
      const data = { ...result, model: modelName(), analysisId: body.analysisId ? idSchema.parse(body.analysisId) : null };
      const id = Number(db().prepare('INSERT INTO materials(user_id,description_id,data) VALUES(?,?,?)').run(user.id, descriptionId, JSON.stringify(data)).lastInsertRowid);
      return reply({ id, ...data });
    }
    if (action === 'delete') {
      const id = idSchema.parse(body.id);
      const kind = z.enum(['analysis', 'score', 'optimization', 'materials']).parse(body.kind);
      const table = { analysis: 'analyses', score: 'compatibilities', optimization: 'optimizations', materials: 'materials' }[kind];
      const row = owned(table, id, user.id);
      db().prepare(`DELETE FROM ${table} WHERE id=? AND user_id=?`).run(id, user.id);
      if (kind === 'analysis' || kind === 'materials') {
        db().prepare('DELETE FROM descriptions WHERE id=? AND user_id=? AND NOT EXISTS(SELECT 1 FROM analyses WHERE description_id=descriptions.id) AND NOT EXISTS(SELECT 1 FROM materials WHERE description_id=descriptions.id)').run(Number(row.description_id), user.id);
      }
      return reply({ ok: true });
    }
    return reply({ error: 'Not found.' }, 404);
  } catch (error) {
    const message = error instanceof z.ZodError ? error.issues[0]?.message : error instanceof Error ? error.message : 'Something went wrong. Please try again.';
    return reply({ error: message }, 400);
  }
}
