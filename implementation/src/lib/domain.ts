import { z } from 'zod';

export const sampleJob = `Junior Software Engineer at Violet Labs\nWe are looking for a graduate developer to build useful web applications.\nRequired: JavaScript, React, SQL, Git, communication, and a bachelor's degree in Computer Science or a related subject.\nYou should understand REST APIs and work effectively with a team.\nNice to have: TypeScript and Docker.\nProjects and internships are welcome; professional experience is not required.`;
export const sampleProfile = {
  skills: 'JavaScript, React, SQL, Git, teamwork, communication',
  qualifications: "Bachelor's degree in Computer Science, Abu Dhabi University (2026).",
  experience: 'Built a React incident tracker as a university team project. Used JavaScript for the interface, SQL for incident records, and Git for version control. Presented the application to classmates and coordinated tasks with three teammates. No professional experience yet.'
};
export const profileSchema = z.object({ skills: z.string().trim().min(1, 'Add your skills.'), qualifications: z.string().trim().min(1, 'Add your qualifications.'), experience: z.string().trim().min(1, 'Add your experience or explicitly state that you have none yet.') });
export type Profile = z.infer<typeof profileSchema>;
export function wordCount(text: string) { return text.trim() ? text.trim().split(/\s+/u).length : 0; }
export function validateDescription(text: string) {
  if (!text.trim()) throw new Error('Please enter a job description.');
  if (wordCount(text) > 1500) throw new Error('Maximum length is 1,500 words.');
  return text.trim();
}
const requirementSchema = z.object({ id: z.string().min(1), name: z.string().min(1), category: z.enum(['technical', 'soft', 'qualification', 'experience']), source: z.string().min(1) });
export const analysisSchema = z.object({ title: z.string().min(1), summary: z.string().min(1), required: z.array(requirementSchema).min(1), optional: z.array(requirementSchema), terms: z.array(z.object({ term: z.string().min(1), explanation: z.string().min(1) })) });
export type Analysis = z.infer<typeof analysisSchema>;
export type Requirement = z.infer<typeof requirementSchema>;
export const comparisonSchema = z.object({ matches: z.array(z.object({ requirementId: z.string(), status: z.enum(['direct', 'partial', 'none']), evidence: z.string(), reason: z.string().min(1) })) });
export type Comparison = z.infer<typeof comparisonSchema>;
export const optimizationSchema = z.object({ suggested: z.string().min(1), changes: z.array(z.string()).min(1), sources: z.array(z.string().min(1)).min(1) });
export type Optimization = z.infer<typeof optimizationSchema>;
export const materialsSchema = z.object({ title: z.string().min(1), questions: z.array(z.object({ question: z.string().min(1), suggestedAnswer: z.string().min(1) })).min(1).max(8), notes: z.array(z.string().min(1)).min(1) });
export type Materials = z.infer<typeof materialsSchema>;
export const disclaimer = 'This score is an estimate and does not guarantee being hired.';
const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, ' ').trim();
export function validateAnalysis(value: unknown, text: string): Analysis {
  const result = analysisSchema.parse(value);
  const seen = new Set<string>();
  for (const list of ['required', 'optional'] as const) {
    result[list] = result[list].filter(item => {
      if (!normalize(text).includes(normalize(item.source))) throw new Error('The analysis contains an unsupported job requirement. Please try again.');
      const key = normalize(item.name);
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
  }
  const ids = [...result.required, ...result.optional].map(i => i.id);
  if (new Set(ids).size !== ids.length) throw new Error('The analysis contains duplicate identifiers. Please try again.');
  return result;
}
export function validateComparison(value: unknown, analysis: Analysis, profile: Profile): Comparison {
  const comparison = comparisonSchema.parse(value);
  const items = [...analysis.required, ...analysis.optional];
  if (comparison.matches.length !== items.length || new Set(comparison.matches.map(m => m.requirementId)).size !== items.length || comparison.matches.some(m => !items.some(i => i.id === m.requirementId))) throw new Error('The comparison is incomplete. Please retry comparison.');
  const background = normalize(Object.values(profile).join('\n'));
  for (const match of comparison.matches) {
    if (match.status !== 'none' && (!match.evidence.trim() || !background.includes(normalize(match.evidence)))) throw new Error('The comparison contains unsupported profile evidence. Please retry comparison.');
  }
  return comparison;
}
export function validateOptimization(value: unknown, profile: Profile) {
  const result = optimizationSchema.parse(value);
  const background = normalize(Object.values(profile).join('\n'));
  if (result.sources.some(source => !background.includes(normalize(source)))) throw new Error('The suggestion references information outside your profile. Please try again.');
  return result;
}
export function calculateScore(analysis: Analysis, comparison: Comparison) {
  const items = [...analysis.required.map(i => ({ ...i, weight: 2 })), ...analysis.optional.map(i => ({ ...i, weight: 1 }))];
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  if (!total) throw new Error('No usable requirements were found.');
  if (comparison.matches.length !== items.length || new Set(comparison.matches.map(m => m.requirementId)).size !== items.length) throw new Error('The comparison is incomplete.');
  const rows = items.map(item => {
    const match = comparison.matches.find(m => m.requirementId === item.id);
    if (!match) throw new Error('A requirement is missing from the comparison.');
    return { ...item, ...match, credit: match.status === 'direct' ? 1 : match.status === 'partial' ? 0.5 : 0 };
  });
  const earned = rows.reduce((sum, item) => sum + item.weight * item.credit, 0);
  const score = Math.round(100 * earned / total);
  const direct = rows.filter(r => r.status === 'direct').length;
  const partial = rows.filter(r => r.status === 'partial').length;
  const missing = rows.filter(r => r.status === 'none').length;
  return { score, rows, earned, total, explanation: `${direct} direct matches, ${partial} partial or transferable matches, and ${missing} items without supporting evidence. Required items count twice as much as optional items. You earned ${earned} of ${total} weighted points.`, disclaimer, scoringVersion: 'weighted-v1' };
}
export type Score = ReturnType<typeof calculateScore>;
