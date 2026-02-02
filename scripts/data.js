/**
 * Airdrop Hunter Pro - Data Module
 * Handles reading/writing airdrop data and user tracking
 */

const fs = require('fs');
const path = require('path');

const REFS_DIR = path.join(__dirname, '..', 'references');
const AIRDROPS_FILE = path.join(REFS_DIR, 'airdrops.json');
const TRACKING_FILE = path.join(process.env.HOME || '/tmp', '.airdrop-hunter-tracking.json');

// Ensure tracking file can be written
function ensureDataDir() {
  // Tracking file stored in user's home directory
}

/**
 * Load airdrops from JSON file
 * @returns {Array} Array of airdrop objects
 */
function loadAirdrops() {
  try {
    const data = fs.readFileSync(AIRDROPS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return parsed.airdrops || [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ airdrops.json not found. Run from project root.');
      return [];
    }
    console.error('❌ Error loading airdrops:', error.message);
    return [];
  }
}

/**
 * Load user tracking data
 * @returns {Array} Array of tracking objects
 */
function loadTracking() {
  ensureDataDir();
  try {
    if (!fs.existsSync(TRACKING_FILE)) {
      return [];
    }
    const data = fs.readFileSync(TRACKING_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return parsed.tracking || [];
  } catch (error) {
    console.error('❌ Error loading tracking:', error.message);
    return [];
  }
}

/**
 * Save user tracking data
 * @param {Array} tracking - Array of tracking objects
 */
function saveTracking(tracking) {
  ensureDataDir();
  const data = {
    lastUpdated: new Date().toISOString(),
    tracking
  };
  fs.writeFileSync(TRACKING_FILE, JSON.stringify(data, null, 2));
}

/**
 * Get airdrop by ID or name (case insensitive partial match)
 * @param {string} query - Project name or ID
 * @returns {Object|null} Airdrop object or null
 */
function getAirdrop(query, airdrops) {
  const q = query.toLowerCase();
  
  // First try exact ID match
  const byId = airdrops.find(a => a.id.toLowerCase() === q);
  if (byId) return byId;
  
  // Then try exact name match
  const byName = airdrops.find(a => a.name.toLowerCase() === q);
  if (byName) return byName;
  
  // Then try partial name match
  const partial = airdrops.find(a => a.name.toLowerCase().includes(q));
  if (partial) return partial;
  
  // Try partial ID match
  const partialId = airdrops.find(a => a.id.toLowerCase().includes(q));
  if (partialId) return partialId;
  
  return null;
}

/**
 * Add airdrop to tracking
 * @param {string} airdropId - Airdrop ID
 * @param {string} status - Initial status (default: interested)
 * @returns {Object} Result object
 */
function trackAirdrop(airdropId, status = 'interested') {
  const tracking = loadTracking();
  const airdrops = loadAirdrops();
  
  // Verify airdrop exists
  const airdrop = getAirdrop(airdropId, airdrops);
  if (!airdrop) {
    return {
      success: false,
      message: `Airdrop "${airdropId}" not found`
    };
  }
  
  // Check if already tracking
  if (tracking.some(t => t.airdropId === airdrop.id)) {
    return {
      success: false,
      message: `Already tracking ${airdrop.name}`
    };
  }
  
  // Check free tier limit
  if (tracking.length >= 10) {
    return {
      success: false,
      message: 'Free tier limit: Max 10 tracked airdrops. Untrack some or upgrade to Pro.'
    };
  }
  
  // Add to tracking
  tracking.push({
    airdropId: airdrop.id,
    status,
    progress: 0,
    tasksCompleted: [],
    notes: '',
    addedAt: new Date().toISOString()
  });
  
  saveTracking(tracking);
  
  return {
    success: true,
    message: `Now tracking ${airdrop.name}`,
    airdrop
  };
}

/**
 * Remove airdrop from tracking
 * @param {string} airdropId - Airdrop ID
 * @returns {Object} Result object
 */
function untrackAirdrop(airdropId) {
  const tracking = loadTracking();
  const airdrops = loadAirdrops();
  
  // Find airdrop
  const airdrop = getAirdrop(airdropId, airdrops);
  if (!airdrop) {
    return {
      success: false,
      message: `Airdrop "${airdropId}" not found`
    };
  }
  
  // Check if tracking
  const index = tracking.findIndex(t => t.airdropId === airdrop.id);
  if (index === -1) {
    return {
      success: false,
      message: `Not currently tracking ${airdrop.name}`
    };
  }
  
  // Remove from tracking
  tracking.splice(index, 1);
  saveTracking(tracking);
  
  return {
    success: true,
    message: `Stopped tracking ${airdrop.name}`,
    airdrop
  };
}

/**
 * Update tracking status/progress
 * @param {string} airdropId - Airdrop ID
 * @param {Object} updates - Updates to apply
 * @returns {Object} Result object
 */
function updateTracking(airdropId, updates) {
  const tracking = loadTracking();
  const airdrops = loadAirdrops();
  
  const airdrop = getAirdrop(airdropId, airdrops);
  if (!airdrop) {
    return {
      success: false,
      message: `Airdrop "${airdropId}" not found`
    };
  }
  
  const index = tracking.findIndex(t => t.airdropId === airdrop.id);
  if (index === -1) {
    return {
      success: false,
      message: `Not tracking ${airdrop.name}. Use "track" first.`
    };
  }
  
  // Apply updates
  tracking[index] = {
    ...tracking[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  saveTracking(tracking);
  
  return {
    success: true,
    message: `Updated ${airdrop.name}`,
    tracking: tracking[index]
  };
}

/**
 * Filter airdrops based on criteria
 * @param {Array} airdrops - Array of airdrops
 * @param {string} filter - Filter type
 * @returns {Array} Filtered airdrops
 */
function filterAirdrops(airdrops, filter) {
  if (!filter) return airdrops;
  
  const f = filter.toLowerCase();
  
  switch (f) {
    case 'confirmed':
      return airdrops.filter(a => a.status === 'confirmed');
    case 'likely':
      return airdrops.filter(a => a.status === 'likely');
    case 'possible':
      return airdrops.filter(a => a.status === 'possible');
    case 'testnet':
      return airdrops.filter(a => a.type === 'testnet');
    case 'mainnet':
      return airdrops.filter(a => a.type === 'mainnet');
    case 'usage':
      return airdrops.filter(a => a.type === 'usage');
    case 'easy':
      return airdrops.filter(a => a.difficulty <= 2);
    case 'medium':
      return airdrops.filter(a => a.difficulty === 3);
    case 'hard':
      return airdrops.filter(a => a.difficulty >= 4);
    default:
      // Try to match name/id
      return airdrops.filter(a => 
        a.id.toLowerCase().includes(f) || 
        a.name.toLowerCase().includes(f)
      );
  }
}

/**
 * Sort airdrops by field
 * @param {Array} airdrops - Array of airdrops
 * @param {string} sortBy - Sort field
 * @returns {Array} Sorted airdrops
 */
function sortAirdrops(airdrops, sortBy) {
  if (!sortBy) {
    // Default sort: status priority, then value
    const statusOrder = { confirmed: 0, likely: 1, possible: 2, ended: 3 };
    return [...airdrops].sort((a, b) => {
      const statusDiff = (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
      if (statusDiff !== 0) return statusDiff;
      return b.estimatedValue.max - a.estimatedValue.max;
    });
  }
  
  const sorted = [...airdrops];
  
  switch (sortBy.toLowerCase()) {
    case 'value':
      sorted.sort((a, b) => b.estimatedValue.max - a.estimatedValue.max);
      break;
    case 'deadline':
      sorted.sort((a, b) => {
        if (!a.deadlineDate && !b.deadlineDate) return 0;
        if (!a.deadlineDate) return 1;
        if (!b.deadlineDate) return -1;
        return new Date(a.deadlineDate) - new Date(b.deadlineDate);
      });
      break;
    case 'difficulty':
      sorted.sort((a, b) => a.difficulty - b.difficulty);
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'confidence':
      sorted.sort((a, b) => b.confidence - a.confidence);
      break;
  }
  
  return sorted;
}

/**
 * Get tracking summary stats
 * @returns {Object} Stats object
 */
function getTrackingStats() {
  const tracking = loadTracking();
  const airdrops = loadAirdrops();
  
  const statusCounts = {};
  let totalMin = 0;
  let totalMax = 0;
  
  for (const t of tracking) {
    statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
    
    const airdrop = airdrops.find(a => a.id === t.airdropId);
    if (airdrop) {
      totalMin += airdrop.estimatedValue.min;
      totalMax += airdrop.estimatedValue.max;
    }
  }
  
  return {
    count: tracking.length,
    byStatus: statusCounts,
    totalValueMin: totalMin,
    totalValueMax: totalMax
  };
}

module.exports = {
  loadAirdrops,
  loadTracking,
  saveTracking,
  getAirdrop,
  trackAirdrop,
  untrackAirdrop,
  updateTracking,
  filterAirdrops,
  sortAirdrops,
  getTrackingStats,
  // Constants
  AIRDROPS_FILE,
  TRACKING_FILE
};
