#!/usr/bin/env node

/**
 * Creativa Automatic GitHub Sync & Deploy Script
 * Verifies build integrity, stages all changes, creates a semantic commit,
 * and pushes directly to origin main so Vercel and GitHub reflect changes immediately.
 */

import { execSync } from 'child_process';
import fs from 'fs';

const gitBin = fs.existsSync('/usr/bin/git') ? '/usr/bin/git' : 'git';

function run(cmd, desc) {
  console.log(`\n⏳ ${desc}...`);
  try {
    const fullCmd = cmd.startsWith('git ') ? cmd.replace(/^git /, `${gitBin} `) : cmd;
    execSync(fullCmd, { 
      stdio: 'inherit', 
      encoding: 'utf-8',
      env: {
        ...process.env,
        PATH: `/usr/bin:/bin:/usr/sbin:/sbin:${process.env.PATH || ''}`
      }
    });
    return true;
  } catch (error) {
    console.error(`\n❌ Error during: ${desc}`);
    process.exit(1);
  }
}

console.log('🚀 Initiating automated GitHub sync & verification...');

// 1. Verify build
run('npm run build', 'Running production build validation');

// 2. Stage changes
run('git add -A', 'Staging all modified and new files');

// 3. Commit if changes exist
try {
  const status = execSync(`${gitBin} status --porcelain`, { 
    encoding: 'utf-8',
    env: {
      ...process.env,
      PATH: `/usr/bin:/bin:/usr/sbin:/sbin:${process.env.PATH || ''}`
    }
  });
  if (status.trim().length === 0) {
    console.log('\n✨ No unstaged or uncommitted changes detected. Repository is clean!');
  } else {
    const customMsg = process.argv.slice(2).join(' ').trim();
    const commitMsg = customMsg || `chore: automated sync and deployment updates [${new Date().toISOString()}]`;
    run(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, `Committing changes: "${commitMsg}"`);
  }
} catch (e) {
  // If commit fails due to nothing to commit, continue to push
}

// 4. Push to remote
run('git push origin main', 'Pushing to GitHub (origin/main)');

console.log('\n✅ Successfully synchronized and pushed to GitHub!');
console.log('🔗 Repository: https://github.com/iamTechieAman/creativa');
console.log('⚡ Changes are now live and reflecting automatically on GitHub & Vercel.\n');
