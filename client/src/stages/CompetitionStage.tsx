import { usePlayer, useGame, useStage } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import React, { useState } from "react";

export function CompetitionStage() {
  const player = usePlayer();
  const game = useGame();
  const stage = useStage();
  
  const [strategy, setStrategy] = useState("balanced");
  const [submitted, setSubmitted] = useState(false);

  const learnedSignals = (player.get("learnedSignals") as string[]) || [];
  const ownSignals = (player.get("threatPortfolio") as string[]) || [];
  const totalSignals = [...ownSignals, ...learnedSignals];
  const uniqueSignals = [...new Set(totalSignals)];

  const handleSubmit = () => {
    player.round.set("competitionStrategy", strategy as any);
    player.stage.set("submit", true as any);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="stage-container">
        <div className="stage-content">
          <div className="success-message">
            <h2>Strategy Submitted</h2>
            <p>Competing for security contracts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stage-container">
      <div className="stage-content">
        <div className="stage-header">
          <h1>Competition Phase</h1>
          <p>Firms now compete independently for scarce security contracts. Your knowledge base determines your competitive advantage.</p>
        </div>

        <div className="stage-body">
          <div className="info-card alert">
            <h3>⚠️ Competition Mode Active</h3>
            <p>The collaboration phase has ended. Firms are now competing for limited security contracts based on their threat intelligence capabilities.</p>
          </div>

          <div className="results-grid">
            <div className="info-card">
              <h3>Your Threat Signatures</h3>
              <div className="metric-large">
                {ownSignals.length}
              </div>
              <p>Original attack signatures from your private portfolio</p>
            </div>

            <div className="info-card">
              <h3>Learned Signatures</h3>
              <div className="metric-large">
                {learnedSignals.length}
              </div>
              <p>Signatures learned from ecosystem sharing</p>
            </div>
          </div>

          <div className="info-card highlight">
            <h3>Total Knowledge Base</h3>
            <div className="metric-large">
              {uniqueSignals.length} unique signatures
            </div>
            <div className="badge-list">
              {uniqueSignals.slice(0, 20).map((signature, idx) => (
                <span key={idx} className="badge">
                  {signature}
                </span>
              ))}
              {uniqueSignals.length > 20 && (
                <span className="badge">+{uniqueSignals.length - 20} more</span>
              )}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">
              <strong>Competition Strategy</strong>
            </label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="strategy"
                  value="aggressive"
                  checked={strategy === "aggressive"}
                  onChange={(e) => setStrategy(e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Aggressive</div>
                  <div className="radio-description">Maximize use of all available intelligence</div>
                </div>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="strategy"
                  value="balanced"
                  checked={strategy === "balanced"}
                  onChange={(e) => setStrategy(e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Balanced</div>
                  <div className="radio-description">Moderate approach balancing risk and reward</div>
                </div>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="strategy"
                  value="conservative"
                  checked={strategy === "conservative"}
                  onChange={(e) => setStrategy(e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Conservative</div>
                  <div className="radio-description">Focus on proven capabilities</div>
                </div>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <Button onClick={handleSubmit} primary>
              Submit Competition Strategy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
