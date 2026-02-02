#!/usr/bin/env node

/**
 * CBT Framework Update Checker
 * Runs on Claude Code session start to check for updates.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const VERSION_FILE = path.join(os.homedir(), '.claude', 'cbt-framework', 'VERSION');
const PACKAGE_NAME = 'cbt-framework';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

function getCurrentVersion() {
  try {
    if (fs.existsSync(VERSION_FILE)) {
      return fs.readFileSync(VERSION_FILE, 'utf8').trim();
    }
  } catch (e) {
    // Ignore errors
  }
  return null;
}

function getLatestVersion() {
  return new Promise((resolve, reject) => {
    const url = `https://registry.npmjs.org/${PACKAGE_NAME}/latest`;

    https.get(url, { timeout: 3000 }, (res) => {
      let data = '';

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.version);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function compareVersions(current, latest) {
  if (!current || !latest) return false;

  const currentParts = current.split('.').map(Number);
  const latestParts = latest.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const curr = currentParts[i] || 0;
    const lat = latestParts[i] || 0;

    if (lat > curr) return true;
    if (lat < curr) return false;
  }

  return false;
}

async function checkForUpdates() {
  const currentVersion = getCurrentVersion();

  if (!currentVersion) {
    // CBT not installed or version file missing
    return;
  }

  const latestVersion = await getLatestVersion();

  if (latestVersion && compareVersions(currentVersion, latestVersion)) {
    console.log('');
    console.log(`${colors.yellow}CBT Framework update available: ${currentVersion} → ${latestVersion}${colors.reset}`);
    console.log(`${colors.dim}Run /cbt:update to update${colors.reset}`);
    console.log('');
  }
}

// Run check
checkForUpdates().catch(() => {
  // Silently ignore errors - don't interrupt user session
});
