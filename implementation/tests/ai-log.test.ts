import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { errorDetails, logAIEvent, redactSecrets } from '../src/lib/ai-log';

test('provider errors remain readable while API keys are removed from persisted logs', () => {
  const secret = 'private-test-value';
  assert.equal(redactSecrets(`secret=${secret}`, secret), 'secret=[REDACTED]');
  assert.ok(!redactSecrets('x-goog-api-key: hidden-value').includes('hidden-value'));
  const details = errorDetails({ name: 'ApiError', status: 504, message: JSON.stringify({ error: { code: 504, status: 'DEADLINE_EXCEEDED', message: 'Deadline expired. x-goog-api-key: hidden-value' } }) });
  assert.equal(details.providerStatus, 'DEADLINE_EXCEEDED');
  const directory = mkdtempSync(path.join(tmpdir(), 'skillbridge-log-test-'));
  process.env.SKILLBRIDGE_LOG_DIR = directory;
  try {
    logAIEvent('failed', { requestId: 'test-request', operation: 'analysis', model: 'test-model', elapsedMs: 90000, ...details });
    const text = readFileSync(path.join(directory, 'ai.log'), 'utf8');
    assert.ok(!text.includes('hidden-value'));
    const record = JSON.parse(text);
    assert.equal(record.status, 504);
    assert.equal(record.elapsedMs, 90000);
    assert.match(record.message, /Deadline expired/);
  } finally { delete process.env.SKILLBRIDGE_LOG_DIR; rmSync(path.join(directory, 'ai.log')); rmdirSync(directory); }
});
