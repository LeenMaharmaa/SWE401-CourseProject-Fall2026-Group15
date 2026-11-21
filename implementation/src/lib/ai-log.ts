import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

type Event = { requestId: string; operation: string; model: string; elapsedMs?: number; status?: number; providerStatus?: string; errorName?: string; message?: string };
export function redactSecrets(message: string, secret = process.env.GEMINI_API_KEY) {
  let safe = secret ? message.split(secret).join('[REDACTED]') : message;
  safe = safe.replace(/AIza[\w-]+/g, '[REDACTED]')
    .replace(/((?:x-goog-api-key|api[_-]?key|authorization)\s*["']?\s*[:=]\s*["']?)[^\s"',}]+/gi, '$1[REDACTED]');
  return safe.slice(0, 2000);
}
export function errorDetails(error: unknown) {
  const value = error as { name?: string; message?: string; status?: number; cause?: { code?: string } } | null;
  let message = value?.message || 'Unknown error';
  let status = value?.status;
  let providerStatus: string | undefined;
  try { const parsed = JSON.parse(message); if (parsed.error) { message = String(parsed.error.message || message); status ??= parsed.error.code; providerStatus = parsed.error.status; } } catch { /* SDK may return a plain error message. */ }
  if (value?.name === 'ZodError') message = 'The generated output did not match the required structure.';
  if (value?.name === 'SyntaxError') message = 'The generated output was not valid JSON.';
  return { status, providerStatus, errorName: value?.name || 'Error', message: redactSecrets(message) + (value?.cause?.code ? ` (${redactSecrets(value.cause.code)})` : '') };
}
export function logAIEvent(event: 'started' | 'completed' | 'failed', details: Event) {
  const entry = { time: new Date().toISOString(), event, ...details, ...(details.message ? { message: redactSecrets(details.message) } : {}) };
  const line = JSON.stringify(entry);
  if (event === 'failed') console.error(`[SkillBridge] ${line}`); else console.info(`[SkillBridge] ${line}`);
  try {
    const directory = process.env.SKILLBRIDGE_LOG_DIR || path.join(process.cwd(), 'logs');
    mkdirSync(directory, { recursive: true });
    appendFileSync(path.join(directory, 'ai.log'), line + '\n', 'utf8');
  } catch { console.error('[SkillBridge] Could not write logs/ai.log. Error details are available in this terminal.'); }
}
