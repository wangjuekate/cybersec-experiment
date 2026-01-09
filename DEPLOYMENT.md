# Admin Panel Management

## Accessing the Admin Panel

Once Empirica is running, access the admin panel at:
- **URL**: http://localhost:3000/admin
- **Default credentials**: Set during first access

## Managing Batches

### Creating a New Batch
1. Go to http://localhost:3000/admin
2. Click "New Batch" or "Create Batch"
3. Configure:
   - Number of players per game
   - Treatment assignments
   - Lobby configuration
4. Click "Create" to generate player links

### Deleting/Archiving Batches

**Option 1: Through Admin Panel**
- Navigate to the batch list
- Click on the batch you want to remove
- Look for "Archive" or "Delete" button (if available in your Empirica version)
- Confirm the action

**Option 2: Clear All Data (Nuclear Option)**
```bash
# Stop the server first (Ctrl+C if running)
# Delete the local database to clear ALL batches and players
rm -rf .empirica/local
# Then restart Empirica
empirica
```

**Option 3: Selective Deletion**
- The `.empirica/local/tajriba.json` file contains all data
- You can manually edit this file to remove specific batches
- **Warning**: Make a backup first!

### Monitoring Active Games
- View real-time player connections
- Monitor game progress
- See which stages players are on
- Export data when games complete





# Deployment Guide

## Local Testing

### Prerequisites

- Node.js 16+ and npm
- Empirica CLI installed

### Installation

```bash
# Install Empirica CLI (if not already installed)
curl -fsS https://install.empirica.dev | sh

# Navigate to experiment directory
cd cybersecurity-experiment

# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev
```

Access:
- **Admin Panel**: http://localhost:3000/admin
- **Player Interface**: http://localhost:3000

## Production Deployment

### Option 1: Empirica Cloud (Recommended)

1. Create account at https://empirica.ly
2. Install Empirica CLI and login:
   ```bash
   empirica login
   ```

3. Deploy:
   ```bash
   empirica deploy
   ```

4. Follow prompts to configure deployment

### Option 2: Self-Hosted (Docker)

1. Build Docker image:
   ```bash
   docker build -t cybersec-experiment .
   ```

2. Run container:
   ```bash
   docker run -p 3000:3000 cybersec-experiment
   ```

### Option 3: Cloud Platform (Heroku, AWS, etc.)

Requirements:
- Node.js buildpack
- MongoDB database
- Environment variables configured

## Environment Variables

Create `.env` file:

```
MONGO_URL=mongodb://localhost:27017/empirica
PORT=3000
```

## Data Management

### Exporting Data

From admin panel:
1. Navigate to "Data" tab
2. Select completed games
3. Click "Export" for CSV or JSON format

### Backup Strategy

- Regular MongoDB backups
- Export data after each session
- Store raw data separately from analysis files

## Scaling Considerations

### Concurrent Sessions

- Each game = 4 players
- Server can handle ~10 concurrent games (40 players)
- For larger studies, use load balancing

### Database

- MongoDB recommended for production
- Index on player ID and game ID for performance
- Regular cleanup of test data

## Monitoring

### Health Checks

Monitor:
- Server uptime
- Database connections
- Player connection status
- Error logs

### Analytics

Track:
- Completion rates
- Average session duration
- Drop-off points
- Technical issues

## Troubleshooting

### Common Issues

1. **Players can't connect**
   - Check firewall settings
   - Verify WebSocket support
   - Test with different browsers

2. **Slow performance**
   - Check database indexes
   - Monitor server resources
   - Reduce concurrent games

3. **Data not saving**
   - Verify MongoDB connection
   - Check write permissions
   - Review error logs

## Security

### Best Practices

- Use HTTPS in production
- Implement rate limiting
- Sanitize user inputs
- Regular security updates
- Backup encryption

### Participant Privacy

- Anonymize exported data
- Secure storage of consent forms
- GDPR/IRB compliance
- Data retention policies
