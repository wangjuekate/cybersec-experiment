FROM node:18

WORKDIR /app

# Install Empirica CLI
RUN apt-get update && apt-get install -y curl ca-certificates && \
    curl -fsS https://install.empirica.dev | sh && \
    rm -rf /var/lib/apt/lists/*

# Copy bundled experiment
COPY cybersec-experiment.tar.zst .

EXPOSE 3000

# Run empirica serve with admin user creation (password must be 8+ chars)
CMD ["sh", "-c", "mkdir -p .empirica && empirica serve cybersec-experiment.tar.zst --tajriba.auth.username=admin --tajriba.auth.password=admin123 --tajriba.auth.name='Admin User'"]
