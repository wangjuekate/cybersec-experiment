import { ClassicListenersCollector } from "@empirica/core/admin/classic";
const Empirica = new ClassicListenersCollector();

Empirica.onGameStart(({ game }) => {
  const { playerCount, collaborationRounds, competitionRounds, governanceRegime, absorptiveCapacity, threatVolatility } = game.get("treatment");
  
  game.set("governanceRegime", governanceRegime);
  game.set("absorptiveCapacity", absorptiveCapacity);
  game.set("threatVolatility", threatVolatility);
  game.set("phase", "collaboration");
  game.set("chatHistory", []);
  
  const players = game.players;
  players.forEach(player => {
    const threatPortfolio = generateThreatPortfolio();
    player.set("threatPortfolio", threatPortfolio);
    player.set("learnedSignals", []);
    player.set("absorptiveCapacity", absorptiveCapacity);
    player.set("baselineDetection", 0.6);
    player.set("totalPayoff", 0);
    player.set("leakageHistory", []);
  });
  
  // Add training round first
  const trainingRound = game.addRound({
    name: "Training Round",
    task: "training"
  });
  trainingRound.addStage({ name: "training", duration: 600 }); // 10 minutes for training
  
  const totalRounds = collaborationRounds + competitionRounds;
  
  for (let i = 0; i < totalRounds; i++) {
    const round = game.addRound({
      name: `Round ${i + 1}`,
      task: i < collaborationRounds ? "collaboration" : "competition"
    });
    
    if (i < collaborationRounds) {
      round.addStage({ name: "disclosure", duration: 120 });
      round.addStage({ name: "aiAggregation", duration: 30 });
      round.addStage({ name: "results", duration: 60 });
    } else {
      round.addStage({ name: "competition", duration: 120 });
      round.addStage({ name: "competitionResults", duration: 60 });
    }
  }
});

Empirica.onRoundStart(({ round }) => {
  const game = round.currentGame;
  const roundIndex = round.get("index");
  const collaborationRounds = game.get("treatment").collaborationRounds;
  
  if (roundIndex < collaborationRounds) {
    game.set("phase", "collaboration");
  } else {
    game.set("phase", "competition");
  }
  
  round.set("sharedTelemetry", []);
  round.set("aiModelAccuracy", 0);
});

Empirica.onStageStart(({ stage }) => {
  if (stage.get("name") === "aiAggregation") {
    const round = stage.round;
    const game = round.currentGame;
    const sharedTelemetry = round.get("sharedTelemetry") || [];
    const threatVolatility = game.get("threatVolatility");
    
    const baseAccuracy = 0.5;
    const telemetryBonus = sharedTelemetry.length * 0.05;
    const volatilityPenalty = threatVolatility === "volatile" ? 0.1 : 0;
    
    const aiAccuracy = Math.min(0.95, baseAccuracy + telemetryBonus - volatilityPenalty);
    round.set("aiModelAccuracy", aiAccuracy);
  }
});

Empirica.onStageEnded(({ stage }) => {
  const round = stage.round;
  const game = round.currentGame;
  
  if (stage.get("name") === "disclosure") {
    const players = game.players;
    const sharedTelemetry = [];
    
    players.forEach(player => {
      const disclosure = player.round.get("disclosureDecision");
      if (disclosure && disclosure.amount !== "none") {
        sharedTelemetry.push({
          playerId: game.get("governanceRegime") === "anonymized" ? "anonymous" : player.id,
          amount: disclosure.amount,
          resolution: disclosure.resolution,
          signals: disclosure.signals
        });
      }
    });
    
    round.set("sharedTelemetry", sharedTelemetry);
  }
  
  if (stage.get("name") === "aiAggregation") {
    const players = game.players;
    const aiAccuracy = round.get("aiModelAccuracy");
    const sharedTelemetry = round.get("sharedTelemetry");
    
    players.forEach(player => {
      const baseDetection = player.get("baselineDetection") || 0.6;
      const absorptiveCapacity = player.get("absorptiveCapacity");
      const learningRate = absorptiveCapacity === "high" ? 0.8 : 0.4;
      
      const detectionImprovement = (aiAccuracy - baseDetection) * learningRate;
      const newDetection = Math.min(0.95, baseDetection + detectionImprovement);
      
      player.round.set("detectionAccuracy", newDetection);
      
      const attackExposure = Math.random() * 100;
      const attacksPrevented = attackExposure * newDetection;
      const shortTermPayoff = attacksPrevented * 10;
      
      const disclosure = player.round.get("disclosureDecision");
      const disclosureCost = disclosure && disclosure.amount !== "none" ? 
        (disclosure.amount === "full" ? 50 : 25) : 0;
      
      const netPayoff = shortTermPayoff - disclosureCost;
      player.round.set("payoff", netPayoff);
      
      const currentTotal = player.get("totalPayoff") || 0;
      player.set("totalPayoff", currentTotal + netPayoff);
      
      const leakageIntensity = calculateLeakageIntensity(player, sharedTelemetry, disclosure);
      player.round.set("leakageIntensity", leakageIntensity);
    });
  }
  
  if (stage.get("name") === "competition") {
    const players = game.players;
    const governanceRegime = game.get("governanceRegime");
    
    players.forEach(player => {
      const competitionStrategy = player.round.get("competitionStrategy");
      const learnedSignals = player.get("learnedSignals") || [];
      const ownSignals = player.get("threatPortfolio") || [];
      
      const totalSignals = [...ownSignals, ...learnedSignals];
      const uniqueSignals = [...new Set(totalSignals)];
      
      const competitiveAdvantage = uniqueSignals.length * 5;
      const baseScore = Math.random() * 100;
      const competitionScore = baseScore + competitiveAdvantage;
      
      let reputationPenalty = 0;
      if (governanceRegime === "auditable") {
        const leakageHistory = player.get("leakageHistory") || [];
        const avgLeakage = leakageHistory.reduce((a, b) => a + b, 0) / (leakageHistory.length || 1);
        reputationPenalty = avgLeakage * 20;
      }
      
      const finalScore = competitionScore - reputationPenalty;
      player.round.set("competitionScore", finalScore);
      
      const contractValue = 200;
      const competitionPayoff = (finalScore / 100) * contractValue;
      player.round.set("payoff", competitionPayoff);
      
      const currentTotal = player.get("totalPayoff") || 0;
      player.set("totalPayoff", currentTotal + competitionPayoff);
    });
  }
});

Empirica.onRoundEnded(({ round }) => {
  const game = round.currentGame;
  const players = game.players;
  
  players.forEach(player => {
    const leakageIntensity = player.round.get("leakageIntensity") || 0;
    const leakageHistory = player.get("leakageHistory") || [];
    leakageHistory.push(leakageIntensity);
    player.set("leakageHistory", leakageHistory);
  });
});

Empirica.onGameEnded(({ game }) => {
  const players = game.players;
  
  players.forEach(player => {
    const totalPayoff = player.get("totalPayoff") || 0;
    player.set("finalPayoff", totalPayoff);
    
    const leakageHistory = player.get("leakageHistory") || [];
    const avgLeakage = leakageHistory.reduce((a, b) => a + b, 0) / (leakageHistory.length || 1);
    player.set("averageLeakageIntensity", avgLeakage);
  });
});

function generateThreatPortfolio() {
  const numSignatures = Math.floor(Math.random() * 5) + 5;
  const signatures = [];
  for (let i = 0; i < numSignatures; i++) {
    signatures.push(`THREAT-${Math.random().toString(36).substring(7).toUpperCase()}`);
  }
  return signatures;
}

function calculateLeakageIntensity(player, sharedTelemetry, ownDisclosure) {
  const ownSharing = ownDisclosure && ownDisclosure.amount !== "none" ? 1 : 0;
  
  const othersSharing = sharedTelemetry.filter(t => t.playerId !== player.id).length;
  
  if (othersSharing === 0) return 0;
  
  const leakageIntensity = (othersSharing - ownSharing) / othersSharing;
  return Math.max(0, leakageIntensity);
}

export { Empirica };
