# GitHub Repository Setup for Cybersec-Experiment

## ✅ What's Already Done

- ✅ Git repository initialized
- ✅ All files committed to local repository
- ✅ Dockerfile configured for AWS ECS
- ✅ GitHub Actions workflow ready for automatic Docker builds
- ✅ `.gitignore` and `.dockerignore` configured

---

## 🚀 Step 1: Create Private GitHub Repository

### Option A: Using GitHub Web Interface (Recommended)

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name**: `cybersec-experiment`
   - **Description**: `Empirica cybersecurity decision-making experiment for SkillLedger`
   - **Visibility**: ✅ **Private**
   - **Do NOT** initialize with README, .gitignore, or license (we already have these)
3. Click "Create repository"

### Option B: Using GitHub CLI (if installed)

```bash
cd /Users/katewang/Library/CloudStorage/Dropbox/Business_Ideas/A_SkillLedger/simulations/cybersec-experiment

gh repo create wangjuekate/cybersec-experiment \
  --private \
  --source=. \
  --remote=origin \
  --push
```

---

## 🚀 Step 2: Push Code to GitHub

After creating the repository on GitHub, run these commands:

```bash
cd /Users/katewang/Library/CloudStorage/Dropbox/Business_Ideas/A_SkillLedger/simulations/cybersec-experiment

# Add GitHub as remote
git remote add origin https://github.com/wangjuekate/cybersec-experiment.git

# Rename branch to main (if needed)
git branch -M main

# Push code
git push -u origin main
```

---

## 🐳 Step 3: Docker Image Build (Automatic)

Once you push to GitHub, the GitHub Actions workflow will automatically:

1. ✅ Build the Docker image
2. ✅ Push to GitHub Container Registry (GHCR)
3. ✅ Tag with `latest` and commit SHA
4. ✅ Make it available at: `ghcr.io/wangjuekate/cybersec-experiment:latest`

### Monitor the Build

1. Go to: https://github.com/wangjuekate/cybersec-experiment/actions
2. Watch the "Build and Push Docker Image to GHCR" workflow
3. Should complete in ~2-5 minutes

---

## 🧪 Step 4: Test Docker Build Locally (Optional)

Before pushing, you can test the Docker build locally:

```bash
cd /Users/katewang/Library/CloudStorage/Dropbox/Business_Ideas/A_SkillLedger/simulations/cybersec-experiment

# Build the image
docker build -t cybersec-experiment:test .

# Run locally
docker run -p 3000:3000 cybersec-experiment:test

# Test in browser
open http://localhost:3000
```

---

## 🔐 Step 5: Configure GitHub Container Registry Access

The Docker image will be private by default. To use it in AWS ECS:

### Make Package Public (Recommended for easier ECS access)

1. Go to: https://github.com/wangjuekate?tab=packages
2. Click on `cybersec-experiment`
3. Click "Package settings"
4. Scroll to "Danger Zone"
5. Click "Change visibility" → "Public"

### OR: Use GitHub Token for Private Access

If keeping private, you'll need to configure AWS ECS with GitHub credentials:

```bash
# Create a GitHub Personal Access Token
# Go to: https://github.com/settings/tokens
# Scopes needed: read:packages

# Store in AWS Secrets Manager or ECS task definition
```

---

## 🚢 Step 6: Use in AWS ECS

Once the Docker image is built, reference it in your ECS task definition:

```json
{
  "containerDefinitions": [
    {
      "name": "cybersec-experiment",
      "image": "ghcr.io/wangjuekate/cybersec-experiment:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ]
    }
  ]
}
```

---

## 📊 Repository Structure

```
cybersec-experiment/
├── .github/
│   └── workflows/
│       └── docker-build.yml      # Auto-builds Docker on push
├── client/                        # Frontend React app
├── server/                        # Empirica server
├── data_export/                   # Exported data
├── Dockerfile                     # Docker configuration
├── .dockerignore                  # Docker build exclusions
├── .gitignore                     # Git exclusions
├── package.json                   # Dependencies
└── README.md                      # Documentation
```

---

## 🔄 Updating the Image

Every time you push to the `main` branch:

1. GitHub Actions automatically rebuilds the Docker image
2. New image pushed to GHCR with `latest` tag
3. AWS ECS can pull the updated image
4. Redeploy ECS service to use new image

### Manual Update Workflow

```bash
# Make changes to code
git add .
git commit -m "Update: description of changes"
git push origin main

# GitHub Actions will automatically rebuild
# Wait 2-5 minutes for build to complete
# Redeploy ECS service to pull new image
```

---

## 💰 Cost Breakdown

- **GitHub Private Repo**: $4/month (part of GitHub Pro)
- **GHCR Storage**: Free for first 500 MB
- **GHCR Bandwidth**: Free for first 1 GB/month
- **GitHub Actions**: 2000 minutes/month free (each build ~2-3 minutes)

**Total**: ~$4/month for unlimited private repos + generous free tier

---

## 🐛 Troubleshooting

### Build Fails on GitHub Actions

Check the workflow logs:
```
https://github.com/wangjuekate/cybersec-experiment/actions
```

Common issues:
- Missing `package.json` → Ensure it's committed
- Build errors → Test locally first with `docker build`
- Permission errors → Check repository settings

### Can't Pull Image in AWS ECS

1. Verify image exists: https://github.com/wangjuekate?tab=packages
2. Check image visibility (public vs private)
3. If private, configure AWS with GitHub token
4. Verify image tag is correct: `ghcr.io/wangjuekate/cybersec-experiment:latest`

### Local Docker Build Fails

```bash
# Check Docker is running
docker --version

# Clean build cache
docker system prune -a

# Rebuild
docker build --no-cache -t cybersec-experiment:test .
```

---

## 📝 Next Steps

1. ✅ Create GitHub repository (see Step 1)
2. ✅ Push code (see Step 2)
3. ✅ Wait for Docker build to complete
4. ✅ Update AWS ECS task definition with new image URL
5. ✅ Deploy to ECS and test

---

## 🔗 Useful Links

- **Repository**: https://github.com/wangjuekate/cybersec-experiment
- **Packages**: https://github.com/wangjuekate?tab=packages
- **Actions**: https://github.com/wangjuekate/cybersec-experiment/actions
- **Docker Image**: `ghcr.io/wangjuekate/cybersec-experiment:latest`
