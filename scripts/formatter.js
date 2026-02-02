/**
 * Airdrop Hunter Pro - Formatter
 * Formats airdrop data into beautiful CLI output
 */

const STATUS_ICONS = {
  confirmed: '🟢',
  likely: '🟡', 
  possible: '🟠',
  ended: '🔴'
};

const STATUS_LABELS = {
  confirmed: 'CONFIRMED',
  likely: 'LIKELY',
  possible: 'POSSIBLE',
  ended: 'ENDED'
};

const TYPE_ICONS = {
  mainnet: '🔗',
  testnet: '🧪',
  usage: '👤',
  holder: '💎'
};

const TYPE_LABELS = {
  mainnet: 'Mainnet',
  testnet: 'Testnet',
  usage: 'Usage',
  holder: 'Holder'
};

/**
 * Format value range as string
 */
function formatValue(min, max) {
  const format = (n) => n >= 1000 ? `$${(n/1000).toFixed(n%1000===0?0:1)}k` : `$${n}`;
  return `${format(min)}-${format(max)}`;
}

/**
 * Generate difficulty stars
 */
function formatDifficulty(difficulty) {
  const filled = '⭐'.repeat(Math.min(difficulty, 5));
  const empty = '○'.repeat(Math.max(0, 5 - difficulty));
  return filled + empty;
}

/**
 * Create a horizontal bar for progress
 */
function progressBar(percent, width = 20) {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty) + ` ${percent}%`;
}

/**
 * Pad string to width
 */
function pad(str, width) {
  const s = String(str);
  if (s.length >= width) return s.slice(0, width);
  return s + ' '.repeat(width - s.length);
}

/**
 * Wrap text at max width
 */
function wrap(text, maxWidth) {
  if (text.length <= maxWidth) return [text];
  
  const words = text.split(' ');
  const lines = [];
  let current = '';
  
  for (const word of words) {
    if ((current + ' ' + word).length <= maxWidth) {
      current = current ? current + ' ' + word : word;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  
  return lines;
}

/**
 * Format confidence score with color indicator (emoji based)
 */
function formatConfidence(confidence) {
  if (confidence >= 90) return `🟢 ${confidence}%`;
  if (confidence >= 70) return `🟡 ${confidence}%`;
  if (confidence >= 50) return `🟠 ${confidence}%`;
  return `🔴 ${confidence}%`;
}

/**
 * Format airdrop list as table
 */
function formatAirdropList(airdrops, options = {}) {
  const { showStatus = true } = options;
  
  if (airdrops.length === 0) {
    return '⚠️  No airdrops found matching your criteria.\n';
  }

  let output = '';
  
  // Group by status
  const byStatus = {};
  for (const airdrop of airdrops) {
    if (!byStatus[airdrop.status]) byStatus[airdrop.status] = [];
    byStatus[airdrop.status].push(airdrop);
  }
  
  // Order of status groups
  const statusOrder = ['confirmed', 'likely', 'possible', 'ended'];
  
  for (const status of statusOrder) {
    const group = byStatus[status];
    if (!group || group.length === 0) continue;
    
    output += `\n${STATUS_ICONS[status]} ${STATUS_LABELS[status]}\n`;
    output += '─'.repeat(70) + '\n';
    
    // Table header
    output += `┌${'─'.repeat(15)}┬${'─'.repeat(13)}┬${'─'.repeat(12)}┬${'─'.repeat(12)}┐\n`;
    output += `│ ${pad('Project', 13)}│ ${pad('Est. Value', 11)}│ ${pad('Deadline', 10)}│ ${pad('Difficulty', 10)}│\n`;
    output += `├${'─'.repeat(15)}┼${'─'.repeat(13)}┼${'─'.repeat(12)}┼${'─'.repeat(12)}┤\n`;
    
    // Table rows
    for (const a of group) {
      const value = formatValue(a.estimatedValue.min, a.estimatedValue.max);
      const deadline = a.deadline || 'Unknown';
      const diff = '⭐'.repeat(a.difficulty);
      
      output += `│ ${pad(a.name, 13)}│ ${pad(value, 11)}│ ${pad(deadline, 10)}│ ${pad(diff, 10)}│\n`;
    }
    
    output += `└${'─'.repeat(15)}┴${'─'.repeat(13)}┴${'─'.repeat(12)}┴${'─'.repeat(12)}┘\n`;
  }
  
  output += `\n📊 Total: ${airdrops.length} airdrops\n`;
  
  return output;
}

/**
 * Format detailed airdrop info
 */
function formatAirdropDetail(airdrop) {
  let output = '';
  
  // Header
  output += `\n🎯 ${airdrop.name} Airdrop\n`;
  output += '═'.repeat(60) + '\n\n';
  
  // Basic info
  output += `Status: ${STATUS_ICONS[airdrop.status]} ${STATUS_LABELS[airdrop.status]} (${formatConfidence(airdrop.confidence)})\n`;
  output += `Type: ${TYPE_ICONS[airdrop.type]} ${TYPE_LABELS[airdrop.type]}\n`;
  output += `Chain: ${airdrop.chain}\n`;
  output += `Estimated Value: 💰 ${formatValue(airdrop.estimatedValue.min, airdrop.estimatedValue.max)}\n`;
  output += `Deadline: ⏰ ${airdrop.deadline || 'Unknown'}\n`;
  output += `Difficulty: ${formatDifficulty(airdrop.difficulty)} (${airdrop.difficulty}/5)\n`;
  
  if (airdrop.fundingRaised) {
    output += `Funding: ${airdrop.fundingRaised}\n`;
  }
  
  output += '\n';
  
  // Requirements
  output += '📋 Requirements:\n';
  output += '─'.repeat(40) + '\n';
  
  for (const req of airdrop.requirements) {
    const weightBar = '█'.repeat(Math.round(req.weight / 10)) + '░'.repeat(10 - Math.round(req.weight / 10));
    output += `  ${weightBar} ${req.task}\n`;
  }
  
  output += '\n';
  
  // Tips
  output += '💡 Pro Tips:\n';
  output += '─'.repeat(40) + '\n';
  for (const tip of airdrop.tips) {
    const lines = wrap(tip, 56);
    output += `  • ${lines[0]}\n`;
    for (let i = 1; i < lines.length; i++) {
      output += `    ${lines[i]}\n`;
    }
  }
  
  output += '\n';
  
  // Links
  output += '🔗 Links:\n';
  output += '─'.repeat(40) + '\n';
  for (const [key, url] of Object.entries(airdrop.links)) {
    output += `  • ${key.charAt(0).toUpperCase() + key.slice(1)}: ${url}\n`;
  }
  
  output += '\n';
  
  return output;
}

/**
 * Format user tracking status
 */
function formatTrackingStatus(tracking, airdrops) {
  if (tracking.length === 0) {
    return '\n📊 Your Airdrop Portfolio\n\nYou are not tracking any airdrops yet.\nUse "/airdrops track <project>" to start tracking.\n';
  }
  
  let output = '\n📊 Your Airdrop Portfolio\n';
  output += '═'.repeat(70) + '\n\n';
  
  // Calculate total estimated value
  let totalMin = 0;
  let totalMax = 0;
  for (const t of tracking) {
    const airdrop = airdrops.find(a => a.id === t.airdropId);
    if (airdrop) {
      totalMin += airdrop.estimatedValue.min;
      totalMax += airdrop.estimatedValue.max;
    }
  }
  
  output += `Tracking: ${tracking.length} airdrops\n`;
  output += `Estimated Total Value: 💰 ${formatValue(totalMin, totalMax)}\n\n`;
  
  // Table header
  output += `┌${'─'.repeat(15)}┬${'─'.repeat(12)}┬${'─'.repeat(35)}┐\n`;
  output += `│ ${pad('Project', 13)}│ ${pad('Status', 10)}│ ${pad('Progress', 33)}│\n`;
  output += `├${'─'.repeat(15)}┼${'─'.repeat(12)}┼${'─'.repeat(35)}┤\n`;
  
  // Table rows
  const statusEmoji = {
    interested: '💭',
    farming: '🟢',
    completed: '✅',
    claimed: '💰'
  };
  
  for (const t of tracking) {
    const airdrop = airdrops.find(a => a.id === t.airdropId);
    if (!airdrop) continue;
    
    const emoji = statusEmoji[t.status] || '⚪';
    const bar = progressBar(t.progress || 0, 25);
    
    output += `│ ${pad(airdrop.name, 13)}│ ${emoji} ${pad(t.status, 8)}│ ${pad(bar, 33)}│\n`;
  }
  
  output += `└${'─'.repeat(15)}┴${'─'.repeat(12)}┴${'─'.repeat(35)}┘\n`;
  
  // Upcoming deadlines
  const upcoming = [];
  for (const t of tracking) {
    const airdrop = airdrops.find(a => a.id === t.airdropId);
    if (airdrop && airdrop.deadlineDate) {
      const days = Math.ceil((new Date(airdrop.deadlineDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (days > 0 && days <= 30) {
        upcoming.push({ name: airdrop.name, days, deadline: airdrop.deadline });
      }
    }
  }
  
  if (upcoming.length > 0) {
    output += '\n⚠️  Upcoming Deadlines:\n';
    upcoming.sort((a, b) => a.days - b.days);
    for (const u of upcoming.slice(0, 5)) {
      output += `  • ${u.name}: ${u.deadline} (${u.days} days)\n`;
    }
  }
  
  output += '\n';
  
  return output;
}

/**
 * Format success/error messages
 */
function formatSuccess(message) {
  return `✅ ${message}\n`;
}

function formatError(message) {
  return `❌ ${message}\n`;
}

function formatInfo(message) {
  return `ℹ️  ${message}\n`;
}

/**
 * Format help text
 */
function formatHelp() {
  return `
🎯 Airdrop Hunter Pro - Commands
═══════════════════════════════════════════════════════════════

/airdrops list [--filter <type>] [--sort <field>]
  List all active and upcoming airdrops
  
  Filters: confirmed, likely, possible, testnet, mainnet, easy
  Sort: value, deadline, difficulty

/airdrops show <project>
  Show detailed information about an airdrop

/airdrops track <project>
  Add an airdrop to your tracking list

/airdrops untrack <project>
  Remove an airdrop from your tracking list

/airdrops status
  Show your farming progress

Examples:
  /airdrops list --filter confirmed
  /airdrops show monad
  /airdrops track polymarket

═══════════════════════════════════════════════════════════════
`;
}

module.exports = {
  formatAirdropList,
  formatAirdropDetail,
  formatTrackingStatus,
  formatSuccess,
  formatError,
  formatInfo,
  formatHelp,
  formatValue,
  formatDifficulty,
  progressBar,
  STATUS_ICONS,
  TYPE_ICONS
};
