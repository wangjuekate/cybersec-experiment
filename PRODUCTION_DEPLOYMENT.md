# Production Deployment Guide

## Overview

This guide shows how to deploy your Empirica experiment so participants can access it via an external link (e.g., `https://yourstudy.com`).

## Recommended Approach: Cloud Server + Domain

**Best for:** External participant access, professional research studies

**What you get:**
- Public URL participants can access from anywhere
- HTTPS encryption for secure connections
- Full control over experiment timing and data
- Professional appearance for IRB/institutional approval

---

## Deployment Options Comparison

### Option 1: DigitalOcean Droplet (Recommended) ⭐

**Cost:** ~$6-12/month  
**Difficulty:** Moderate  
**Best for:** Most research studies

**Pros:**
- Simple setup with Ubuntu tutorial
- Predictable monthly cost
- Easy to scale if needed
- Good documentation

**Cons:**
- Requires basic Linux knowledge
- Need to manage server yourself

### Option 2: AWS EC2 / Google Cloud

**Cost:** Variable (pay-as-you-go)  
**Difficulty:** Moderate-Hard  
**Best for:** Large-scale studies, institutional deployments

**Pros:**
- Highly scalable
- Many advanced features
- Free tier available (limited)

**Cons:**
- More complex setup
- Costs can be unpredictable
- Steeper learning curve

### Option 3: Heroku / Railway / Render

**Cost:** $5-25/month  
**Difficulty:** Easy  
**Best for:** Quick deployments, small studies

**Pros:**
- Very easy deployment
- Automatic HTTPS
- Simple web interface

**Cons:**
- Less control
- May have limitations
- Can be more expensive at scale

---

## Step-by-Step: DigitalOcean Deployment

### Prerequisites

- Domain name (e.g., from Google Domains, Namecheap) - ~$12/year
- DigitalOcean account
- Basic terminal/SSH knowledge

### Step 1: Create a Droplet

1. **Sign up at DigitalOcean**: https://www.digitalocean.com
2. **Create a Droplet**:
   - Choose **Ubuntu 22.04 LTS**
   - Select **Basic plan** ($6/month is sufficient for small studies)
   - Choose a datacenter region close to your participants
   - Add SSH key (recommended) or use password
   - Click **Create Droplet**

3. **Note your Droplet's IP address** (e.g., `123.45.67.89`)

### Step 2: Configure Your Domain

1. **Buy a domain** (if you don't have one):
   - Google Domains: https://domains.google.com
   - Namecheap: https://www.namecheap.com
   - Cloudflare: https://www.cloudflare.com/products/registrar/

2. **Point domain to your server**:
   - Go to your domain's DNS settings
   - Add an **A Record**:
     - Name: `@` (or your subdomain like `study`)
     - Value: Your Droplet's IP address
     - TTL: Automatic or 3600
   - Wait 5-60 minutes for DNS propagation

### Step 3: Bundle Your Experiment

On your local machine:

```bash
# Navigate to your experiment directory
cd cybersec-experiment

# Create the bundle
empirica bundle
```

This creates a file like `cybersec-experiment.tar.zst`

### Step 4: Set Up the Server

**Connect to your server:**

```bash
ssh root@YOUR_DROPLET_IP
```

**Install Empirica:**

```bash
curl https://install.empirica.dev | sh -s
```

**Install Caddy (for HTTPS):**

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### Step 5: Upload Your Experiment

From your local machine:

```bash
scp cybersec-experiment.tar.zst root@YOUR_DROPLET_IP:~
```

### Step 6: Run Your Experiment

On the server:

```bash
# Run Empirica in the background
nohup empirica serve cybersec-experiment.tar.zst > empirica.log 2>&1 &

# Set up HTTPS with Caddy (replace with your domain)
caddy reverse-proxy --from yourdomain.com --to localhost:3000
```

**Alternative: Use systemd for auto-restart**

Create `/etc/systemd/system/empirica.service`:

```ini
[Unit]
Description=Empirica Experiment
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root
ExecStart=/root/.empirica/empirica serve /root/cybersec-experiment.tar.zst
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl enable empirica
sudo systemctl start empirica
sudo systemctl status empirica
```

### Step 7: Access Your Experiment

**Admin Panel:** `https://yourdomain.com/admin`  
**Player Links:** Create batches in admin panel, share generated links

---

## Quick Deployment: Heroku Alternative

For easier deployment without server management:

### Using Railway.app

1. **Sign up at Railway**: https://railway.app
2. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

3. **Deploy**:
   ```bash
   railway login
   railway init
   railway up
   ```

4. **Add domain** in Railway dashboard

**Note:** Empirica's embedded database may have limitations on some PaaS platforms. Test thoroughly.

---

## Sharing Your Experiment

### For Participants

1. **Create a batch** in admin panel
2. **Copy player links** (e.g., `https://yourdomain.com?participantKey=abc123`)
3. **Distribute links** via:
   - Email
   - Qualtrics redirect
   - Prolific/MTurk
   - QR codes for in-person studies

### For Other Researchers (Replication)

**Option 1: GitHub + Documentation**

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/cybersec-experiment.git
   git push -u origin main
   ```

2. **Add README** with deployment instructions
3. **Share repository link**

**Option 2: One-Click Deploy Button**

Create a "Deploy to Railway" button in your README:

```markdown
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/yourusername/cybersec-experiment)
```

**Option 3: Docker Image**

Create `Dockerfile`:

```dockerfile
FROM node:18

# Install Empirica
RUN curl https://install.empirica.dev | sh -s

# Copy experiment bundle
COPY cybersec-experiment.tar.zst /app/

# Expose port
EXPOSE 3000

# Run experiment
CMD ["empirica", "serve", "/app/cybersec-experiment.tar.zst"]
```

Build and share:

```bash
docker build -t yourusername/cybersec-experiment .
docker push yourusername/cybersec-experiment
```

Others can run:

```bash
docker run -p 3000:3000 yourusername/cybersec-experiment
```

---

## Cost Breakdown

### Minimal Setup
- **Domain**: $12/year
- **DigitalOcean Droplet**: $6/month
- **Total**: ~$84/year

### Professional Setup
- **Domain**: $12/year
- **DigitalOcean Droplet**: $12/month (better performance)
- **Backups**: $1.20/month
- **Total**: ~$170/year

### Large-Scale Study
- **Domain**: $12/year
- **DigitalOcean Droplet**: $24-48/month (more resources)
- **Load Balancer**: $12/month (if needed)
- **Total**: ~$300-600/year

---

## Security Checklist

Before going live:

- [ ] HTTPS enabled (via Caddy or similar)
- [ ] Firewall configured (only ports 22, 80, 443 open)
- [ ] SSH key authentication (disable password login)
- [ ] Regular backups of `.empirica/local/tajriba.json`
- [ ] Admin panel password changed from default
- [ ] Server updates installed: `sudo apt update && sudo apt upgrade`
- [ ] Monitoring set up (optional: UptimeRobot, Pingdom)

---

## Monitoring & Maintenance

### Check Server Status

```bash
# SSH into server
ssh root@YOUR_DROPLET_IP

# Check if Empirica is running
ps aux | grep empirica

# View logs
tail -f empirica.log

# Check disk space
df -h
```

### Backup Data

```bash
# On server
cp .empirica/local/tajriba.json backups/backup_$(date +%Y%m%d_%H%M%S).json

# Download to local machine
scp root@YOUR_DROPLET_IP:~/.empirica/local/tajriba.json ./data_backups/
```

### Update Experiment

```bash
# 1. Bundle new version locally
empirica bundle

# 2. Upload to server
scp cybersec-experiment.tar.zst root@YOUR_DROPLET_IP:~

# 3. Stop old version
ssh root@YOUR_DROPLET_IP
pkill empirica

# 4. Start new version
nohup empirica serve cybersec-experiment.tar.zst > empirica.log 2>&1 &
```

---

## Troubleshooting

### Participants can't access the site

**Check:**
- DNS propagation (use https://dnschecker.org)
- Firewall allows port 80 and 443
- Caddy is running: `ps aux | grep caddy`
- Empirica is running: `ps aux | grep empirica`

**Fix:**
```bash
# Restart Caddy
sudo systemctl restart caddy

# Restart Empirica
pkill empirica
nohup empirica serve cybersec-experiment.tar.zst > empirica.log 2>&1 &
```

### Site shows "Connection not secure"

**Cause:** HTTPS not properly configured

**Fix:**
```bash
# Stop Caddy
sudo systemctl stop caddy

# Run Caddy with your domain
caddy reverse-proxy --from yourdomain.com --to localhost:3000
```

### Server running slow

**Check resources:**
```bash
htop  # Install with: sudo apt install htop
```

**Upgrade Droplet:**
- Go to DigitalOcean dashboard
- Resize Droplet to larger plan
- Restart server

### Data loss

**Prevention:**
- Set up automatic backups in DigitalOcean
- Regular manual backups of `tajriba.json`
- Version control for experiment code

---

## Best Practices

### Before Launch

1. **Test with pilot participants**
   - Run full experiment with 3-5 test users
   - Check all stages work correctly
   - Verify data is being saved

2. **Load testing**
   - Test with maximum expected concurrent users
   - Use multiple browser windows to simulate players

3. **Backup plan**
   - Have local version ready as backup
   - Document rollback procedure
   - Keep participant contact info for rescheduling

### During Study

1. **Monitor continuously**
   - Check admin panel regularly
   - Watch for disconnections
   - Monitor server resources

2. **Backup frequently**
   - Export data after each session
   - Keep multiple backup copies
   - Store in different locations

3. **Communication**
   - Have support email/contact ready
   - Respond quickly to participant issues
   - Document any problems

### After Study

1. **Export all data immediately**
   ```bash
   python extract_data.py
   ```

2. **Keep server running** for 1-2 weeks (in case of data issues)

3. **Archive everything**
   - Code repository
   - Experiment bundle
   - Raw data files
   - Exported CSVs
   - Server logs

---

## Example: Complete Deployment Script

Save as `deploy.sh`:

```bash
#!/bin/bash

# Configuration
DOMAIN="yourstudy.com"
DROPLET_IP="123.45.67.89"
EXPERIMENT_NAME="cybersec-experiment"

echo "🚀 Deploying Empirica Experiment"

# 1. Bundle experiment
echo "📦 Bundling experiment..."
empirica bundle

# 2. Upload to server
echo "⬆️  Uploading to server..."
scp ${EXPERIMENT_NAME}.tar.zst root@${DROPLET_IP}:~

# 3. Set up server
echo "🔧 Setting up server..."
ssh root@${DROPLET_IP} << 'EOF'
  # Stop old version
  pkill empirica || true
  
  # Start new version
  nohup empirica serve ~/cybersec-experiment.tar.zst > empirica.log 2>&1 &
  
  # Wait for startup
  sleep 5
  
  # Check if running
  if ps aux | grep -v grep | grep empirica > /dev/null; then
    echo "✅ Empirica is running"
  else
    echo "❌ Empirica failed to start"
    exit 1
  fi
EOF

echo "✅ Deployment complete!"
echo "🌐 Admin panel: https://${DOMAIN}/admin"
echo "📊 Monitor logs: ssh root@${DROPLET_IP} 'tail -f empirica.log'"
```

Make executable and run:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Resources

- **Empirica Docs**: https://docs.empirica.ly
- **DigitalOcean Tutorial**: https://docs.empirica.ly/guides/deploying-my-experiment/ubuntu-tutorial
- **Caddy Docs**: https://caddyserver.com/docs/
- **SSH Guide**: https://www.digitalocean.com/community/tutorials/ssh-essentials-working-with-ssh-servers-clients-and-keys

## Support

For deployment issues:
- Empirica Discord: https://empirica.ly/discord
- DigitalOcean Community: https://www.digitalocean.com/community
- Stack Overflow: Tag `empirica`
