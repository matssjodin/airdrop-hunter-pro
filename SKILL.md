---
name: airdrop-hunter-pro
description: Track and farm crypto airdrops systematically. Use when the user wants to discover active airdrops, check requirements for specific projects, or track their farming progress. Covers confirmed, likely, and possible airdrops with estimated values, difficulty scores, and step-by-step guides.
---

# Airdrop Hunter Pro

Track and farm crypto airdrops. Data stored in `references/airdrops.json`.

## Usage

```bash
# List all airdrops
node scripts/airdrop-cli.js list

# Filter and sort
node scripts/airdrop-cli.js list --filter confirmed --sort value

# Show details
node scripts/airdrop-cli.js show monad

# Track progress
node scripts/airdrop-cli.js track polymarket
node scripts/airdrop-cli.js status
node scripts/airdrop-cli.js update polymarket --progress 50

# Untrack
node scripts/airdrop-cli.js untrack polymarket
```

## Filters
- `confirmed` | `likely` | `possible` - By status
- `testnet` | `mainnet` | `usage` - By type
- `easy` | `medium` | `hard` - By difficulty (≤2/=3/≥4)

## Sort Options
- `value` - By estimated value
- `deadline` - By deadline
- `difficulty` - By difficulty
- `name` - Alphabetically
- `confidence` - By confidence score

## Data Structure

Each airdrop in `references/airdrops.json` has:
- `id`, `name`, `status` (confirmed/likely/possible)
- `type` (testnet/mainnet/usage), `chain`
- `estimatedValue` {min, max}, `deadline`
- `difficulty` (1-5), `confidence` (0-100)
- `requirements[]` - Tasks with weights
- `tips[]` - Pro advice
- `links` - URLs
- `fundingRaised`, `valuation`

## Tracked Airdrops (8)

| Project | Status | Type | Est. Value | Difficulty |
|---------|--------|------|------------|------------|
| Polymarket | Confirmed | Mainnet | $500-$5k | ⭐⭐ |
| MegaETH | Confirmed | Testnet | $300-$2k | ⭐⭐⭐ |
| Monad | Likely | Testnet | $500-$3k | ⭐⭐ |
| MetaMask | Likely | Usage | $1k-$10k | ⭐ |
| Hyperliquid S2 | Likely | Mainnet | $500-$5k | ⭐⭐⭐ |
| Linea | Likely | Mainnet | $200-$1.5k | ⭐⭐ |
| Rainbow | Likely | Usage | $200-$1k | ⭐ |
| Rabby | Possible | Usage | $100-$500 | ⭐ |
