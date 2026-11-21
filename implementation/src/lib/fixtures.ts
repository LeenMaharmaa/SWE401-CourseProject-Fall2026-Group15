import { type Analysis, type Profile, type Comparison, sampleJob, sampleProfile } from './domain';
// Deliberately limited fixtures for the labelled sample rehearsal and automated checks.
// Other descriptions are rejected rather than presented as real analysis.
export const fixtureAnalysis: Analysis = {
  title: 'Junior Software Engineer', summary: 'A graduate opportunity focused on practical web development, collaboration, and a strong technical foundation.',
  required: [
    { id: 'r1', name: 'JavaScript', category: 'technical', source: 'JavaScript' },
    { id: 'r2', name: 'React', category: 'technical', source: 'React' },
    { id: 'r3', name: 'SQL', category: 'technical', source: 'SQL' },
    { id: 'r4', name: 'Git', category: 'technical', source: 'Git' },
    { id: 'r5', name: 'Communication', category: 'soft', source: 'communication' },
    { id: 'r6', name: "Bachelor's degree in Computer Science or related subject", category: 'qualification', source: "a bachelor's degree in Computer Science or a related subject" },
    { id: 'r7', name: 'REST APIs', category: 'technical', source: 'REST APIs' },
    { id: 'r8', name: 'Teamwork', category: 'soft', source: 'work effectively with a team' }
  ],
  optional: [{ id: 'o1', name: 'TypeScript', category: 'technical', source: 'TypeScript' }, { id: 'o2', name: 'Docker', category: 'technical', source: 'Docker' }],
  terms: [{ term: 'REST APIs', explanation: 'A common way for applications to exchange information over the web using HTTP requests.' }, { term: 'SQL', explanation: 'A language for storing, retrieving, and updating information in relational databases.' }, { term: 'Docker', explanation: 'A tool for packaging an application and its dependencies into a consistent environment.' }, { term: 'TypeScript', explanation: 'JavaScript with type checking that helps catch mistakes during development.' }]
};
export function requireSampleJob(text: string) {
  if (text.trim() !== sampleJob.trim()) throw new Error('Sample rehearsal supports the supplied example only. Choose Use sample description, or restart in live mode for your own input.');
}
export function fixtureComparison(analysis: Analysis, profile: Profile): Comparison {
  if (JSON.stringify(profile) !== JSON.stringify(sampleProfile)) throw new Error('Sample rehearsal uses the original fictional demo profile. Restore the sample profile, or use live mode for a different background.');
  return { matches: [...analysis.required, ...analysis.optional].map(item => {
    const evidence: Record<string, string> = { r1: 'JavaScript', r2: 'React', r3: 'SQL', r4: 'Git', r5: 'Presented the application to classmates', r6: "Bachelor's degree in Computer Science", r8: 'coordinated tasks with three teammates' };
    return { requirementId: item.id, status: evidence[item.id] ? 'direct' : 'none', evidence: evidence[item.id] || '', reason: evidence[item.id] ? 'The supplied profile directly supports this requirement.' : 'No supporting evidence is included in the supplied profile.' };
  }) };
}
export const fixtureOptimization = {
  suggested: 'Developed a React incident tracker in a university team project, using JavaScript for the interface, SQL for incident records, and Git for version control. Coordinated tasks with three teammates and presented the application to classmates.',
  changes: ['Started with a clear action verb.', 'Grouped tools with the work they supported.', 'Made teamwork and presentation experience easier to find.'],
  sources: ['Built a React incident tracker as a university team project.', 'coordinated tasks with three teammates']
};
export const fixtureMaterials = {
  title: 'Junior Software Engineer interview preparation',
  questions: [
    { question: 'How would you organize a small React application?', suggestedAnswer: 'Explain how you separate reusable components, page state, and data access. Use a real project if you have one; describe your own contribution honestly.' },
    { question: 'What is the difference between JavaScript and TypeScript?', suggestedAnswer: 'JavaScript runs the application logic. TypeScript adds type checks during development, which can make incorrect assumptions easier to catch.' },
    { question: 'How would you retrieve incidents from a SQL database?', suggestedAnswer: 'Describe SELECT, filtering with WHERE, ordering results, and parameterized queries. Discuss a real example only if you have used it.' },
    { question: 'What does a REST API do?', suggestedAnswer: 'It exposes resources through web requests. Describe a client requesting data and a server returning a response, often as JSON.' },
    { question: 'How would you work with a teammate using Git?', suggestedAnswer: 'Explain committing focused changes, working on branches, reviewing differences, and resolving conflicts together. Adapt this to your actual experience.' },
    { question: 'How do you approach an unfamiliar technology?', suggestedAnswer: 'Outline the steps you would take: identify the task, consult official documentation, build a small example, and check the result. Add a real example if available.' }
  ],
  notes: ['Prepare a short explanation of a genuine project and your contribution.', 'Review React state, JavaScript fundamentals, SQL, and Git.', 'Explain missing skills honestly and describe a practical learning plan.', 'Use suggested answers as preparation, not as claims about experience you do not have.']
};
