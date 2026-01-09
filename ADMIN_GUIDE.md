# Admin Panel Guide

## Quick Start

1. **Start Empirica**
   ```bash
   empirica
   ```

2. **Access Admin Panel**
   - URL: http://localhost:3000/admin
   - Set up admin credentials on first access

## Batch Management

### Creating a Batch

1. Click **"New Batch"** or **"Create Batch"**
2. Configure batch settings:
   - **Players per game**: 3-5 (recommended for cybersecurity experiment)
   - **Treatments**: Select from configured treatments
   - **Lobby**: Configure waiting room settings

3. **Treatment Configuration**
   - Located in `.empirica/treatments.yaml`
   - Define different experimental conditions:
     - Governance regimes (open, anonymized, restricted, auditable)
     - AI accuracy levels
     - Competition intensity

4. Click **"Create"** to generate the batch

5. **Get Player Links**
   - Each player gets a unique link
   - Format: `http://localhost:3000?participantKey=abc123`
   - Share these links with participants

### Monitoring Games

**Real-time Dashboard**
- View active games
- See player connections
- Monitor stage progress
- Track completion rates

**Player Status**
- Connected/Disconnected
- Current stage
- Time spent
- Decisions made

### Managing Batches

#### Stopping a Batch
- Click on the batch
- Look for "Stop" or "End" button
- Confirm to end all active games in that batch

#### Archiving Completed Batches
- Completed batches can be archived
- This removes them from the active list
- Data is preserved for export

#### Deleting Batches

**Method 1: Admin Panel (if available)**
- Select the batch
- Click "Delete" or "Archive"
- Confirm the action

**Method 2: Clear All Data**
```bash
# Stop Empirica server (Ctrl+C)
rm -rf .empirica/local
empirica
```

**Method 3: Manual Database Edit**
```bash
# Backup first!
cp .empirica/local/tajriba.json .empirica/local/tajriba.backup.json

# Edit the file to remove specific batches
# Open .empirica/local/tajriba.json in a text editor
# Find and remove the batch entries you want to delete
# Save and restart Empirica
```

## Data Export

### Exporting Game Data

1. Navigate to **"Data"** or **"Export"** section
2. Select completed games
3. Choose export format:
   - **CSV**: For statistical analysis
   - **JSON**: For detailed data structure

4. Click **"Export"** to download

### Data Structure

Exported data includes:
- Player decisions (disclosure amounts, competition strategies)
- Round outcomes (payoffs, detection accuracy)
- Timestamps for all actions
- Treatment assignments
- Player identifiers (anonymized)

## Troubleshooting

### Players Can't Connect

**Check:**
1. Server is running (`empirica` command)
2. Correct URL with participant key
3. Firewall/network settings
4. Browser console for errors

**Solution:**
- Verify player links are correct
- Test with different browser
- Check server logs for errors

### Batch Won't Start

**Common Issues:**
1. Not enough players connected
2. Lobby configuration incorrect
3. Treatment not properly configured

**Solution:**
- Check minimum player requirements
- Verify lobby settings in `.empirica/lobbies.yaml`
- Review treatment configuration

### Data Not Saving

**Check:**
1. Database file permissions
2. Disk space available
3. Server logs for errors

**Solution:**
```bash
# Check database file
ls -la .empirica/local/tajriba.json

# Check server logs
# Look for error messages in terminal
```

### Game Stuck on Stage

**Possible Causes:**
1. Player disconnected
2. Stage timer not configured
3. Callback error in server code

**Solution:**
- Check player connections
- Review stage configuration
- Check server logs for callback errors
- May need to end batch and restart

## Best Practices

### Before Running Study

1. **Test Thoroughly**
   - Run through entire experiment
   - Test with multiple browsers
   - Verify all stages work correctly
   - Check data export format

2. **Prepare Participant Links**
   - Generate all links in advance
   - Label them clearly (P1, P2, etc.)
   - Have backup links ready

3. **Monitor Actively**
   - Keep admin panel open
   - Watch for disconnections
   - Be ready to help participants

### During Study

1. **Stay Available**
   - Monitor player progress
   - Respond to technical issues
   - Take notes on any problems

2. **Don't Interfere**
   - Let the experiment run naturally
   - Only intervene for technical issues
   - Document any interventions

3. **Backup Data Regularly**
   ```bash
   # While server is running, backup the database
   cp .empirica/local/tajriba.json backups/tajriba_$(date +%Y%m%d_%H%M%S).json
   ```

### After Study

1. **Export Data Immediately**
   - Don't wait to export
   - Export in multiple formats
   - Verify export is complete

2. **Backup Everything**
   ```bash
   # Create complete backup
   tar -czf experiment_backup_$(date +%Y%m%d).tar.gz .empirica/local/
   ```

3. **Clean Up**
   - Archive completed batches
   - Clear test data
   - Document any issues

## Configuration Files

### `.empirica/treatments.yaml`

Define experimental conditions:

```yaml
treatments:
  - name: "Open Governance"
    governanceRegime: "open"
    aiAccuracy: 0.7
    
  - name: "Anonymized Governance"
    governanceRegime: "anonymized"
    aiAccuracy: 0.7
    
  - name: "Restricted Governance"
    governanceRegime: "restricted"
    aiAccuracy: 0.7
```

### `.empirica/lobbies.yaml`

Configure waiting room:

```yaml
lobbies:
  - name: "Main Lobby"
    kind: "shared"
    strategy: "complete"
    timeoutType: "lobby"
    timeoutDuration: "10m"
```

## Security

### Admin Access

- Set strong admin password
- Don't share admin credentials
- Use HTTPS in production
- Limit admin panel access

### Participant Privacy

- Use anonymized participant keys
- Don't collect unnecessary personal data
- Secure data storage
- Follow IRB/GDPR requirements

### Data Protection

- Regular backups
- Encrypted storage (production)
- Access controls
- Audit logs

## Support

### Getting Help

1. **Empirica Documentation**: https://docs.empirica.ly
2. **GitHub Issues**: https://github.com/empiricaly/empirica
3. **Community Forum**: https://github.com/empiricaly/empirica/discussions

### Reporting Issues

Include:
- Empirica version
- Error messages
- Steps to reproduce
- Server logs
- Browser console logs
