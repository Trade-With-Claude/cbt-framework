#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const CLAUDE_DIR = path.join(os.homedir(), '.claude');
const CBT_DIR = path.join(CLAUDE_DIR, 'cbt-framework');
const COMMANDS_DIR = path.join(CLAUDE_DIR, 'commands', 'cbt');
const AGENTS_DIR = path.join(CLAUDE_DIR, 'agents');
const HOOKS_DIR = path.join(CLAUDE_DIR, 'hooks');

const VERSION = '1.2.5';

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

function loadMCPConfig() {
  const mcpPath = path.join(CLAUDE_DIR, '.mcp.json');
  let mcpConfig = {};

  if (fs.existsSync(mcpPath)) {
    try {
      mcpConfig = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
    } catch (e) {
      mcpConfig = {};
    }
  }

  if (!mcpConfig.mcpServers) {
    mcpConfig.mcpServers = {};
  }

  return mcpConfig;
}

function saveMCPConfig(mcpConfig) {
  const mcpPath = path.join(CLAUDE_DIR, '.mcp.json');
  fs.writeFileSync(mcpPath, JSON.stringify(mcpConfig, null, 2));
}

async function setupMCP() {
  const mcpConfig = loadMCPConfig();
  let added = 0;

  // --- Context7 (no API key needed) ---
  if (!mcpConfig.mcpServers.context7) {
    log('  1/3  Context7 - Library Documentation', colors.bright);
    log('       Gives Claude access to up-to-date docs (pandas, numpy, ccxt...)', colors.dim);
    log('       Package: @upstash/context7-mcp (open source, no key needed)', colors.dim);
    log('', colors.reset);
    const answer = await askQuestion(`       ${colors.cyan}Install Context7? (Y/n): ${colors.reset}`);
    if (answer !== 'n' && answer !== 'no') {
      mcpConfig.mcpServers.context7 = {
        command: 'npx',
        args: ['-y', '@upstash/context7-mcp@latest']
      };
      log('       Added!', colors.green);
      added++;
    } else {
      log('       Skipped.', colors.dim);
    }
    log('', colors.reset);
  } else {
    log('  1/3  Context7 - already configured', colors.dim);
    log('', colors.reset);
  }

  // --- Alpha Vantage (free API key) ---
  if (!mcpConfig.mcpServers.alphavantage) {
    log('  2/3  Alpha Vantage - Market & Macro Data', colors.bright);
    log('       Stocks, forex, crypto prices + macro indicators (CPI, GDP, rates)', colors.dim);
    log('       Free API key from: https://www.alphavantage.co/support/#api-key', colors.dim);
    log('', colors.reset);
    const answer = await askQuestion(`       ${colors.cyan}Install Alpha Vantage? (Y/n): ${colors.reset}`);
    if (answer !== 'n' && answer !== 'no') {
      const apiKey = await askQuestion(`       ${colors.cyan}Paste your Alpha Vantage API key: ${colors.reset}`, true);
      if (apiKey && apiKey.length > 3) {
        mcpConfig.mcpServers.alphavantage = {
          url: `https://mcp.alphavantage.co/mcp?apikey=${apiKey}`
        };
        log('       Added!', colors.green);
        added++;
      } else {
        log('       Invalid key, skipped. You can add it later in ~/.claude/.mcp.json', colors.yellow);
      }
    } else {
      log('       Skipped.', colors.dim);
    }
    log('', colors.reset);
  } else {
    log('  2/3  Alpha Vantage - already configured', colors.dim);
    log('', colors.reset);
  }

  // --- FRED (free API key) ---
  if (!mcpConfig.mcpServers.fred) {
    log('  3/3  FRED - Federal Reserve Economic Data', colors.bright);
    log('       840,000+ economic time series (GDP, CPI, M2, yield curves, etc.)', colors.dim);
    log('       Free API key from: https://fred.stlouisfed.org/docs/api/api_key.html', colors.dim);
    log('', colors.reset);
    const answer = await askQuestion(`       ${colors.cyan}Install FRED? (Y/n): ${colors.reset}`);
    if (answer !== 'n' && answer !== 'no') {
      const apiKey = await askQuestion(`       ${colors.cyan}Paste your FRED API key: ${colors.reset}`, true);
      if (apiKey && apiKey.length > 10) {
        mcpConfig.mcpServers.fred = {
          command: 'npx',
          args: ['-y', 'fred-mcp-server'],
          env: {
            FRED_API_KEY: apiKey
          }
        };
        log('       Added!', colors.green);
        added++;
      } else {
        log('       Invalid key, skipped. You can add it later in ~/.claude/.mcp.json', colors.yellow);
      }
    } else {
      log('       Skipped.', colors.dim);
    }
    log('', colors.reset);
  } else {
    log('  3/3  FRED - already configured', colors.dim);
    log('', colors.reset);
  }

  saveMCPConfig(mcpConfig);
  return added;
}

async function askQuestion(question, preserveCase = false) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(preserveCase ? answer.trim() : answer.trim().toLowerCase());
    });
  });
}

async function install() {
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

  // Commands (21 commands)
  log('    - Commands (/cbt:* - 21 commands)', colors.green);
  copyDir(path.join(packageDir, 'commands', 'cbt'), COMMANDS_DIR);

  // Agents (4 agents)
  log('    - Agents (cbt-analyzer, cbt-researcher, cbt-builder, cbt-eda)', colors.green);
  const agentsSrc = path.join(packageDir, 'agents');
  if (fs.existsSync(agentsSrc)) {
    if (!fs.existsSync(AGENTS_DIR)) {
      fs.mkdirSync(AGENTS_DIR, { recursive: true });
    }
    const agentFiles = fs.readdirSync(agentsSrc);
    for (const file of agentFiles) {
      fs.copyFileSync(
        path.join(agentsSrc, file),
        path.join(AGENTS_DIR, file)
      );
    }
  }

  // CBT Framework directory (templates, references, workflows, engine)
  log('    - Templates (pandas + fast engine)', colors.green);
  log('    - Live bot templates (4 exchanges + notifications)', colors.green);
  log('    - References (6 guides)', colors.green);
  log('    - Backtest Engine', colors.green);

  if (!fs.existsSync(CBT_DIR)) {
    fs.mkdirSync(CBT_DIR, { recursive: true });
  }

  copyDir(path.join(packageDir, 'templates'), path.join(CBT_DIR, 'templates'));
  copyDir(path.join(packageDir, 'references'), path.join(CBT_DIR, 'references'));

  // Copy workflows and engine if they exist
  const workflowsSrc = path.join(packageDir, 'workflows');
  if (fs.existsSync(workflowsSrc)) {
    copyDir(workflowsSrc, path.join(CBT_DIR, 'workflows'));
  }

  const engineSrc = path.join(packageDir, 'engine');
  if (fs.existsSync(engineSrc)) {
    copyDir(engineSrc, path.join(CBT_DIR, 'engine'));
  }

  // Hooks
  log('    - Hooks (statusline + update check)', colors.green);
  copyDir(path.join(packageDir, 'hooks'), HOOKS_DIR);

  // Version file
  fs.writeFileSync(versionFile, VERSION);

  // Update settings
  log('    - Settings', colors.green);
  updateSettings();

  // Ask about MCP setup
  log('', colors.reset);
  log('  -------------------------', colors.dim);
  log('  MCP Servers (optional)', colors.bright);
  log('  Give Claude superpowers with external data sources.', colors.dim);
  log('  All free. You can skip any and add them later.\n', colors.dim);
  try {
    const added = await setupMCP();
    if (added > 0) {
      log(`    ${added} MCP server(s) configured in ~/.claude/.mcp.json`, colors.green);
      log('    Restart Claude Code to activate.', colors.dim);
    }
  } catch (e) {
    // Non-interactive mode, skip MCP setup
  }

  log(`\n  Installation complete! (v${VERSION})`, colors.bright + colors.green);
  log('\n  -------------------------', colors.dim);
  log('  Quick Start:', colors.bright);
  log('    1. Open Claude Code in your project', colors.dim);
  log('    2. Run: /cbt:new my_strategy', colors.cyan);
  log('    3. Follow the guided workflow', colors.dim);
  log('\n  Commands:', colors.bright);
  log('    /cbt:help       - Show all commands (21 total)', colors.dim);
  log('    /cbt:new        - Create new strategy', colors.dim);
  log('    /cbt:discover   - Define strategy logic', colors.dim);
  log('    /cbt:eda        - Exploratory data analysis', colors.dim);
  log('    /cbt:plan       - Create build plan', colors.dim);
  log('    /cbt:build      - Generate code', colors.dim);
  log('    /cbt:run        - Run backtest', colors.dim);
  log('    /cbt:deep-analyze - Forensic analysis', colors.dim);
  log('    /cbt:optimize   - Parameter optimization', colors.dim);
  log('    /cbt:report     - Living project report', colors.dim);
  log('    /cbt:live       - Deploy live bot', colors.dim);
  log('    /cbt:export     - Standalone package', colors.dim);
  log('    /cbt:clear      - Context handoff + reset', colors.dim);
  log('\n  New in v1.2.0:', colors.bright + colors.yellow);
  log('    - YOLO mode (auto-approve steps)', colors.dim);
  log('    - Fast engine (Polars + NumPy + Numba)', colors.dim);
  log('    - EDA with Seaborn visualizations', colors.dim);
  log('    - Deep forensic analysis', colors.dim);
  log('    - Signal plotting (mplfinance)', colors.dim);
  log('    - Parameter optimization', colors.dim);
  log('    - Live bot deployment (4 exchanges)', colors.dim);
  log('    - Standalone export', colors.dim);
  log('    - Living reports', colors.dim);
  log('    - Context handoff (/cbt:clear)', colors.dim);
  log('\n  Documentation:', colors.bright);
  log('    https://github.com/Trade-With-Claude/cbt-framework\n', colors.cyan);
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

  // Remove MCP server config from .mcp.json
  const mcpPath = path.join(CLAUDE_DIR, '.mcp.json');
  if (fs.existsSync(mcpPath)) {
    try {
      const mcpConfig = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
      const cbtServers = ['context7', 'alphavantage', 'fred'];
      let removed = 0;
      for (const server of cbtServers) {
        if (mcpConfig.mcpServers && mcpConfig.mcpServers[server]) {
          delete mcpConfig.mcpServers[server];
          removed++;
        }
      }
      if (removed > 0) {
        if (Object.keys(mcpConfig.mcpServers).length === 0) {
          fs.unlinkSync(mcpPath);
        } else {
          fs.writeFileSync(mcpPath, JSON.stringify(mcpConfig, null, 2));
        }
        log(`    - Removed ${removed} MCP server config(s)`, colors.dim);
      }
    } catch (e) {
      // Ignore
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
