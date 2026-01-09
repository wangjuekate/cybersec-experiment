# Quick Start: Push to GitHub & Build Docker

## 🚀 Commands to Run Now

```bash
# Navigate to project
cd /Users/katewang/Library/CloudStorage/Dropbox/Business_Ideas/A_SkillLedger/simulations/cybersec-experiment

# 1. Create GitHub repo (go to https://github.com/new)
#    - Name: cybersec-experiment
#    - Visibility: Private
#    - Don't initialize with anything

# 2. Add remote and push
git remote add origin https://github.com/wangjuekate/cybersec-experiment.git
git branch -M main
git push -u origin main

# 3. GitHub Actions will automatically build Docker image
# Monitor at: https://github.com/wangjuekate/cybersec-experiment/actions
```

## 🐳 Docker Image Location

After GitHub Actions completes:
```
ghcr.io/wangjuekate/cybersec-experiment:latest
```

## 📦 Use in AWS ECS

Update your ECS task definition image to:
```
ghcr.io/wangjuekate/cybersec-experiment:latest
```

## 💰 Cost

- **$4/month** for GitHub private repos
- **Free** GHCR storage (500 MB) and bandwidth (1 GB/month)

---

See `GITHUB_SETUP.md` for detailed instructions.
