# Balanced Multi-Treatment Assignment Guide

## Overview

This guide explains how to distribute participants evenly across multiple treatment groups, ensuring each treatment gets participants before filling any single group completely.

---

## The Problem

**Default behavior (Complete assignment):**
```
Treatment A: Player 1, 2, 3, 4 (FULL)
Treatment B: Player 5, 6, 7, 8 (FULL)
Treatment C: (EMPTY - no participants left!)
```

**Desired behavior (Balanced assignment):**
```
Treatment A: Player 1, 4, 7, 10
Treatment B: Player 2, 5, 8, 11
Treatment C: Player 3, 6, 9, 12
```

This ensures each treatment group gets participants, even with limited turnout.

---

## Empirica Assignment Methods

### 1. **Complete** (Default)
- Fills each treatment group completely before moving to next
- **Problem**: Later treatments may get no participants
- **Use case**: Single treatment studies

### 2. **Simple**
- Random assignment to treatments
- **Problem**: Unbalanced distribution (some groups may be empty)
- **Use case**: Large sample sizes where randomness balances out

### 3. **Custom** (Recommended for Balanced Assignment) ✅
- You control the assignment logic
- Can implement round-robin or other balanced strategies
- **Use case**: Multiple treatments with limited participants

---

## Solution: Custom Assignment with Round-Robin

### Step 1: Create Batch with Custom Assignment

**In Admin Panel:**

1. Go to http://localhost:3000/admin
2. Click "New Batch"
3. **Select**:
   - **Assignment Method**: `Custom`
   - **Treatments**: Select multiple treatments (e.g., `Open-High-Stable`, `Open-Low-Stable`, `Anon-High-Stable`)
   - **Lobby Configuration**: `Default shared ignore`

### Step 2: Configure Custom Assignment Logic

When you select "Custom" assignment, Empirica will ask you to configure the assignment pattern.

**Round-Robin Pattern:**
```
Treatment 1 → Treatment 2 → Treatment 3 → Treatment 1 → Treatment 2 → ...
```

**Example Configuration:**

If you have 3 treatments:
- Player 1 → Treatment A
- Player 2 → Treatment B
- Player 3 → Treatment C
- Player 4 → Treatment A (cycle repeats)
- Player 5 → Treatment B
- Player 6 → Treatment C

---

## Implementation Options

### Option A: Use Empirica's Built-in Custom Assignment

**In the Admin Panel:**

When creating a batch with Custom assignment, you can specify:

```yaml
Assignment Pattern: round-robin
Treatments:
  - Open-High-Stable
  - Open-Low-Stable
  - Anon-High-Stable
```

### Option B: Programmatic Assignment (Advanced)

If you need more control, you can implement custom assignment logic in the server callbacks.

**File:** `server/src/callbacks.js`

Add a custom assignment function:

```javascript
// Custom round-robin assignment
export function onPlayerJoin({ player, batch }) {
  const treatments = batch.get("treatments");
  const assignedPlayers = batch.get("assignedPlayers") || 0;
  
  // Round-robin: cycle through treatments
  const treatmentIndex = assignedPlayers % treatments.length;
  const selectedTreatment = treatments[treatmentIndex];
  
  // Assign player to treatment
  player.set("treatment", selectedTreatment);
  
  // Increment counter
  batch.set("assignedPlayers", assignedPlayers + 1);
  
  console.log(`Player ${player.id} assigned to ${selectedTreatment.name}`);
}
```

---

## Example Scenarios

### Scenario 1: 3 Treatments, 9 Participants

**Treatments:**
- Open-High-Stable (4 players needed)
- Open-Low-Stable (4 players needed)
- Anon-High-Stable (4 players needed)

**Assignment Method:** Custom (Round-Robin)

**Result:**
```
Round 1:
  Player 1 → Open-High-Stable
  Player 2 → Open-Low-Stable
  Player 3 → Anon-High-Stable

Round 2:
  Player 4 → Open-High-Stable
  Player 5 → Open-Low-Stable
  Player 6 → Anon-High-Stable

Round 3:
  Player 7 → Open-High-Stable
  Player 8 → Open-Low-Stable
  Player 9 → Anon-High-Stable

Final Distribution:
  Open-High-Stable: 3 players
  Open-Low-Stable: 3 players
  Anon-High-Stable: 3 players
```

✅ **All treatments have participants!**

### Scenario 2: 3 Treatments, 5 Participants (Limited Turnout)

**Assignment Method:** Custom (Round-Robin)

**Result:**
```
Player 1 → Open-High-Stable
Player 2 → Open-Low-Stable
Player 3 → Anon-High-Stable
Player 4 → Open-High-Stable
Player 5 → Open-Low-Stable

Final Distribution:
  Open-High-Stable: 2 players
  Open-Low-Stable: 2 players
  Anon-High-Stable: 1 player
```

✅ **All treatments have at least 1 participant!**

**With Complete Assignment (for comparison):**
```
Player 1-4 → Open-High-Stable (FULL)
Player 5 → Open-Low-Stable

Final Distribution:
  Open-High-Stable: 4 players
  Open-Low-Stable: 1 player
  Anon-High-Stable: 0 players ❌
```

---

## Best Practices

### For Multi-Treatment Studies

**Use balanced assignment when:**
- You have multiple treatment conditions
- Participant turnout is uncertain
- You need data from all treatment groups
- Sample size is limited

**Combine with flexible lobbies:**
- Use `strategy: ignore` lobbies
- Each treatment group starts with available players
- No treatment groups are cancelled due to low turnout

### Recommended Configuration

```yaml
Batch Configuration:
  Assignment Method: Custom (Round-Robin)
  Treatments:
    - Treatment A
    - Treatment B
    - Treatment C
  Lobby: Default shared ignore (10 minutes)
  
Result:
  - Players distributed evenly across treatments
  - Each treatment starts with available players
  - Maximum data collection across all conditions
```

---

## Alternative: Weighted Assignment

If you want to prioritize certain treatments, use weighted assignment:

```javascript
export function onPlayerJoin({ player, batch }) {
  const treatments = [
    { name: "Open-High-Stable", weight: 2 },    // 2x priority
    { name: "Open-Low-Stable", weight: 1 },     // 1x priority
    { name: "Anon-High-Stable", weight: 1 }     // 1x priority
  ];
  
  // Weighted random assignment
  const totalWeight = treatments.reduce((sum, t) => sum + t.weight, 0);
  const random = Math.random() * totalWeight;
  
  let cumulativeWeight = 0;
  for (const treatment of treatments) {
    cumulativeWeight += treatment.weight;
    if (random < cumulativeWeight) {
      player.set("treatment", treatment.name);
      break;
    }
  }
}
```

**Result with 12 players:**
```
Open-High-Stable: ~6 players (50%)
Open-Low-Stable: ~3 players (25%)
Anon-High-Stable: ~3 players (25%)
```

---

## Step-by-Step: Creating a Balanced Multi-Treatment Batch

### 1. Prepare Your Treatments

Create treatments with similar player counts:

```yaml
# .empirica/treatments.yaml
treatments:
  - name: Treatment-A
    factors:
      playerCount: 3
      collaborationRounds: 4
      
  - name: Treatment-B
    factors:
      playerCount: 3
      collaborationRounds: 4
      
  - name: Treatment-C
    factors:
      playerCount: 3
      collaborationRounds: 4
```

### 2. Create Batch in Admin Panel

1. **Navigate**: http://localhost:3000/admin
2. **Click**: "New Batch"
3. **Configure**:
   - **Assignment Method**: Custom
   - **Assignment Pattern**: Round-Robin
   - **Treatments**: Select all 3 treatments
   - **Lobby**: Default shared ignore

### 3. Generate Player Links

After creating the batch, you'll get player links:

```
http://localhost:3000?participantKey=abc123
http://localhost:3000?participantKey=def456
http://localhost:3000?participantKey=ghi789
...
```

### 4. Distribute Links to Participants

**Option A: Sequential Distribution**
- Send links in order to participants
- Each participant gets next treatment in rotation

**Option B: Batch Distribution**
- Send all links at once
- First to join gets Treatment A, second gets Treatment B, etc.

### 5. Monitor Assignment

In the admin panel, you can see:
- Which players are assigned to which treatments
- Current player count per treatment
- Lobby status for each treatment group

---

## Troubleshooting

### Issue: Players not evenly distributed

**Cause:** Using "Complete" or "Simple" assignment instead of "Custom"

**Solution:**
1. Create new batch with "Custom" assignment
2. Select "Round-Robin" pattern
3. Recreate player links

### Issue: Some treatment groups have no players

**Cause:** Not enough participants joined before lobby timeout

**Solution:**
1. Use longer lobby timeout (e.g., 15-20 minutes)
2. Ensure all participants join around the same time
3. Use flexible lobbies (`strategy: ignore`) so games start anyway

### Issue: Can't find "Custom" assignment option

**Cause:** May need to enable in Empirica configuration

**Solution:**
Check if your Empirica version supports custom assignment. If not, implement programmatic assignment in `callbacks.js` (see Option B above).

---

## Comparison Table

| Assignment Method | Distribution | Guarantees All Groups Get Players | Best For |
|-------------------|--------------|-----------------------------------|----------|
| **Complete** | Sequential fill | ❌ No | Single treatment |
| **Simple** | Random | ❌ No (with small N) | Large samples |
| **Custom (Round-Robin)** | Balanced rotation | ✅ Yes | Multiple treatments |
| **Custom (Weighted)** | Proportional | ⚠️ Probabilistic | Prioritized treatments |

---

## Summary

**To ensure all treatment groups get participants:**

1. ✅ Use **Custom assignment** with **Round-Robin** pattern
2. ✅ Combine with **flexible lobbies** (`strategy: ignore`)
3. ✅ Set appropriate **lobby timeout** for your recruitment
4. ✅ Monitor assignment in **admin panel**

**Result:** Even with limited turnout, all treatment groups will have participants and can start their experiments!

---

## Related Documentation

- `FLEXIBLE_PARTICIPATION.md` - Flexible lobby configurations
- `TESTING_GUIDE.md` - Testing multi-treatment setups
- `.empirica/treatments.yaml` - Treatment definitions
- `server/src/callbacks.js` - Custom assignment logic
