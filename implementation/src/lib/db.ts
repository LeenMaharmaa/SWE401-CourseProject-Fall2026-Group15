import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { sampleProfile, type Profile } from './domain';

export type User = { id: number; name: string; email: string };
type DB = InstanceType<typeof DatabaseSync>;
const state = globalThis as typeof globalThis & { skillbridgeDb?: DB };
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 32).toString('hex')}`;
}
export function checkPassword(password: string, encoded: string) {
  const [salt, hash] = encoded.split(':');
  return timingSafeEqual(scryptSync(password, salt, 32), Buffer.from(hash, 'hex'));
}
export function db() {
  if (state.skillbridgeDb) return state.skillbridgeDb;
  const filename = process.env.SKILLBRIDGE_DB || path.join(process.cwd(), 'data', 'skillbridge.db');
  if (filename !== ':memory:') mkdirSync(path.dirname(filename), { recursive: true });
  const database = new DatabaseSync(filename);
  database.exec(`PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, consent INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS profiles (user_id INTEGER PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS descriptions (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES accounts(id), text TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS analyses (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES accounts(id), description_id INTEGER NOT NULL REFERENCES descriptions(id) ON DELETE CASCADE, data TEXT NOT NULL, saved INTEGER NOT NULL DEFAULT 0, model TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')));
    CREATE TABLE IF NOT EXISTS comparisons (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES accounts(id), analysis_id INTEGER NOT NULL REFERENCES analyses(id) ON DELETE CASCADE, data TEXT NOT NULL, profile TEXT NOT NULL, model TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS compatibilities (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES accounts(id), analysis_id INTEGER NOT NULL REFERENCES analyses(id) ON DELETE CASCADE, comparison_id INTEGER NOT NULL UNIQUE REFERENCES comparisons(id) ON DELETE CASCADE, data TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')));
    CREATE TABLE IF NOT EXISTS optimizations (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES accounts(id), data TEXT NOT NULL, reviewed INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')));
    CREATE TABLE IF NOT EXISTS materials (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES accounts(id), description_id INTEGER NOT NULL REFERENCES descriptions(id), data TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')));
  `);
  if (!database.prepare('SELECT id FROM accounts WHERE email=?').get('demo@skillbridge.local')) {
    const result = database.prepare('INSERT INTO accounts(name,email,password,consent) VALUES(?,?,?,1)').run('Alex Morgan', 'demo@skillbridge.local', hashPassword('123456'));
    database.prepare('INSERT INTO profiles(user_id,data) VALUES(?,?)').run(result.lastInsertRowid, JSON.stringify(sampleProfile));
  }
  state.skillbridgeDb = database;
  return database;
}
export function profileFor(userId: number): Profile {
  const row = db().prepare('SELECT data FROM profiles WHERE user_id=?').get(userId) as { data: string } | undefined;
  return row ? JSON.parse(row.data) : { skills: '', qualifications: '', experience: '' };
}
export function userFor(token: string): User | null {
  return (db().prepare('SELECT a.id,a.name,a.email FROM accounts a JOIN sessions s ON s.user_id=a.id WHERE s.token=?').get(token) as User | undefined) ?? null;
}
export function owned(table: string, id: number, userId: number) {
  const tables = ['analyses', 'comparisons', 'compatibilities', 'optimizations', 'materials', 'descriptions'];
  if (!tables.includes(table)) throw new Error('Unknown record type.');
  const row = db().prepare(`SELECT * FROM ${table} WHERE id=? AND user_id=?`).get(id, userId);
  if (!row) throw new Error('That record is not available.');
  return row as Record<string, string | number>;
}
export function historyFor(userId: number) {
  const analyses = db().prepare(`SELECT a.id,a.data,a.model,a.created_at,d.text FROM analyses a JOIN descriptions d ON d.id=a.description_id WHERE a.user_id=? AND a.saved=1 ORDER BY a.id DESC`).all(userId).map(row => ({ ...row, kind: 'analysis', data: JSON.parse(String(row.data)) }));
  const scores = db().prepare(`SELECT c.id,c.analysis_id,c.data,c.created_at,a.data AS analysis FROM compatibilities c JOIN analyses a ON a.id=c.analysis_id WHERE c.user_id=? ORDER BY c.id DESC`).all(userId).map(row => ({ ...row, kind: 'score', data: JSON.parse(String(row.data)), analysis: JSON.parse(String(row.analysis)) }));
  const optimizations = db().prepare('SELECT id,data,created_at FROM optimizations WHERE user_id=? AND reviewed=1 ORDER BY id DESC').all(userId).map(row => ({ ...row, kind: 'optimization', data: JSON.parse(String(row.data)) }));
  const materials = db().prepare('SELECT id,data,created_at FROM materials WHERE user_id=? ORDER BY id DESC').all(userId).map(row => ({ ...row, kind: 'materials', data: JSON.parse(String(row.data)) }));
  return { analyses, scores, optimizations, materials };
}
