#!/usr/bin/env node

/**
 * CBT Framework Status Line
 * Shows current strategy status in Claude Code status bar.
 * v1.2.0: Added YOLO indicator, engine indicator, live bot status.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Find strategy state file
function findStateFile(startDir = process.cwd()) {
  const statePatterns = [
    'strategies/*/.cbt/state.yaml',
    '.cbt/state.yaml'
  ];

  // Check current directory first
  const localState = path.join(startDir, '.cbt', 'state.yaml');
  if (fs.existsSync(localState)) {
    return localState;
  }

  // Check strategies directory
  const strategiesDir = path.join(startDir, 'strategies');
  if (fs.existsSync(strategiesDir)) {
    try {
      const strategies = fs.readdirSync(strategiesDir);
      for (const strategy of strategies) {
        const stateFile = path.join(strategiesDir, strategy, '.cbt', 'state.yaml');
        if (fs.existsSync(stateFile)) {
          return stateFile;
        }
      }
    } catch (e) {
      // Ignore errors
    }
  }

  return null;
}

function loadState(stateFile) {
  try {
    const content = fs.readFileSync(stateFile, 'utf8');
    return yaml.load(content);
  } catch (e) {
    return null;
  }
}

function getPhaseEmoji(phase) {
  const emojis = {
    discovery: '🔍',
    research: '📚',
    eda: '📊',
    config: '⚙️',
    plan: '📋',
    build: '🔨',
    iterate: '🔄'
  };
  return emojis[phase] || '📊';
}

function formatStatus(state) {
  if (!state) return '';

  const parts = [];

  // Strategy name
  if (state.strategy) {
    parts.push(`📈 ${state.strategy}`);
  }

  // YOLO mode indicator
  if (state.mode === 'yolo') {
    parts.push('⚡ YOLO');
  }

  // Engine indicator
  if (state.engine === 'fast') {
    parts.push('🚀 fast');
  }

  // Current phase with emoji
  if (state.phase) {
    const emoji = getPhaseEmoji(state.phase);
    parts.push(`${emoji} ${state.phase}`);
  }

  // Experiment count (if in iterate phase)
  if (state.phase === 'iterate' && state.experiments) {
    const exp = state.experiments;
    if (exp.count > 0) {
      parts.push(`#${exp.count}`);
      if (exp.best) {
        parts.push(`best: ${exp.best}`);
      }
    }
  }

  // Build progress (if in build phase)
  if (state.phase === 'build' && state.build && state.build.progress) {
    parts.push(`[${state.build.progress}]`);
  }

  // Live bot status
  if (state.live && state.live.deployed) {
    const liveMode = state.live.mode || 'paper';
    const exchange = state.live.exchange || 'unknown';
    if (liveMode === 'live') {
      parts.push(`🟢 LIVE:${exchange}`);
    } else {
      parts.push(`🟡 paper:${exchange}`);
    }
  }

  return parts.join(' | ');
}

// Main
const stateFile = findStateFile();

if (stateFile) {
  const state = loadState(stateFile);
  const status = formatStatus(state);

  if (status) {
    console.log(status);
  }
}
