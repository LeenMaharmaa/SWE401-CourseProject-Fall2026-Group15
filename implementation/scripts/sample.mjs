import { spawn } from 'node:child_process';
// Explicit rehearsal mode. Never used as an automatic fallback for live requests.
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--hostname', '127.0.0.1'], {
  stdio: 'inherit', env: { ...process.env, SKILLBRIDGE_SAMPLE_MODE: '1' }
});
child.on('exit', code => process.exit(code ?? 0));
