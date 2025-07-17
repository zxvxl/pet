import { spawn } from 'child_process';
import * as path from 'path';

const backendRoot = path.resolve(__dirname, '../backend/pet-feeder-backend');

const ps = spawn('npm', ['run', 'start'], { cwd: backendRoot, env: { ...process.env, PORT: '0' }, stdio: 'inherit' });

ps.on('exit', (code) => {
  console.log('Backend exited with', code);
});
