import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScore, sampleJob, sampleProfile, validateAnalysis, validateComparison, validateDescription, validateOptimization, wordCount } from '../src/lib/domain';
import { fixtureAnalysis, fixtureComparison, fixtureOptimization } from '../src/lib/fixtures';

test('description accepts the boundary and rejects empty or oversized input', () => {
  assert.equal(wordCount('   '), 0);
  assert.throws(() => validateDescription(' \n '), /enter a job/);
  assert.equal(wordCount(validateDescription('word '.repeat(1500))), 1500);
  assert.throws(() => validateDescription('word '.repeat(1501)), /1,500/);
});
test('weighted score uses required and optional weights, partial credits and rounding', () => {
  const a = structuredClone(fixtureAnalysis);
  a.required = a.required.slice(0, 2); a.optional = a.optional.slice(0, 1);
  const c = { matches: [{ requirementId: 'r1', status: 'direct' as const, evidence: 'JavaScript', reason: 'Present' }, { requirementId: 'r2', status: 'partial' as const, evidence: 'React', reason: 'Foundation' }, { requirementId: 'o1', status: 'none' as const, evidence: '', reason: 'Not present' }] };
  assert.equal(calculateScore(a, c).score, 60);
  assert.equal(calculateScore(a, c).earned, 3);
  assert.equal(calculateScore(a, c).total, 5);
  a.optional = []; c.matches.pop();
  assert.equal(calculateScore(a, c).score, 75);
});
test('sample analysis is grounded, and supplied comparison gives 78 percent', () => {
  const a = validateAnalysis(fixtureAnalysis, sampleJob);
  const c = validateComparison(fixtureComparison(a, sampleProfile), a, sampleProfile);
  assert.equal(calculateScore(a, c).score, 78);
});
test('incomplete, duplicate or ungrounded comparisons cannot produce a valid result', () => {
  const a = structuredClone(fixtureAnalysis); const c = fixtureComparison(a, sampleProfile);
  assert.throws(() => validateComparison({ matches: c.matches.slice(1) }, a, sampleProfile), /incomplete/);
  c.matches[0].evidence = 'Invented professional JavaScript job';
  assert.throws(() => validateComparison(c, a, sampleProfile), /unsupported/);
  assert.throws(() => calculateScore({ ...a, required: [], optional: [] }, { matches: [] }), /No usable/);
});
test('bad model output and invented source references are rejected', () => {
  assert.throws(() => validateAnalysis({ title: 'only title' }, sampleJob));
  const a = structuredClone(fixtureAnalysis); a.required[0].source = 'Unmentioned certification';
  assert.throws(() => validateAnalysis(a, sampleJob), /unsupported/);
  assert.ok(validateOptimization(fixtureOptimization, sampleProfile));
  assert.throws(() => validateOptimization({ ...fixtureOptimization, sources: ['Managed a department'] }, sampleProfile), /outside/);
});
