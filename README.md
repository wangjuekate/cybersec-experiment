# Cybersecurity Collaboration & Competition Experiment

An Empirica-based experiment studying knowledge leakage and strategic behavior in cybersecurity threat intelligence sharing.

## Overview

This experiment simulates firms operating in small ecosystems (3-5 firms) where participants act as CISOs making strategic decisions about threat intelligence sharing. The experiment consists of:

- **Rounds 1-8**: Collaboration phase with telemetry sharing decisions
- **Rounds 9-12**: Competition phase where firms compete for security contracts

## Key Features

### Experimental Treatments
1. **Governance Regime** (between-subject):
   - Open sharing (baseline)
   - Anonymized sharing
   - Restricted reuse (decay or tax)
   - Auditable misuse (reputation penalty)

2. **Absorptive Capacity** (between/within):
   - High-learning firms
   - Low-learning firms

3. **Threat Volatility** (session-level):
   - Stable attack environment
   - Rapidly changing attack environment

### Measured Outcomes
- **Leakage Intensity**: Use of others' signals without reciprocal sharing
- **Leakage Effectiveness**: Performance gains from foreign knowledge
- **Leakage Asymmetry**: Differential benefits from disclosures

## Installation

1. Install Empirica CLI:
```bash
curl -fsS https://install.empirica.dev | sh
```

2. Install dependencies:
```bash
npm install
```

3. Run the experiment:
```bash
npm run dev
```

## Project Structure

```
cybersecurity-experiment/
├── client/               # React frontend
│   ├── src/
│   │   ├── Game.jsx     # Main game component
│   │   ├── Stage.jsx    # Stage-specific UI
│   │   ├── components/  # Reusable UI components
│   │   └── intro-exit/  # Intro and exit steps
├── server/              # Game logic
│   └── src/
│       └── callbacks.js # Game lifecycle callbacks
├── public/              # Static assets
└── .empirica/           # Empirica configuration
    └── treatments.yaml  # Treatment definitions
```

## Configuration

Edit `.empirica/treatments.yaml` to configure experimental conditions, number of players, rounds, and other parameters.

## Data Collection

The experiment tracks:
- Disclosure decisions (amount and resolution)
- Detection accuracy improvements
- Payoffs (short-term and long-term)
- Knowledge leakage metrics
- Competition outcomes

Data is automatically stored in Empirica's database and can be exported for analysis.
