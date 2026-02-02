#!/usr/bin/env node
/**
 * Airdrop Hunter Pro - Commands
 * CLI entry point for all airdrop commands
 */

const data = require('./data');
const formatter = require('./formatter');

function showHelp() {
  console.log(formatter.formatHelp());
}

function showList(args) {
  const airdrops = data.loadAirdrops();
  
  if (airdrops.length === 0) {
    console.log(formatter.formatError('Could not load airdrops data'));
    return;
  }
  
  // Parse filter
  let filter = null;
  const filterIndex = args.indexOf('--filter');
  if (filterIndex !== -1 && args[filterIndex + 1]) {
    filter = args[filterIndex + 1];
  }
  
  // Parse sort
  let sortBy = null;
  const sortIndex = args.indexOf('--sort');
  if (sortIndex !== -1 && args[sortIndex + 1]) {
    sortBy = args[sortIndex + 1];
  }
  
  // Apply filter and sort
  let filtered = data.filterAirdrops(airdrops, filter);
  filtered = data.sortAirdrops(filtered, sortBy);
  
  console.log(`\n🎯 Active Airdrops (${filtered.length})`);
  console.log(formatter.formatAirdropList(filtered));
}

function showDetail(args) {
  if (args.length < 1) {
    console.log(formatter.formatError('Usage: show <project>'));
    console.log(formatter.formatInfo('Example: show monad'));
    return;
  }
  
  const query = args[0];
  const airdrops = data.loadAirdrops();
  const airdrop = data.getAirdrop(query, airdrops);
  
  if (!airdrop) {
    console.log(formatter.formatError(`Airdrop "${query}" not found`));
    console.log(formatter.formatInfo('Try: list'));
    return;
  }
  
  console.log(formatter.formatAirdropDetail(airdrop));
}

function trackAirdrop(args) {
  if (args.length < 1) {
    console.log(formatter.formatError('Usage: track <project>'));
    console.log(formatter.formatInfo('Example: track polymarket'));
    return;
  }
  
  const query = args[0];
  const result = data.trackAirdrop(query, 'farming');
  
  if (result.success) {
    console.log(formatter.formatSuccess(result.message));
    console.log(formatter.formatInfo(`Use "status" to see your tracking list`));
  } else {
    console.log(formatter.formatError(result.message));
  }
}

function untrackAirdrop(args) {
  if (args.length < 1) {
    console.log(formatter.formatError('Usage: untrack <project>'));
    console.log(formatter.formatInfo('Example: untrack polymarket'));
    return;
  }
  
  const query = args[0];
  const result = data.untrackAirdrop(query);
  
  if (result.success) {
    console.log(formatter.formatSuccess(result.message));
  } else {
    console.log(formatter.formatError(result.message));
  }
}

function showStatus() {
  const tracking = data.loadTracking();
  const airdrops = data.loadAirdrops();
  
  console.log(formatter.formatTrackingStatus(tracking, airdrops));
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showHelp();
    return;
  }
  
  const command = args[0].toLowerCase();
  const commandArgs = args.slice(1);
  
  switch (command) {
    case 'list':
    case 'ls':
      showList(commandArgs);
      break;
    
    case 'show':
    case 'info':
    case 'detail':
      showDetail(commandArgs);
      break;
    
    case 'track':
    case 'add':
    case 'follow':
      trackAirdrop(commandArgs);
      break;
    
    case 'untrack':
    case 'remove':
    case 'unfollow':
      untrackAirdrop(commandArgs);
      break;
    
    case 'status':
    case 'portfolio':
    case 'tracking':
      showStatus();
      break;
    
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    
    case 'update':
      // Update progress for a tracked airdrop
      if (commandArgs.length < 2) {
        console.log(formatter.formatError('Usage: update <project> --progress <0-100> [--status <status>]'));
        return;
      }
      const project = commandArgs[0];
      let progress = null;
      let status = null;
      
      const progressIdx = commandArgs.indexOf('--progress');
      if (progressIdx !== -1) commandArgs[progressIdx + 1] && (progress = parseInt(commandArgs[progressIdx + 1]));
      
      const statusIdx = commandArgs.indexOf('--status');
      if (statusIdx !== -1) commandArgs[statusIdx + 1] && (status = commandArgs[statusIdx + 1]);
      
      const updates = {};
      if (progress !== null) updates.progress = progress;
      if (status) updates.status = status;
      
      const result = data.updateTracking(project, updates);
      if (result.success) {
        console.log(formatter.formatSuccess(result.message));
      } else {
        console.log(formatter.formatError(result.message));
      }
      break;
    
    default:
      console.log(formatter.formatError(`Unknown command: ${command}`));
      showHelp();
  }
}

main();
