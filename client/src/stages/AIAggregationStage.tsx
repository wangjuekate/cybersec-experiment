import { useRound, useGame } from "@empirica/core/player/classic/react";
import React from "react";

export function AIAggregationStage() {
  const round = useRound();
  const game = useGame();
  
  const sharedTelemetry = (round.get("sharedTelemetry") as any[]) || [];
  const aiAccuracy = (round.get("aiModelAccuracy") as number) || 0;
  const aggregationType = (game.get("aggregationType") as string) || "ai";
  
  const isNonprofit = aggregationType === "nonprofit";

  return (
    <div className="stage-container">
      <div className="stage-content">
        <div className="stage-header">
          <h1>{isNonprofit ? "Nonprofit Organization Processing" : "AI Model Training"}</h1>
          <p>
            {isNonprofit 
              ? "The Cybersecurity Information Sharing Organization (CISO) is aggregating shared intelligence to help protect all member firms..."
              : "The system is aggregating shared telemetry and training the collective threat detection model..."}
          </p>
        </div>

        <div className="stage-body">
          <div className="info-card">
            <h3>{isNonprofit ? "Shared Intelligence Pool" : "Pooled Intelligence"}</h3>
            <div className="metric-large">
              {sharedTelemetry.length} contributions
            </div>
            <p>
              {isNonprofit
                ? "Firms have contributed threat intelligence to the nonprofit organization for collective benefit"
                : "Firms have shared threat intelligence for collective defense"}
            </p>
          </div>

          <div className="info-card">
            <h3>{isNonprofit ? "Collective Defense Capability" : "AI Detection Accuracy"}</h3>
            <div className="progress-section">
              <div className="progress-header">
                <span>{isNonprofit ? "Protection Level" : "Model Performance"}</span>
                <span className="progress-value">{(aiAccuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${aiAccuracy * 100}%` }}
                />
              </div>
            </div>
            <p>
              {isNonprofit
                ? "The nonprofit organization is analyzing shared intelligence to provide threat insights that benefit all participating firms"
                : "The AI model is learning from shared telemetry to improve threat detection across the ecosystem"}
            </p>
          </div>

          <div className="loading-indicator">
            <div className="spinner" />
          </div>
        </div>
      </div>
    </div>
  );
}
