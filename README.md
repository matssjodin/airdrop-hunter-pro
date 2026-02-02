# 🎯 Airdrop Hunter Pro

Track and farm crypto airdrops systematically. Never miss a free token drop again.

> "One missed airdrop can cost you $1,000-$50,000. Don't let that happen."

## Features

- 📋 **8 Active Airdrops** - Curated list with verified data
- 🔍 **Smart Filtering** - By status (confirmed/likely/possible), type, difficulty
- 📊 **Portfolio Tracking** - Track your farming progress
- 💰 **Value Estimates** - Realistic ROI projections
- ⚡ **Fast CLI** - Terminal-based, no bloat

## Quick Start

```bash
# Clone the skill
clawdbot skill install https://github.com/matssjodin/airdrop-hunter-pro

# Or use directly
node scripts/airdrop-cli.js list
node scripts/airdrop-cli.js show monad
node scripts/airdrop-cli.js track polymarket
```

## Commands

| Command | Description |
|---------|-------------|
| `list` | List all airdrops |
| `list --filter confirmed` | Only confirmed drops |
| `list --filter easy` | Low difficulty (≤2) |
| `list --sort value` | Sort by estimated value |
| `show <project>` | Detailed info |
| `track <project>` | Add to tracking |
| `untrack <project>` | Remove from tracking |
| `status` | Show your portfolio |
| `update <project> --progress <0-100>` | Update progress |

## Current Airdrops (8)

| Project | Status | Type | Est. Value | Difficulty |
|---------|--------|------|------------|------------|
| Polymarket | 🟢 Confirmed | Mainnet | $500-$5k | ⭐⭐ |
| MegaETH | 🟢 Confirmed | Testnet | $300-$2k | ⭐⭐⭐ |
| MetaMask | 🟡 Likely | Usage | $1k-$10k | ⭐ |
| Monad | 🟡 Likely | Testnet | $500-$3k | ⭐⭐ |
| Hyperliquid S2 | 🟡 Likely | Mainnet | $500-$5k | ⭐⭐⭐ |
| Linea | 🟡 Likely | Mainnet | $200-$1.5k | ⭐⭐ |
| Rainbow | 🟡 Likely | Usage | $200-$1k | ⭐ |
| Rabby | 🟠 Possible | Usage | $100-$500 | ⭐ |

## Install as Clawdbot Skill

```bash
clawdbot skill install https://github.com/matssjodin/airdrop-hunter-pro
```

Then use:
```
/airdrops list
/airdrops show monad
/airdrops track polymarket
/airdrops status
```

## Data Sources

- Official project announcements
- DeFiLlama
- airdrops.io
- dropsearn.com
- Community research

## Disclaimer

This is for educational purposes. Airdrop values are estimates based on historical data and speculation. DYOR (Do Your Own Research) before investing time or money.

## License

MIT - Built with 🦞 by AutoMats_SE

---

**Pro version coming soon:** Alerts, 20+ airdrops, detailed guides, and more!
