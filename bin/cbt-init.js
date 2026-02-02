#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const CLAUDE_DIR = path.join(os.homedir(), '.claude');
const CBT_DIR = path.join(CLAUDE_DIR, 'cbt-framework');
const COMMANDS_DIR = path.join(CLAUDE_DIR, 'commands', 'cbt');
const AGENTS_DIR = path.join(CLAUDE_DIR, 'agents');
const HOOKS_DIR = path.join(CLAUDE_DIR, 'hooks');

const VERSION = '1.0.0';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  dim: '\x1b[2m'
};

function log(msg, color = '') {
  console.log(`${color}${msg}${colors.reset}`);
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function updateSettings() {
  const settingsPath = path.join(CLAUDE_DIR, 'settings.json');
  let settings = {};

  if (fs.existsSync(settingsPath)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    } catch (e) {
      settings = {};
    }
  }

  // Add CBT hooks
  if (!settings.hooks) {
    settings.hooks = {};
  }

  if (!settings.hooks.SessionStart) {
    settings.hooks.SessionStart = [];
  }

  // Check if CBT update hook already exists
  const hasUpdateHook = settings.hooks.SessionStart.some(h =>
    h.hooks && h.hooks.some(hook =>
      hook.command && hook.command.includes('cbt-check-update.js')
    )
  );

  if (!hasUpdateHook) {
    settings.hooks.SessionStart.push({
      hooks: [{
        type: 'command',
        command: `node ${path.join(HOOKS_DIR, 'cbt-check-update.js')}`
      }]
    });
  }

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

function install() {
  log('\n  CBT Framework Installer', colors.bright + colors.cyan);
  log('  ========================\n', colors.cyan);

  // Check if Claude Code directory exists
  if (!fs.existsSync(CLAUDE_DIR)) {
    log('  Creating ~/.claude directory...', colors.dim);
    fs.mkdirSync(CLAUDE_DIR, { recursive: true });
  }

  const packageDir = path.resolve(__dirname, '..');

  // Check for existing installation
  const versionFile = path.join(CBT_DIR, 'VERSION');
  if (fs.existsSync(versionFile)) {
    const existingVersion = fs.readFileSync(versionFile, 'utf8').trim();
    log(`  Existing installation found: v${existingVersion}`, colors.yellow);
    log(`  Upgrading to: v${VERSION}\n`, colors.yellow);
  }

  // Copy directories
  log('  Installing components...', colors.dim);

  // Commands
  log('    - Commands (/cbt:*)', colors.green);
  copyDir(path.join(packageDir, 'commands', 'cbt'), COMMANDS_DIR);

  // Agents
  log('    - Agents (cbt-*)', colors.green);
  const agentsSrc = path.join(packageDir, 'agents');
  if (fs.existsSync(agentsSrc)) {
    const agentFiles = fs.readdirSync(agentsSrc);
    for (const file of agentFiles) {
      fs.copyFileSync(
        path.join(agentsSrc, file),
        path.join(AGENTS_DIR, file)
      );
    }
  }

  // CBT Framework directory (templates, references, workflows, engine)
  log('    - Templates', colors.green);
  log('    - References', colors.green);
  log('    - Workflows', colors.green);
  log('    - Backtest Engine', colors.green);

  if (!fs.existsSync(CBT_DIR)) {
    fs.mkdirSync(CBT_DIR, { recursive: true });
  }

  copyDir(path.join(packageDir, 'templates'), path.join(CBT_DIR, 'templates'));
  copyDir(path.join(packageDir, 'references'), path.join(CBT_DIR, 'references'));
  copyDir(path.join(packageDir, 'workflows'), path.join(CBT_DIR, 'workflows'));
  copyDir(path.join(packageDir, 'engine'), path.join(CBT_DIR, 'engine'));

  // Hooks
  log('    - Hooks', colors.green);
  copyDir(path.join(packageDir, 'hooks'), HOOKS_DIR);

  // Version file
  fs.writeFileSync(versionFile, VERSION);

  // Update settings
  log('    - Settings', colors.green);
  updateSettings();

  log('\n  Installation complete!', colors.bright + colors.green);
  log('\n  -------------------------', colors.dim);
  log('  Quick Start:', colors.bright);
  log('    1. Open Claude Code in your project', colors.dim);
  log('    2. Run: /cbt:new my_strategy', colors.cyan);
  log('    3. Follow the guided workflow', colors.dim);
  log('\n  Commands:', colors.bright);
  log('    /cbt:help      - Show all commands', colors.dim);
  log('    /cbt:new       - Create new strategy', colors.dim);
  log('    /cbt:discover  - Define strategy logic', colors.dim);
  log('    /cbt:research  - Deep research phase', colors.dim);
  log('    /cbt:build     - Generate code', colors.dim);
  log('    /cbt:run       - Run backtest', colors.dim);
  log('    /cbt:iterate   - Optimization loop', colors.dim);
  log('\n  Documentation:', colors.bright);
  log('    https://github.com/TradeWithAI/cbt-framework\n', colors.cyan);
}

function uninstall() {
  log('\n  Uninstalling CBT Framework...', colors.yellow);

  // Remove directories
  if (fs.existsSync(CBT_DIR)) {
    fs.rmSync(CBT_DIR, { recursive: true });
    log('    - Removed cbt-framework/', colors.dim);
  }

  if (fs.existsSync(COMMANDS_DIR)) {
    fs.rmSync(COMMANDS_DIR, { recursive: true });
    log('    - Removed commands/cbt/', colors.dim);
  }

  // Remove agent files
  if (fs.existsSync(AGENTS_DIR)) {
    const files = fs.readdirSync(AGENTS_DIR);
    for (const file of files) {
      if (file.startsWith('cbt-')) {
        fs.unlinkSync(path.join(AGENTS_DIR, file));
        log(`    - Removed agents/${file}`, colors.dim);
      }
    }
  }

  // Remove hooks
  const hooksToRemove = ['cbt-check-update.js', 'cbt-statusline.js'];
  for (const hook of hooksToRemove) {
    const hookPath = path.join(HOOKS_DIR, hook);
    if (fs.existsSync(hookPath)) {
      fs.unlinkSync(hookPath);
      log(`    - Removed hooks/${hook}`, colors.dim);
    }
  }

  log('\n  CBT Framework uninstalled.\n', colors.green);
}

// Main
const args = process.argv.slice(2);

if (args.includes('--uninstall') || args.includes('-u')) {
  uninstall();
} else if (args.includes('--help') || args.includes('-h')) {
  log('\n  CBT Framework - Claude Backtest Framework\n', colors.bright);
  log('  Usage:', colors.bright);
  log('    npx cbt-framework           Install/update CBT Framework', colors.dim);
  log('    npx cbt-framework --uninstall   Remove CBT Framework', colors.dim);
  log('    npx cbt-framework --help        Show this help\n', colors.dim);
} else {
  install();
}
