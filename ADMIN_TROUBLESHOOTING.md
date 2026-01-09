# Admin Panel Troubleshooting

## Player Count Configuration

### Problem: Can't Specify Player Number in Admin Panel

**Explanation:**
The player count is **defined in the treatment**, not in the admin panel. When you create a batch, you select a treatment, and that treatment's `playerCount` determines how many players are needed.

### Solution: Modify Treatments

Edit `.empirica/treatments.yaml` to change player counts:

```yaml
treatments:
  # Solo testing (1 player)
  - name: "Solo-Test"
    desc: "Single player for testing"
    factors:
      playerCount: 1
      collaborationRounds: 2
      competitionRounds: 1
      # ... other factors

  # Small group (3 players)
  - name: "Small-Group"
    desc: "Three player game"
    factors:
      playerCount: 3
      collaborationRounds: 8
      competitionRounds: 4
      # ... other factors

  # Standard (4 players)
  - name: "Standard"
    desc: "Four player game"
    factors:
      playerCount: 4
      collaborationRounds: 8
      competitionRounds: 4
      # ... other factors
```

### Quick Testing Setup

For solo testing during development:

1. **Use the "Solo-Test" treatment** (already added to your treatments.yaml)
2. Create a batch with this treatment
3. You'll only need 1 player to start the game
4. Stages will advance immediately after you submit

### For Production

Use treatments with `playerCount: 4` for the actual study.

## Batch Deletion

### Problem: No Delete Button in Admin Panel

**Explanation:**
Some versions of Empirica don't have a visible "Delete" button in the admin UI. This is intentional to prevent accidental data loss.

### Solutions

#### Option 1: Clear All Data (Recommended for Testing)

```bash
# Stop Empirica (Ctrl+C)
rm -rf .empirica/local
empirica
```

**When to use:**
- During development/testing
- When you want a completely fresh start
- No important data to preserve

#### Option 2: Archive Completed Batches

In the admin panel:
1. Wait for batch to complete
2. Look for "Archive" option (may appear after completion)
3. Archived batches are hidden from main view

#### Option 3: Manual Database Edit

**⚠️ Advanced - Make backup first!**

```bash
# Backup the database
cp .empirica/local/tajriba.json .empirica/local/tajriba.backup.json

# Edit the file
# Open .empirica/local/tajriba.json in a text editor
# Find and remove the batch entries you want to delete
# Save and restart Empirica
```

#### Option 4: Stop Batch Early

If a batch is running:
1. Click on the batch in admin panel
2. Look for "Stop" or "End" button
3. This ends the batch but doesn't delete it

## Common Admin Panel Issues

### Issue: Batch Won't Start

**Causes:**
- Not enough players connected
- Lobby timeout expired
- Treatment misconfigured

**Solutions:**
1. Check player count matches treatment
2. Verify all player links are correct
3. Check lobby configuration in `.empirica/lobbies.yaml`
4. Look at server logs for errors

### Issue: Can't See Player Progress

**Causes:**
- Players not connected
- Browser console errors
- Network issues

**Solutions:**
1. Refresh admin panel
2. Check player browser console (F12)
3. Verify WebSocket connection
4. Check server logs

### Issue: Data Not Exporting

**Causes:**
- Batch not completed
- Browser blocking download
- Insufficient permissions

**Solutions:**
1. Wait for batch to complete
2. Try different browser
3. Check browser download settings
4. Verify file permissions

## Lobby Configuration

Edit `.empirica/lobbies.yaml` to control how games start:

```yaml
lobbies:
  # Shared lobby - all players wait together
  - name: "Shared Lobby"
    kind: shared
    duration: 10m
    strategy: fail  # fail if not enough players
    
  # Individual lobby - players start independently
  - name: "Individual"
    kind: individual
    duration: 5m
```

**Strategies:**
- `fail`: Cancel if not enough players
- `ignore`: Start anyway with fewer players
- `complete`: Wait until enough players join

## Treatment Configuration Tips

### For Development/Testing

```yaml
- name: "Quick-Test"
  factors:
    playerCount: 1          # Solo testing
    collaborationRounds: 2  # Fewer rounds
    competitionRounds: 1    # Quick completion
```

### For Production

```yaml
- name: "Full-Study"
  factors:
    playerCount: 4          # Full group
    collaborationRounds: 8  # Complete study
    competitionRounds: 4    # Full competition phase
```

## Monitoring Active Games

### Real-time Dashboard

The admin panel shows:
- **Connected players**: Green = connected, Gray = disconnected
- **Current stage**: What stage each player is on
- **Time remaining**: Stage timer countdown
- **Submissions**: Who has submitted decisions

### What to Watch For

1. **Disconnections**
   - Player turns gray
   - May need to reconnect
   - Game continues for others

2. **Stuck Players**
   - Player not advancing
   - Check their browser console
   - May need to refresh

3. **Stage Timeouts**
   - Stage advances automatically
   - Players who didn't submit get default values
   - Check server callbacks for defaults

## Best Practices

### Before Each Session

1. **Clear old data**
   ```bash
   rm -rf .empirica/local
   ```

2. **Restart Empirica**
   ```bash
   empirica
   ```

3. **Create fresh batch**
   - Select appropriate treatment
   - Generate new player links
   - Test one link before distributing

### During Session

1. **Monitor continuously**
   - Keep admin panel open
   - Watch for disconnections
   - Note any issues

2. **Don't interfere**
   - Let experiment run naturally
   - Only help with technical issues
   - Document any problems

3. **Backup data**
   ```bash
   cp .empirica/local/tajriba.json backups/session_$(date +%Y%m%d_%H%M%S).json
   ```

### After Session

1. **Export immediately**
   - Don't wait to export data
   - Export both CSV and JSON
   - Verify export is complete

2. **Archive batch**
   - Mark as completed
   - Move to archive folder
   - Keep raw data separate

3. **Clean up**
   - Clear test batches
   - Remove incomplete sessions
   - Prepare for next session

## Emergency Procedures

### Game Completely Stuck

```bash
# 1. Stop Empirica
Ctrl+C

# 2. Backup current data
cp .empirica/local/tajriba.json emergency_backup.json

# 3. Restart
empirica

# 4. Create new batch if needed
```

### Lost Player Connection

1. Player refreshes browser
2. Re-enters with same participant key
3. Should reconnect to same game
4. May need to wait for stage to advance

### Server Crash

1. Restart Empirica
2. Data is preserved in `.empirica/local/`
3. Players can reconnect
4. Game resumes from last saved state

## Getting Help

### Check Logs

```bash
# Server logs appear in terminal where you ran 'empirica'
# Look for ERROR or WARN messages
```

### Browser Console

```javascript
// In player browser, press F12
// Check Console tab for errors
// Look for WebSocket connection issues
```

### Common Error Messages

**"Failed to connect"**
- Check server is running
- Verify URL is correct
- Check firewall settings

**"Batch not found"**
- Batch may have been deleted
- Check participant key is correct
- Verify batch is active

**"Stage timeout"**
- Normal behavior
- Stage advances automatically
- Check stage duration in callbacks

## Configuration Files Reference

### `.empirica/treatments.yaml`
- Defines experimental conditions
- Sets player counts
- Configures round numbers

### `.empirica/lobbies.yaml`
- Controls waiting room behavior
- Sets timeout durations
- Defines start strategies

### `.empirica/empirica.toml`
- Server configuration
- Admin credentials
- Port settings

### `server/src/callbacks.js`
- Game logic
- Stage progression
- Payoff calculations
