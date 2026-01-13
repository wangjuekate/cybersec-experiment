# Treatment Configuration Guide

## 📊 How Treatments Map to Game Design

### Treatment Factors Overview

Your experiment has **6 treatment factors** that control different aspects of the game:

| Factor | Values | Game Impact |
|--------|--------|-------------|
| **playerCount** | 1-6 | Number of firms in the game |
| **collaborationRounds** | 3 | Number of rounds where firms share threat intelligence |
| **competitionRounds** | 2 | Number of rounds where firms compete for contracts |
| **governanceRegime** | open, anonymized, auditable | How information sharing is governed |
| **absorptiveCapacity** | high, low | How well firms learn from shared intelligence |
| **threatVolatility** | stable, volatile | How unpredictable the threat environment is |
| **aggregationType** | ai, nonprofit | Who aggregates shared intelligence (AI vs human intermediary) |

---

## 🎮 Game Mechanics by Treatment Factor

### 1. **Governance Regime** (`governanceRegime`)

Controls how information sharing works and affects player identity visibility.

#### **Open** (`open`)
- **Player Identity**: Visible to all
- **Sharing**: Players can see who shared what
- **Competition Impact**: No reputation penalty
- **Use Case**: Tests collaboration with full transparency

**Code Location**: `callbacks.js:99, 146`
```javascript
// In disclosure stage - shows player ID
playerId: game.get("governanceRegime") === "anonymized" ? "anonymous" : player.id

// In competition stage - no penalty
if (governanceRegime === "auditable") {
  // Only auditable has reputation penalty
}
```

#### **Anonymized** (`anonymized`)
- **Player Identity**: Hidden (shows as "anonymous")
- **Sharing**: Players can't identify who shared
- **Competition Impact**: No reputation penalty
- **Use Case**: Tests if anonymity increases sharing

**Code Location**: `callbacks.js:99`
```javascript
playerId: game.get("governanceRegime") === "anonymized" ? "anonymous" : player.id
```

#### **Auditable** (`auditable`)
- **Player Identity**: Visible to all
- **Sharing**: Tracked and affects reputation
- **Competition Impact**: **Reputation penalty** based on information leakage
- **Use Case**: Tests accountability effects on sharing behavior

**Code Location**: `callbacks.js:161-165`
```javascript
if (governanceRegime === "auditable") {
  const leakageHistory = player.get("leakageHistory") || [];
  const avgLeakage = leakageHistory.reduce((a, b) => a + b, 0) / (leakageHistory.length || 1);
  reputationPenalty = avgLeakage * 20;  // Up to 20 point penalty
}
```

**Calculation**: 
- Average leakage intensity × 20 = reputation penalty
- Reduces competition score
- Incentivizes careful sharing

---

### 2. **Absorptive Capacity** (`absorptiveCapacity`)

Controls how effectively firms learn from shared intelligence.

#### **High** (`high`)
- **Learning Rate**: 80% (0.8)
- **Benefit**: Firms absorb most of the AI model improvements
- **Use Case**: Represents firms with strong cybersecurity teams

#### **Low** (`low`)
- **Learning Rate**: 40% (0.4)
- **Benefit**: Firms only absorb half of AI model improvements
- **Use Case**: Represents firms with limited cybersecurity expertise

**Code Location**: `callbacks.js:117-121`
```javascript
const absorptiveCapacity = player.get("absorptiveCapacity");
const learningRate = absorptiveCapacity === "high" ? 0.8 : 0.4;

const detectionImprovement = (aiAccuracy - baseDetection) * learningRate;
const newDetection = Math.min(0.95, baseDetection + detectionImprovement);
```

**Calculation Example**:
- AI Model Accuracy: 0.75
- Player Baseline: 0.60
- Improvement: 0.15

**High Capacity**: 0.60 + (0.15 × 0.8) = 0.72 detection rate
**Low Capacity**: 0.60 + (0.15 × 0.4) = 0.66 detection rate

---

### 3. **Threat Volatility** (`threatVolatility`)

Controls how unpredictable the threat environment is.

#### **Stable** (`stable`)
- **AI Penalty**: 0% (no penalty)
- **Effect**: Shared intelligence remains accurate
- **Use Case**: Predictable threat landscape

#### **Volatile** (`volatile`)
- **AI Penalty**: -10% (-0.1)
- **Effect**: Shared intelligence degrades faster
- **Use Case**: Rapidly evolving threats (e.g., zero-days)

**Code Location**: `callbacks.js:76-82`
```javascript
const threatVolatility = game.get("threatVolatility");

const baseAccuracy = 0.5;
const telemetryBonus = sharedTelemetry.length * 0.05;  // +5% per sharing firm
const volatilityPenalty = threatVolatility === "volatile" ? 0.1 : 0;

const aiAccuracy = Math.min(0.95, baseAccuracy + telemetryBonus - volatilityPenalty);
```

**AI Model Accuracy Formula**:
```
AI Accuracy = min(0.95, 0.5 + (shared_count × 0.05) - volatility_penalty)
```

**Example** (3 firms share):
- **Stable**: 0.5 + (3 × 0.05) - 0 = **0.65**
- **Volatile**: 0.5 + (3 × 0.05) - 0.1 = **0.55**

---

### 4. **Aggregation Type** (`aggregationType`)

**NEW FACTOR** - Controls whether shared intelligence is processed by AI or a nonprofit organization.

This factor enables testing a critical research question: **Do people share differently with AI vs. human intermediaries?**

#### **AI** (`ai`)
- **Intermediary**: Automated AI system
- **Framing**: "Training a collective AI model"
- **Perception**: Non-human actor, uncertain future use
- **UI Language**: 
  - "AI Model Training"
  - "The AI model is learning from shared telemetry"
  - "Collective threat detection model"
- **Use Case**: Tests instrumental caution with AI

**Code Location**: `AIAggregationStage.tsx:10-12, 18-23`
```typescript
const aggregationType = (game.get("aggregationType") as string) || "ai";
const isNonprofit = aggregationType === "nonprofit";

<h1>{isNonprofit ? "Nonprofit Organization Processing" : "AI Model Training"}</h1>
```

#### **Nonprofit** (`nonprofit`)
- **Intermediary**: Cybersecurity Information Sharing Organization (CISO)
- **Framing**: "Helping other firms / public good"
- **Perception**: Human-led organization, prosocial purpose
- **UI Language**:
  - "Nonprofit Organization Processing"
  - "The nonprofit organization is analyzing shared intelligence"
  - "Cybersecurity Information Sharing Organization (CISO)"
- **Use Case**: Tests prosocial sharing motivations

**Code Location**: `AIAggregationStage.tsx:20-56, DisclosureStage.tsx:53-55`
```typescript
{isNonprofit 
  ? "The Cybersecurity Information Sharing Organization (CISO) is aggregating shared intelligence to help protect all member firms..."
  : "The system is aggregating shared telemetry and training the collective threat detection model..."}
```

#### **Key Differences in Framing**

| Aspect | AI | Nonprofit |
|--------|----|----|
| **Purpose** | Train automated model | Help other firms |
| **Recipient** | Non-human system | Human organization |
| **Moral Framing** | Instrumental/Technical | Prosocial/Altruistic |
| **Social Obligation** | None | Reciprocal moral duty |
| **Trust Basis** | Algorithmic neutrality | Organizational mission |

#### **Research Hypothesis Enabled**

**Contradictory Finding**: Players may share **less** with AI than with nonprofit intermediary

**Why?**
1. **No social forgiveness** - AI has no moral obligation to reciprocate
2. **Uncertain future use** - AI's knowledge could be used adversarially
3. **Instrumental caution** - People are strategically cautious with non-human actors
4. **Lack of prosocial motivation** - Sharing with AI doesn't feel like "helping others"

**Prediction**: Anonymity may **fail to increase sharing** in AI condition because there's no social relationship to protect

**Code Impact**: Currently, the game mechanics are identical for both conditions. The **only difference is UI framing**. This is intentional - it isolates the psychological effect of AI vs. human intermediary.

---

### 5. **Collaboration & Competition Rounds**

#### **Collaboration Rounds** (`collaborationRounds`)
- **Default**: 3 rounds
- **Stages per round**:
  1. **Disclosure** (120s): Players decide what threat intelligence to share
  2. **AI Aggregation** (30s): System processes shared data
  3. **Results** (60s): Players see detection improvements and payoffs

**Payoff Calculation** (`callbacks.js:125-137`):
```javascript
const attackExposure = Math.random() * 100;
const attacksPrevented = attackExposure * newDetection;
const shortTermPayoff = attacksPrevented * 10;

const disclosureCost = disclosure.amount === "full" ? 50 : 
                       disclosure.amount === "partial" ? 25 : 0;

const netPayoff = shortTermPayoff - disclosureCost;
```

**Payoff Formula**:
```
Payoff = (Random_Attacks × Detection_Rate × 10) - Disclosure_Cost
```

#### **Competition Rounds** (`competitionRounds`)
- **Default**: 2 rounds
- **Stages per round**:
  1. **Competition** (120s): Players compete for contracts
  2. **Competition Results** (60s): Rankings and payoffs

**Competition Score Calculation** (`callbacks.js:148-175`):
```javascript
const uniqueSignals = [...ownSignals, ...learnedSignals];
const competitiveAdvantage = uniqueSignals.length * 5;
const baseScore = Math.random() * 100;
const competitionScore = baseScore + competitiveAdvantage;

// Auditable governance adds reputation penalty
let reputationPenalty = 0;
if (governanceRegime === "auditable") {
  reputationPenalty = avgLeakage * 20;
}

const finalScore = competitionScore - reputationPenalty;
const competitionPayoff = (finalScore / 100) * 200;  // Contract worth $200
```

**Competition Formula**:
```
Score = Random(0-100) + (Unique_Signals × 5) - Reputation_Penalty
Payoff = (Score / 100) × $200
```

---

## 🔧 How to Modify Treatments

### Option 1: Edit Existing Treatments

Edit `.empirica/treatments.yaml`:

```yaml
treatments:
  - name: "Your Custom Treatment"
    desc: "Description of what you're testing"
    factors:
      playerCount: 4              # Change player count
      collaborationRounds: 5      # More collaboration rounds
      competitionRounds: 1        # Fewer competition rounds
      governanceRegime: auditable # Change governance
      absorptiveCapacity: low     # Change learning ability
      threatVolatility: volatile  # Change environment
```

### Option 2: Add New Factor Values

Add new options to factors:

```yaml
factors:
  - name: governanceRegime
    desc: Type of governance regime
    values:
      - value: open
      - value: anonymized
      - value: auditable
      - value: hybrid          # NEW: Add your own governance type
```

Then update game logic in `server/src/callbacks.js`.

---

## 🧮 How to Modify Game Calculations

### 1. Change AI Model Accuracy Formula

**File**: `server/src/callbacks.js:78-82`

**Current**:
```javascript
const baseAccuracy = 0.5;
const telemetryBonus = sharedTelemetry.length * 0.05;
const volatilityPenalty = threatVolatility === "volatile" ? 0.1 : 0;
const aiAccuracy = Math.min(0.95, baseAccuracy + telemetryBonus - volatilityPenalty);
```

**Modify to**:
```javascript
const baseAccuracy = 0.4;  // Lower starting point
const telemetryBonus = sharedTelemetry.length * 0.08;  // Bigger bonus per share
const volatilityPenalty = threatVolatility === "volatile" ? 0.15 : 0;  // Harsher penalty
const aiAccuracy = Math.min(0.98, baseAccuracy + telemetryBonus - volatilityPenalty);  // Higher cap
```

### 2. Change Learning Rates

**File**: `server/src/callbacks.js:118`

**Current**:
```javascript
const learningRate = absorptiveCapacity === "high" ? 0.8 : 0.4;
```

**Modify to**:
```javascript
const learningRate = absorptiveCapacity === "high" ? 0.9 : 0.3;  // Bigger gap
```

### 3. Change Disclosure Costs

**File**: `server/src/callbacks.js:130-131`

**Current**:
```javascript
const disclosureCost = disclosure.amount === "full" ? 50 : 
                       disclosure.amount === "partial" ? 25 : 0;
```

**Modify to**:
```javascript
const disclosureCost = disclosure.amount === "full" ? 100 :     // Higher cost
                       disclosure.amount === "partial" ? 30 : 0;
```

### 4. Change Competition Payoffs

**File**: `server/src/callbacks.js:156-171`

**Current**:
```javascript
const competitiveAdvantage = uniqueSignals.length * 5;
const contractValue = 200;
```

**Modify to**:
```javascript
const competitiveAdvantage = uniqueSignals.length * 10;  // Bigger advantage
const contractValue = 500;  // Higher stakes
```

### 5. Change Reputation Penalty

**File**: `server/src/callbacks.js:161-165`

**Current**:
```javascript
if (governanceRegime === "auditable") {
  reputationPenalty = avgLeakage * 20;
}
```

**Modify to**:
```javascript
if (governanceRegime === "auditable") {
  reputationPenalty = avgLeakage * 50;  // Harsher penalty
}
```

---

## 📈 Current Treatment Configurations

### Treatment 1: Solo Test
```yaml
playerCount: 1
collaborationRounds: 3
competitionRounds: 2
governanceRegime: open
absorptiveCapacity: high
threatVolatility: stable
aggregationType: ai
```
**Purpose**: Debugging and single-player testing

### Treatment 2: Baseline - Open Governance (AI)
```yaml
playerCount: 3
collaborationRounds: 3
competitionRounds: 2
governanceRegime: open
absorptiveCapacity: high
threatVolatility: stable
aggregationType: ai
```
**Purpose**: Control condition with full transparency and AI intermediary

### Treatment 3: Anonymized - High Capacity (AI)
```yaml
playerCount: 3
collaborationRounds: 3
competitionRounds: 2
governanceRegime: anonymized
absorptiveCapacity: high
threatVolatility: stable
aggregationType: ai
```
**Purpose**: Test if anonymity increases sharing with AI

### Treatment 4: Auditable - Volatile Environment (AI)
```yaml
playerCount: 3
collaborationRounds: 3
competitionRounds: 2
governanceRegime: auditable
absorptiveCapacity: high
threatVolatility: volatile
aggregationType: ai
```
**Purpose**: Test accountability + uncertainty effects with AI

### Treatment 5: Nonprofit - Open Governance ⭐ NEW
```yaml
playerCount: 3
collaborationRounds: 3
competitionRounds: 2
governanceRegime: open
absorptiveCapacity: high
threatVolatility: stable
aggregationType: nonprofit
```
**Purpose**: Test prosocial sharing with human intermediary (compare to Treatment 2)

### Treatment 6: Nonprofit - Anonymized ⭐ NEW
```yaml
playerCount: 3
collaborationRounds: 3
competitionRounds: 2
governanceRegime: anonymized
absorptiveCapacity: high
threatVolatility: stable
aggregationType: nonprofit
```
**Purpose**: Test if anonymity works differently with nonprofit vs AI (compare to Treatment 3)

---

## 🧪 Suggested Additional Treatments

### Low Capacity + Open
Tests if poor learning ability reduces sharing incentives:
```yaml
- name: "Low Capacity - Open Governance"
  factors:
    playerCount: 3
    collaborationRounds: 3
    competitionRounds: 2
    governanceRegime: open
    absorptiveCapacity: low      # Changed
    threatVolatility: stable
```

### Anonymized + Volatile
Tests anonymity in uncertain environments:
```yaml
- name: "Anonymized - Volatile Environment"
  factors:
    playerCount: 3
    collaborationRounds: 3
    competitionRounds: 2
    governanceRegime: anonymized
    absorptiveCapacity: high
    threatVolatility: volatile   # Changed
```

### Extended Collaboration
Tests long-term cooperation:
```yaml
- name: "Extended Collaboration"
  factors:
    playerCount: 4
    collaborationRounds: 5       # More rounds
    competitionRounds: 1         # Less competition
    governanceRegime: open
    absorptiveCapacity: high
    threatVolatility: stable
```

---

## 🔄 After Making Changes

1. **Restart the server**:
```bash
rm -rf .empirica/local/*
rm -rf server/dist
empirica
```

2. **Create new batch** in admin panel with your modified treatment

3. **Test with players** using the browser bot launcher:
```bash
cd /Users/katewang/Library/CloudStorage/Dropbox/Business_Ideas/A_SkillLedger/simulations/Robotadd
node openBrowserBots.js 3
```

---

## 📊 Key Metrics to Track

Based on your treatments, track these outcomes:

1. **Sharing Behavior**:
   - % of players who share (full vs partial vs none)
   - Difference by governance regime

2. **Learning Outcomes**:
   - Detection rate improvements
   - Difference by absorptive capacity

3. **Competition Performance**:
   - Final scores by treatment
   - Reputation penalties (auditable only)

4. **Payoffs**:
   - Total payoffs by treatment
   - Collaboration vs competition earnings

---

## 💡 Research Questions Your Treatments Answer

### Primary Questions

1. **Does anonymity increase sharing?**
   - Compare: Open vs Anonymized (within AI or nonprofit)
   - Treatments: 2 vs 3, or 5 vs 6

2. **Does accountability reduce sharing?**
   - Compare: Open vs Auditable
   - Treatments: 2 vs 4

3. **Does learning ability affect sharing incentives?**
   - Compare: High vs Low absorptive capacity
   - Note: Need to add low capacity treatments

4. **Does uncertainty reduce collaboration value?**
   - Compare: Stable vs Volatile threat environment
   - Treatments: 2 vs 4

5. **Do reputation concerns affect competition outcomes?**
   - Analyze: Auditable treatment competition scores
   - Treatment: 4

### ⭐ NEW: AI vs. Human Intermediary Questions

6. **Do people share less with AI than with a nonprofit organization?**
   - **Compare**: Treatment 2 (AI-Open) vs Treatment 5 (Nonprofit-Open)
   - **Hypothesis**: Sharing with nonprofit > Sharing with AI
   - **Why**: Prosocial motivation vs. instrumental caution

7. **Does anonymity work differently with AI vs. nonprofit intermediaries?**
   - **Compare**: 
     - AI: Treatment 2 (Open) vs 3 (Anonymized)
     - Nonprofit: Treatment 5 (Open) vs 6 (Anonymized)
   - **Hypothesis**: Anonymity increases sharing with nonprofit but not with AI
   - **Why**: Social forgiveness matters with human intermediaries, not with AI

8. **Is there instrumental caution with AI even when framed as neutral?**
   - **Analyze**: Sharing rates in AI treatments (2, 3, 4)
   - **Hypothesis**: Lower sharing despite AI being "neutral"
   - **Why**: Uncertain future use of AI knowledge

### Key Comparisons Table

| Research Question | Treatment A | Treatment B | Expected Outcome |
|-------------------|-------------|-------------|------------------|
| AI reduces prosocial sharing | 2 (AI-Open) | 5 (Nonprofit-Open) | B > A |
| Anonymity + AI fails | 2 (AI-Open) | 3 (AI-Anon) | A ≈ B (no effect) |
| Anonymity + Nonprofit works | 5 (NP-Open) | 6 (NP-Anon) | B > A |
| Accountability reduces sharing | 2 (AI-Open) | 4 (AI-Audit) | A > B |
