# Testing Guide - Solo Multi-Player Testing

## How Player Count Works

### Player Count is in the Treatment

When you create a batch in the admin panel, you see:
- **Assignment Method**: How treatments are assigned
- **Treatments**: Which experimental conditions to use
- **Lobby Configuration**: How players wait

**The player count is NOT a separate field** - it's defined in each treatment's `playerCount` factor.

### Example from Your Treatments

```yaml
# Solo testing - needs 1 player
- name: "Solo-Test"
  factors:
    playerCount: 1  # ← This determines player count

# Full study - needs 4 players  
- name: "Open-High-Stable"
  factors:
    playerCount: 4  # ← This determines player count
```

### How to Change Player Count

1. **Edit `.empirica/treatments.yaml`**
2. **Change the `playerCount` factor**
3. **Restart Empirica**
4. **Create new batch with that treatment**

## Solo Multi-Player Testing Methods

### Method 1: Multiple Browser Windows (Easiest)

**Best for:** Quick testing with 2-4 players

**Steps:**
1. Create a batch in admin panel
2. Select a treatment (e.g., "Solo-Test" with playerCount: 1, or create one with playerCount: 2)
3. Get the player links from the batch
4. Open **multiple browser windows** (not tabs - separate windows)
5. Paste a different player link in each window
6. Play as each player by switching between windows

**Tips:**
- Use Chrome's "New Window" (Cmd+N on Mac, Ctrl+N on Windows)
- Arrange windows side-by-side
- Use different browser profiles if needed

**Example:**
```bash
# Window 1: Player 1
http://localhost:3000?participantKey=player1key

# Window 2: Player 2  
http://localhost:3000?participantKey=player2key

# Window 3: Player 3
http://localhost:3000?participantKey=player3key
```

### Method 2: Multiple Browsers (Better Isolation)

**Best for:** Testing with 3-4 players, avoiding conflicts

**Steps:**
1. Use different browsers:
   - Chrome
   - Firefox
   - Safari
   - Edge
2. Open player link in each browser
3. Play as each player

**Advantages:**
- Complete session isolation
- No cookie conflicts
- More realistic testing

### Method 3: Incognito/Private Windows

**Best for:** Testing with many players (4+)

**Steps:**
1. Open multiple incognito/private windows
2. Each incognito window is a separate session
3. Paste different player links in each

**Chrome:**
- Cmd+Shift+N (Mac) or Ctrl+Shift+N (Windows)

**Firefox:**
- Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)

**Safari:**
- Cmd+Shift+N (Mac)

### Method 4: Browser Profiles (Most Professional)

**Best for:** Regular testing, simulating real users

**Chrome Profiles:**
```bash
# Create profiles in Chrome
# Chrome > Settings > Manage Profiles > Add Profile

# Each profile is completely separate
# Can have different player links open simultaneously
```

**Steps:**
1. Create 4 Chrome profiles (Player1, Player2, Player3, Player4)
2. Open each profile in a separate window
3. Navigate to different player links
4. Switch between profiles to play

## Quick Testing Configurations

### Configuration 1: Solo Testing (1 Player)

**Use Case:** Testing game flow, UI, single-player logic

**Treatment:**
```yaml
- name: "Solo-Test"
  factors:
    playerCount: 1
    collaborationRounds: 2
    competitionRounds: 1
```

**Testing:**
- Just one browser window
- Stages advance immediately after submit
- Fast iteration

### Configuration 2: Pair Testing (2 Players)

**Use Case:** Testing multiplayer synchronization

**Create this treatment:**
```yaml
- name: "Pair-Test"
  factors:
    playerCount: 2
    collaborationRounds: 2
    competitionRounds: 1
    governanceRegime: "open"
    absorptiveCapacity: "high"
    threatVolatility: "stable"
```

**Testing:**
- Two browser windows side-by-side
- Test stage synchronization
- Verify data sharing works

### Configuration 3: Small Group (3 Players)

**Use Case:** Testing group dynamics

**Create this treatment:**
```yaml
- name: "Small-Group-Test"
  factors:
    playerCount: 3
    collaborationRounds: 3
    competitionRounds: 1
    governanceRegime: "anonymized"
    absorptiveCapacity: "high"
    threatVolatility: "stable"
```

**Testing:**
- Three browser windows or browsers
- Test anonymization
- Verify AI aggregation with multiple inputs

### Configuration 4: Full Study (4 Players)

**Use Case:** Full experiment simulation

**Use existing treatment:**
```yaml
- name: "Open-High-Stable"
  factors:
    playerCount: 4
    collaborationRounds: 8
    competitionRounds: 4
```

**Testing:**
- Four browser windows/profiles
- Full experiment flow
- Complete data collection test

## Step-by-Step: Testing with 2 Players

### 1. Create a Pair Testing Treatment

Edit `.empirica/treatments.yaml`, add:

```yaml
- name: "Pair-Test"
  desc: "Two player testing"
  factors:
    playerCount: 2
    collaborationRounds: 2
    competitionRounds: 1
    governanceRegime: "open"
    absorptiveCapacity: "high"
    threatVolatility: "stable"
```

### 2. Restart Empirica

```bash
# Stop server (Ctrl+C)
empirica
```

### 3. Create Batch

1. Go to http://localhost:3000/admin
2. Click "New Batch"
3. **Treatments**: Select "Pair-Test"
4. **Lobby Configuration**: Select "Default shared fail" or "Default individual"
5. Click "Create"

### 4. Get Player Links

The batch will show 2 player links:
```
Player 1: http://localhost:3000?participantKey=abc123
Player 2: http://localhost:3000?participantKey=def456
```

### 5. Open Two Windows

**Window 1:**
- Open Chrome
- Paste Player 1 link
- Complete onboarding and consent

**Window 2:**
- Open new Chrome window (Cmd+N)
- Paste Player 2 link
- Complete onboarding and consent

### 6. Play Both Players

- Switch between windows
- Make decisions as each player
- Watch stages synchronize
- Verify both players advance together

## Testing Checklist

### Before Testing

- [ ] Clear old data: `rm -rf .empirica/local`
- [ ] Restart Empirica: `empirica`
- [ ] Create fresh batch with appropriate treatment
- [ ] Copy all player links

### During Testing

- [ ] Complete onboarding for all players
- [ ] Test stage synchronization
- [ ] Verify decisions are saved
- [ ] Check data sharing works
- [ ] Test competition phase
- [ ] Complete exit survey

### After Testing

- [ ] Export data from admin panel
- [ ] Verify data structure
- [ ] Check for errors in console
- [ ] Review server logs
- [ ] Clear data for next test

## Common Issues

### Issue: Players Not Synchronizing

**Cause:** One player didn't submit

**Solution:**
- Check both windows
- Ensure both clicked submit
- Wait for stage timer to expire

### Issue: Game Won't Start

**Cause:** Not enough players connected

**Solution:**
- Verify all player links are opened
- Check all completed onboarding
- Look at admin panel - should show all players connected

### Issue: Can't Open Multiple Windows

**Cause:** Browser limitations

**Solution:**
- Use different browsers instead
- Use incognito windows
- Create browser profiles

### Issue: Sessions Conflicting

**Cause:** Same browser session

**Solution:**
- Use incognito windows
- Use different browsers
- Clear cookies between tests

## Advanced Testing

### Automated Testing with Puppeteer

For automated multi-player testing:

```javascript
// test-multiplayer.js
const puppeteer = require('puppeteer');

async function testMultiplayer() {
  // Launch 4 browsers
  const browsers = await Promise.all([
    puppeteer.launch({ headless: false }),
    puppeteer.launch({ headless: false }),
    puppeteer.launch({ headless: false }),
    puppeteer.launch({ headless: false })
  ]);
  
  // Open player links
  const pages = await Promise.all(
    browsers.map(async (browser, i) => {
      const page = await browser.newPage();
      await page.goto(`http://localhost:3000?participantKey=player${i}`);
      return page;
    })
  );
  
  // Automate gameplay...
}
```

### Network Testing

Test with simulated network conditions:

1. Chrome DevTools > Network tab
2. Set throttling (Slow 3G, Fast 3G)
3. Test disconnections
4. Verify reconnection works

## Best Practices

### For Development

1. **Use Solo-Test** (1 player) for UI/UX work
2. **Use Pair-Test** (2 players) for multiplayer logic
3. **Short rounds** (2-3) for quick iteration
4. **Clear data frequently** between tests

### For Pre-Production

1. **Use Small-Group-Test** (3 players) for integration
2. **Medium rounds** (4-5) for realistic testing
3. **Test all treatments** systematically
4. **Document issues** as you find them

### For Final Testing

1. **Use full treatments** (4 players, 12 rounds)
2. **Complete end-to-end** test
3. **Export and verify data**
4. **Test on different devices/browsers**

## Quick Commands Reference

```bash
# Clear all data
rm -rf .empirica/local

# Restart Empirica
empirica

# Backup data
cp .empirica/local/tajriba.json backup_$(date +%Y%m%d_%H%M%S).json

# View treatments
cat .empirica/treatments.yaml

# View lobbies
cat .empirica/lobbies.yaml
```

## Troubleshooting

### Can't see new treatment in admin

**Solution:**
```bash
# Restart Empirica to reload treatments
Ctrl+C
empirica
```

### Player links not working

**Solution:**
- Verify batch is active
- Check participant keys are correct
- Ensure server is running
- Try refreshing admin panel

### Stages not advancing

**Solution:**
- Check all players submitted
- Look for `player.stage.set("submit", true)` in code
- Wait for stage timer
- Check server logs for errors

## Summary

**To test with multiple players solo:**

1. **Create treatment** with desired `playerCount` in `.empirica/treatments.yaml`
2. **Restart Empirica**
3. **Create batch** with that treatment
4. **Open multiple browser windows** (one per player)
5. **Paste different player links** in each window
6. **Switch between windows** to play as each player

**Recommended for testing:**
- 1 player: Solo-Test (already added)
- 2 players: Create Pair-Test treatment
- 3-4 players: Use multiple browser windows or profiles

This is much faster than recruiting real participants for testing!
