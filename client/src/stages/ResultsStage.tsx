import { usePlayer, useRound, usePlayers, useGame } from "@empirica/core/player/classic/react";
import React from "react";

export function ResultsStage() {
  const player = usePlayer();
  const round = useRound();
  const players = usePlayers();
  const game = useGame();
  
  const detectionAccuracy = (player.round.get("detectionAccuracy") as number) || 0;
  const payoff = (player.round.get("payoff") as number) || 0;
  const leakageIntensity = (player.round.get("leakageIntensity") as number) || 0;
  const sharedTelemetry = (round.get("sharedTelemetry") as any[]) || [];
  const governanceRegime = game.get("governanceRegime") as string;

  return (
    <div className="stage-container">
      <div className="stage-content">
        <div className="stage-header">
          <h1>Round Results</h1>
          <p>Review your firm's performance and the ecosystem's collective defense posture</p>
        </div>

        <div className="stage-body">
          <div className="results-grid">
            <div className="info-card success">
              <h3>Detection Accuracy</h3>
              <div className="progress-section">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${detectionAccuracy * 100}%` }}
                  />
                </div>
              </div>
              <div className="metric-large">
                {(detectionAccuracy * 100).toFixed(1)}%
              </div>
              <p>Your firm's ability to detect and prevent attacks</p>
            </div>

            <div className="info-card">
              <h3>Round Payoff</h3>
              <div className="metric-large">
                ${payoff.toFixed(2)}
              </div>
              <p>Net benefit from prevented attacks minus disclosure costs</p>
              <span className={`badge ${payoff > 0 ? 'badge-success' : 'badge-warning'}`}>
                {payoff > 0 ? 'Profit' : 'Loss'}
              </span>
            </div>
          </div>

          <div className="info-card warning">
            <h3>Knowledge Leakage Intensity</h3>
            <div className="progress-section">
              <div className="progress-header">
                <span>Asymmetric Benefit</span>
                <span className="progress-value">{(leakageIntensity * 100).toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${leakageIntensity * 100}%` }}
                />
              </div>
            </div>
            <p>Measures how much you benefited from others' sharing relative to your own contributions</p>
            <span className={`badge ${leakageIntensity > 0.7 ? 'badge-warning' : leakageIntensity > 0.3 ? 'badge-info' : 'badge-success'}`}>
              {leakageIntensity > 0.7 ? 'High Leakage' : leakageIntensity > 0.3 ? 'Moderate' : 'Low Leakage'}
            </span>
          </div>

          <div className="info-card">
            <h3>Ecosystem Intelligence Sharing</h3>
            <div className="telemetry-list">
              {sharedTelemetry.map((telemetry: any, idx: number) => (
                <div key={idx} className="telemetry-item">
                  <div className="telemetry-info">
                    <strong>
                      {governanceRegime === "anonymized" ? "Anonymous Firm" : `Firm ${telemetry.playerId.slice(-4)}`}
                    </strong>
                    <span className="telemetry-details">
                      {telemetry.amount} disclosure, {telemetry.resolution} resolution
                    </span>
                  </div>
                  <span className="telemetry-count">
                    {telemetry.signals.length} signals
                  </span>
                </div>
              ))}
              {sharedTelemetry.length === 0 && (
                <p className="no-data">No firms shared telemetry this round</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
