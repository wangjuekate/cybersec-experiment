# Experiment Implementation Guide

## Overview

This Empirica experiment implements your cybersecurity collaboration/competition study design with the following key features:

## Experimental Design Implementation

### Phase 1: Collaboration (Rounds 1-8)

Each round consists of three stages:

1. **Disclosure Stage (120s)**
   - Players choose disclosure amount: None, Partial, or Full
   - Players choose resolution level: Coarse or Fine-grained
   - Decisions are tagged by firm ID (or anonymized based on governance regime)

2. **AI Aggregation Stage (30s)**
   - System pools all shared telemetry
   - Calculates AI model detection accuracy based on:
     - Base accuracy: 50%
     - Telemetry bonus: +5% per contribution
     - Volatility penalty: -10% if volatile environment
   - Maximum accuracy capped at 95%

3. **Results Stage (60s)**
   - Players see their detection accuracy improvement
   - Payoffs calculated:
     - Short-term: Attacks prevented × $10
     - Costs: Disclosure costs ($25 partial, $50 full)
   - Leakage intensity measured and displayed

### Phase 2: Competition (Rounds 9-12)

Each round consists of two stages:

1. **Competition Stage (120s)**
   - Players select competitive strategy
   - System calculates competition score based on:
     - Own threat signatures
     - Learned signatures from collaboration phase
     - Strategy choice
     - Reputation penalties (if auditable governance)

2. **Competition Results Stage (60s)**
   - Leaderboard showing all firms' rankings
   - Contract value awarded based on performance
   - Cumulative payoff tracking

## Treatment Factors

### 1. Governance Regime (Between-Subject)

- **Open**: All disclosures visible with firm IDs
- **Anonymized**: Disclosures visible but firm IDs hidden
- **Restricted**: Shared signals decay or incur reuse tax
- **Auditable**: Misuse tracked and penalized via reputation

### 2. Absorptive Capacity (Between/Within)

- **High**: Learning rate = 0.8 (80% of AI improvement absorbed)
- **Low**: Learning rate = 0.4 (40% of AI improvement absorbed)

### 3. Threat Volatility (Session-Level)

- **Stable**: No accuracy penalty
- **Volatile**: -10% accuracy penalty to AI model

## Key Measurements

### Knowledge Leakage Metrics

1. **Leakage Intensity**
   - Formula: `(others_sharing - own_sharing) / others_sharing`
   - Measures asymmetric benefit from ecosystem
   - Tracked per round and averaged

2. **Leakage Effectiveness**
   - Performance gains attributable to foreign knowledge
   - Calculated via learned signals vs. own signals

3. **Leakage Asymmetry**
   - Differential benefits across firms
   - Visible in competition phase outcomes

## Data Collection

All data automatically stored in Empirica's database:

- Player-level:
  - Threat portfolio (initial endowment)
  - Absorptive capacity
  - Total payoff
  - Leakage history
  - Exit survey responses

- Round-level:
  - Disclosure decisions
  - Detection accuracy
  - Payoffs
  - Leakage intensity
  - Competition scores

- Game-level:
  - Treatment conditions
  - Shared telemetry pool
  - AI model accuracy

## Running the Experiment

### Setup

```bash
cd cybersecurity-experiment
npm install
```

### Development

```bash
npm run dev
```

This starts:
- Admin panel: http://localhost:3000/admin
- Player interface: http://localhost:3000

### Creating a Game

1. Open admin panel
2. Select a treatment from the 12 configured options
3. Create a batch
4. Share player links with participants

### Monitoring

- Real-time player progress visible in admin panel
- Export data after completion for analysis

## Treatment Configurations

12 pre-configured treatments in `.empirica/treatments.yaml`:

- 4 governance regimes × 2 absorptive capacities × 2 threat volatilities
- Each with 4 players, 8 collaboration rounds, 4 competition rounds

## Customization

### Adjusting Timing

Edit stage durations in `server/src/callbacks.js`:

```javascript
round.addStage({ name: "disclosure", duration: 120 }); // seconds
```

### Modifying Payoffs

Edit payoff calculations in the `onStageEnded` callback for "aiAggregation" stage.

### Adding Treatments

Edit `.empirica/treatments.yaml` to add new factor combinations.

## Analysis Recommendations

### Primary Outcomes

1. **Disclosure behavior**: Amount and resolution choices over time
2. **Leakage patterns**: Intensity, effectiveness, asymmetry
3. **Competition performance**: Relationship to collaboration strategy

### Key Comparisons

- Governance regime effects on sharing behavior
- Absorptive capacity effects on learning
- Threat volatility effects on cooperation
- Interaction effects between factors

### Statistical Models

Suggested approach:
- Mixed-effects models with player random effects
- Treatment as fixed effects
- Round as time variable
- Cluster standard errors by game session
