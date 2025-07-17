import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const backendRoot = path.resolve(__dirname, '../backend/pet-feeder-backend');

function ensureDependencies() {
  if (!fs.existsSync(path.join(backendRoot, 'node_modules'))) {
    execSync('npm install', { cwd: backendRoot, stdio: 'inherit' });
  }
  console.log('Dependencies ready');
}

ensureDependencies();
