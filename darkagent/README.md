# DarkAgent — AI Agent Permission Infrastructure for DeFi

> *"ENS subdomains are agent licenses. Create one per agent. Revoke anytime. Nobody needs to trust the agent. They just need to check the subdomain."*

DarkAgent is the load-bearing decentralized infrastructure layer for AI agent permissions in DeFi. It solves the gap restricting institutional and mainstream adoption of autonomous agents: lack of standardized, on-chain, verifiable execution boundaries.

---

## 🧠 The Core Idea

### ENS Subdomains As Agent Identities

```
alice.eth OWNS agents as subdomains:

  trading.alice.eth   → trading agent    (max $500, uniswap only)
  yield.alice.eth     → yield agent      (max $5000, aave + compound)
  dca.alice.eth       → DCA agent        (max $100/day)

Each subdomain IS the agent.
Each subdomain HAS its own rules.
Each subdomain IS revokable.
```

**Subdomain = Agent License.** Like a driving license — issued by the owner, has specific permissions, can be revoked anytime, cannot be faked, on-chain permanent record.

---

## 🏗 The Architecture

```
alice.eth
   ↓
Agent Registry (AgentRegistry.sol)
(creates trading.alice.eth subdomain license)
   ↓
ENS Agent Resolver (ENSAgentResolver.sol)
(reads agent.max_spend, agent.protocols, agent.active)
   ↓
Simulation Engine (SimulationEngine.sol)
(fork-simulates DeFi tx: slippage, risk score, protocol check)
   ↓
DarkAgent Protocol (DarkAgent.sol)
(verifies: license + ENS rules + simulation passed)
   ↓
BitGo Agent Policy Adapter (bitgo.js SDK)
(enforces at wallet level, stealth address execution)
   ↓
Execute on Unlinkable Stealth Address
```

### The Flow

1. **AI agent proposes action** — "swap 1 ETH to USDC on Uniswap"
2. **DarkAgent simulates the transaction** — fork simulation, risk scoring
3. **Intent engine verifies policy** — checks ENS rules, agent license, simulation result
4. **BitGo executes** — sends to stealth address, enforces velocity limits

---

## 🪪 ENS Subdomains as Agent Licenses (AgentRegistry.sol)

Each agent you create becomes a licensed ENS subdomain with scoped permissions:

```solidity
// Create agent: trading.alice.eth
registry.createAgent("trading", agentWallet, maxSpend, dailyLimit, slippageBps, protocols, expiry);

// Revoke (kill) agent
registry.revokeAgent(node);

// Transfer agent license to new owner
registry.transferAgent(node, newOwner);

// Check if agent is authorized
registry.isAgentWalletAuthorized(agentWallet);
```

**What this enables:**
- Agent marketplaces — buy `trading.alice.eth` with proven permissions
- Agent inheritance — transfer `yield.alice.eth` to new wallet
- Agent auditing — every tx linked to subdomain
- Agent expiry — auto-expires after timestamp

---

## 🔬 DeFi Transaction Simulation (SimulationEngine.sol)

Before any execution, every transaction is fork-simulated:

```
AI Action → Fork Simulation → Risk Engine → Pass/Fail

Risk Factors:
  ✓ Slippage analysis
  ✓ Protocol verification (is target on allowlist?)
  ✓ Spend limit enforcement
  ✓ Liquidation risk scoring
  ✓ Anomaly detection (sudden large transfers)

Risk Score: 0-1000 (threshold: 400 = 0.4)
```

If risk_score > 0.4, the transaction is **blocked before execution**.

---

## 🔵 BitGo Protocol Adapter

### Privacy Layer ($1,200 Prize)
- **Stealth Addresses via BitGo** — Agent never interacts via statically linked addresses
- **Ephemeral Keypairs** — generates fresh keypair per transaction
- **Zero Linkability** — creates completely unlinkable destination address

### DeFi Layer ($800 Prize)
- **Multi-tier Approval** — small tx (<$50) auto-approved, large tx enforces ENS limits
- **Policy Governed Automation** — syncs `agent.protocols` and `agent.max_spend` into BitGo velocity rules
- **Emergency Freeze** — `agent.active = false` triggers instant zero-velocity lock

---

## 🪪 ENSIP-XX: Agent Permission Records

Formally proposing **ENSIP-XX** to turn ENS into the decentralized financial policy standard:

| Record | Purpose | Example |
|--------|---------|---------|
| `agent.max_spend` | Daily cap | `1000 USDC` |
| `agent.protocols` | Whitelist of DeFi routers | `uniswap,aave` |
| `agent.active` | Master panic switch | `true/false` |
| `agent.slippage` | Max slippage tolerance | `50` (0.5%) |
| `agent.expiry` | License expiration | Unix timestamp |

---

## 📦 Project Structure

```
darkagent/
├── contracts/
│   ├── AgentRegistry.sol      — ENS subdomain agent licenses
│   ├── SimulationEngine.sol   — DeFi transaction simulation & risk
│   ├── DarkAgent.sol          — Core verification protocol
│   ├── ENSAgentResolver.sol   — ENSIP-XX reference implementation
│   └── interfaces/            — Protocol interfaces
├── sdk/
│   ├── agent-registry.js      — Agent license management SDK
│   ├── simulation.js          — Simulation engine SDK
│   ├── darkagent.js           — Core SDK (3-line integration)
│   ├── bitgo.js               — BitGo stealth + policy adapter
│   ├── fileverse.js           — Fileverse document storage
│   ├── permit2.js             — Uniswap Permit2 gasless approvals
│   └── mev-protection.js      — Flashbots MEV protection
├── frontend/
│   └── src/pages/
│       ├── AgentManager.jsx   — Create/manage/kill agent licenses
│       ├── Simulator.jsx      — DeFi transaction simulation UI
│       ├── Permissions.jsx    — ENS policy configuration
│       ├── Proposer.jsx       — Execute agent actions
│       └── Dashboard.jsx      — Protocol audit trail
├── test/
│   └── DarkAgent.test.js      — Full E2E tests (14 test cases)
├── scripts/
│   ├── deploy.js              — Deploys all 4 contracts
│   ├── deploy-local.js        — Local Hardhat node deployment
│   ├── create-bitgo-wallet.js — BitGo wallet setup
│   └── ens-*.js               — ENS record management scripts
└── docs/
    └── ENSIP-Agent-Permissions.md — ENSIP-XX specification
```

---

## 🚀 Quick Start

```bash
# Install
cd darkagent && npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Base Sepolia
npx hardhat run scripts/deploy.js --network baseSepolia

# Start frontend
cd frontend && npm install && npm run dev
```

---

## 🧪 Test Coverage

```
DarkAgent Protocol — Full End to End
  Agent Registry — ENS Subdomain Licenses
    ✓ should create an agent license (subdomain)
    ✓ should verify agent wallet is authorized
    ✓ should support multiple agents per owner
    ✓ should revoke (kill) an agent license
    ✓ should transfer an agent license to new owner
    ✓ should prevent non-owner from revoking
  Simulation Engine — DeFi Risk Analysis
    ✓ should simulate a safe transaction
    ✓ should fail simulation when spend exceeds limit
    ✓ should fail simulation for unverified protocol
    ✓ should track user simulation history
  Full Integrated Pipeline
    ✓ should complete: create agent → propose → simulate → verify → execute
    ✓ should reject execution if agent license is revoked
    ✓ should reject verification if ENS master switch is false
    ✓ should reject if simulation failed
```

---

## 🏆 Hackathon Targets

| Prize | What We Built | Status |
|-------|---------------|--------|
| **ENS** | ENS subdomains as agent licenses + ENSIP-XX | ✅ |
| **BitGo Privacy ($1,200)** | Stealth address system via ephemeral keypairs | ✅ |
| **BitGo DeFi ($800)** | Multi-tier policy automation + emergency freeze | ✅ |
| **Simulation Engine** | Fork-simulate DeFi txs with risk scoring | ✅ |

---

*Built at ETHGlobal 2026*
