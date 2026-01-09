# Flexible Participation Guide

## Overview

This guide explains how to run experiments that start even if the required number of participants hasn't joined the lobby.

---

## How It Works

Empirica has two lobby strategies:

### 1. **`ignore` Strategy** (Flexible) ✅
- **Starts the game** even if not all players have joined
- **Use case**: When you want the experiment to proceed regardless of participant count
- **Example**: Lobby timeout expires with 2/4 players → game starts with 2 players

### 2. **`fail` Strategy** (Strict) ❌
- **Cancels the game** if not enough players join
- **Use case**: When you need exactly the specified number of players
- **Example**: Lobby timeout expires with 2/4 players → game is cancelled

---

## Setting Up Flexible Participation

### Step 1: Choose a Lobby Configuration

When creating a batch in the admin panel, select a lobby with **`strategy: ignore`**:

**Available lobbies:**
- **Default shared ignore** (10 minutes, flexible)
- **Default individual** (5 minutes, flexible)
- **Quick Test** (2 minutes, flexible)

**Avoid:**
- **Default shared fail** (10 minutes, strict - requires exact player count)

### Step 2: Choose a Treatment

Use treatments designed for flexible participation:

#### **Flexible Treatments:**

**`Flexible-2-4-Players`**
- Designed for 2-4 players
- 4 collaboration rounds, 2 competition rounds
- Starts with whoever joins (minimum 1 player)

**`Flexible-Quick-Test`**
- Designed for 1-2 players
- 2 collaboration rounds, 1 competition round
- Perfect for quick testing

**`Solo-Test`**
- Single player mode
- 2 collaboration rounds, 1 competition round
- Always starts immediately

#### **Standard Treatments (also work with flexible lobbies):**
- `Open-High-Stable` (designed for 4 players, but starts with any number)
- `Open-Low-Stable` (designed for 4 players, but starts with any number)
- All other treatments work flexibly when paired with `ignore` lobby

---

## Creating a Flexible Batch

### In Admin Panel:

1. **Go to**: http://localhost:3000/admin
2. **Click**: "New Batch"
3. **Configure**:
   - **Assignment Method**: Complete, Simple, or Custom
   - **Treatments**: Select `Flexible-2-4-Players` or `Flexible-Quick-Test`
   - **Lobby Configuration**: Select `Default shared ignore` or `Quick Test`
4. **Click**: "Create"
5. **Share**: Player links with participants

### Example Configuration:

```yaml
Batch Name: Flexible Study Session 1
Assignment Method: Complete
Treatments: Flexible-2-4-Players
Lobby: Default shared ignore (10 minutes)
```

**Result:**
- Lobby waits up to 10 minutes for players to join
- Game starts with whoever has joined (even if just 1 player)
- No cancellation if target player count not reached

---

## How Players Experience It

### Scenario 1: Enough Players Join ✅

```
1. Player 1 joins → enters lobby
2. Player 2 joins → enters lobby
3. Player 3 joins → enters lobby
4. Player 4 joins → enters lobby
✅ Game starts immediately with 4 players
```

### Scenario 2: Not Enough Players (Flexible Lobby) ✅

```
1. Player 1 joins → enters lobby
2. Player 2 joins → enters lobby
3. [10 minutes pass]
4. Lobby timeout expires
✅ Game starts with 2 players
```

### Scenario 3: Not Enough Players (Strict Lobby) ❌

```
1. Player 1 joins → enters lobby
2. Player 2 joins → enters lobby
3. [10 minutes pass]
4. Lobby timeout expires
❌ Game is cancelled (using 'fail' strategy)
```

---

## Best Practices

### For Research Studies

**Use flexible lobbies when:**
- Participant no-shows are common
- You want to maximize data collection
- The experiment works with variable player counts
- You're running asynchronous recruitment (e.g., Prolific, MTurk)

**Use strict lobbies when:**
- Exact player count is critical for the research design
- You have scheduled sessions with confirmed participants
- The experiment requires specific group dynamics

### For Testing

**Always use flexible lobbies:**
- `Quick Test` lobby (2 minutes)
- `Flexible-Quick-Test` treatment
- Allows rapid iteration without waiting for multiple players

---

## Technical Details

### Lobby Configuration File

Location: `.empirica/lobbies.yaml`

```yaml
lobbies:
  - name: Default shared ignore
    kind: shared
    duration: 10m0s
    strategy: ignore  # ← Flexible: starts with any number

  - name: Default shared fail
    kind: shared
    duration: 10m0s
    strategy: fail    # ← Strict: requires exact number
```

### Treatment Configuration File

Location: `.empirica/treatments.yaml`

```yaml
treatments:
  - name: Flexible-2-4-Players
    desc: 'Flexible participation: Starts with 2-4 players'
    factors:
      playerCount: 2  # Minimum suggested, but works with any count
      collaborationRounds: 4
      competitionRounds: 2
```

**Note:** The `playerCount` in treatments is a **suggestion**, not a hard requirement. With `ignore` strategy, the game starts regardless of actual player count.

---

## Troubleshooting

### Issue: Game won't start even with flexible lobby

**Possible causes:**
1. **Wrong lobby selected**: Check you selected a lobby with `strategy: ignore`
2. **No players joined**: At least 1 player must complete intro steps
3. **Lobby timeout not reached**: Wait for the full duration or until all expected players join

**Solution:**
- Verify lobby configuration in admin panel
- Check that players completed onboarding and consent forms
- Wait for lobby timeout to expire

### Issue: Game cancelled despite having some players

**Cause:** Using a lobby with `strategy: fail`

**Solution:**
- Create a new batch with `Default shared ignore` lobby
- Or use `Quick Test` lobby for faster testing

### Issue: Game dynamics broken with fewer players

**Cause:** Some game mechanics may assume specific player counts

**Solution:**
- Use treatments designed for flexible participation
- Test with minimum expected player count
- Adjust game logic in `server/src/callbacks.js` if needed

---

## Example Use Cases

### Use Case 1: Online Study with Uncertain Turnout

**Setup:**
- Treatment: `Flexible-2-4-Players`
- Lobby: `Default shared ignore` (10 minutes)
- Recruitment: Prolific (scheduled for 4 participants)

**Outcome:**
- 3 participants show up on time
- 1 participant is late
- Game starts after 10 minutes with 3 players
- Late participant joins next session

### Use Case 2: Classroom Demonstration

**Setup:**
- Treatment: `Flexible-Quick-Test`
- Lobby: `Quick Test` (2 minutes)
- Participants: Students with laptops

**Outcome:**
- Students join as they're ready
- Game starts after 2 minutes with whoever joined
- Quick demonstration of experiment mechanics

### Use Case 3: Solo Development Testing

**Setup:**
- Treatment: `Solo-Test`
- Lobby: `Default individual` (5 minutes)
- Participants: Just you

**Outcome:**
- Join as single player
- Game starts immediately (individual lobby)
- Test all stages and data collection

---

## Summary

**To enable flexible participation:**

1. ✅ Use lobby with `strategy: ignore`
2. ✅ Choose flexible treatment (or any treatment works)
3. ✅ Create batch and share links
4. ✅ Game starts with whoever joins before timeout

**Key benefit:** Maximize data collection even with participant no-shows!

---

## Related Documentation

- `TESTING_GUIDE.md` - Solo multi-player testing
- `ADMIN_TROUBLESHOOTING.md` - Batch management
- `.empirica/lobbies.yaml` - Lobby configurations
- `.empirica/treatments.yaml` - Treatment definitions
