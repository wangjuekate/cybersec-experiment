FROM node:18

WORKDIR /app

# Install Empirica CLI
RUN apt-get update && apt-get install -y curl ca-certificates && \
    curl -fsS https://install.empirica.dev | sh && \
    rm -rf /var/lib/apt/lists/*

# Copy bundled experiment
COPY cybersec-experiment.tar.zst .

EXPOSE 3000

# Run empirica serve with defensive .empirica creation
CMD ["sh", "-c", "mkdir -p .empirica && empirica serve cybersec-experiment.tar.zst"]
