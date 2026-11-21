import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { db, checkPassword, historyFor, owned, profileFor } from '../src/lib/db';
import { fixtureAnalysis } from '../src/lib/fixtures';

test('local seed, ownership, save visibility, persistence and dependent deletion', () => {
  const folder = mkdtempSync(path.join(tmpdir(), 'skillbridge-test-'));
  process.env.SKILLBRIDGE_DB = path.join(folder, 'test.db');
  const database = db();
  try {
    const user = database.prepare('SELECT * FROM accounts WHERE email=?').get('demo@skillbridge.local')!;
    assert.ok(checkPassword('123456', String(user.password)));
    assert.ok(profileFor(Number(user.id)).skills.includes('React'));
    const d = database.prepare('INSERT INTO descriptions(user_id,text) VALUES(?,?)').run(Number(user.id), 'sample');
    const a = database.prepare('INSERT INTO analyses(user_id,description_id,data,model) VALUES(?,?,?,?)').run(Number(user.id), d.lastInsertRowid, JSON.stringify(fixtureAnalysis), 'fixture');
    assert.equal(historyFor(Number(user.id)).analyses.length, 0);
    database.prepare('UPDATE analyses SET saved=1 WHERE id=?').run(a.lastInsertRowid);
    assert.equal(historyFor(Number(user.id)).analyses.length, 1);
    assert.throws(() => owned('analyses', Number(a.lastInsertRowid), 9999), /not available/);
    const second = new DatabaseSync(process.env.SKILLBRIDGE_DB);
    assert.equal(Number(second.prepare('SELECT COUNT(*) AS n FROM analyses WHERE saved=1').get()!.n), 1); second.close();
    const c = database.prepare('INSERT INTO comparisons(user_id,analysis_id,data,profile,model) VALUES(?,?,?,?,?)').run(Number(user.id), a.lastInsertRowid, '{}', '{}', 'fixture');
    database.prepare('INSERT INTO compatibilities(user_id,analysis_id,comparison_id,data) VALUES(?,?,?,?)').run(Number(user.id), a.lastInsertRowid, c.lastInsertRowid, '{}');
    database.prepare('DELETE FROM analyses WHERE id=?').run(a.lastInsertRowid);
    assert.equal(Number(database.prepare('SELECT COUNT(*) AS n FROM compatibilities').get()!.n), 0);
    assert.equal(Number(database.prepare('SELECT COUNT(*) AS n FROM comparisons').get()!.n), 0);
  } finally { database.close(); delete (globalThis as { skillbridgeDb?: DatabaseSync }).skillbridgeDb; rmSync(path.join(folder, 'test.db'), { force: true }); rmdirSync(folder); }
});
