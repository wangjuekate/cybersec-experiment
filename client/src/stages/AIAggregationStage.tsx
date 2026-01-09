import { useRound } from "@empirica/core/player/classic/react";
import React from "react";

export function AIAggregationStage() {
  const round = useRound();
  
  const sharedTelemetry = (round.get("sharedTelemetry") as any[]) || [];
  const aiAccuracy = (round.get("aiModelAccuracy") as number) || 0;

  return (
    <div className="stage-container">
      <div className="stage-content">
        <div className="stage-header">
          <h1>AI Model Training</h1>
          <p>The system is aggregating shared telemetry and training the collective threat detection model...</p>
        </div>

        <div className="stage-body">
          <div className="info-card">
            <h3>Pooled Intelligence</h3>
            <div className="metric-large">
              {sharedTelemetry.length} contributions
            </div>
            <p>Firms have shared threat intelligence for collective defense</p>
          </div>

          <div className="info-card">
            <h3>AI Detection Accuracy</h3>
            <div className="progress-section">
              <div className="progress-header">
                <span>Model Performance</span>
                <span className="progress-value">{(aiAccuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${aiAccuracy * 100}%` }}
                />
              </div>
            </div>
            <p>The AI model is learning from shared telemetry to improve threat detection across the ecosystem</p>
          </div>

          <div className="loading-indicator">
            <div className="spinner" />
          </div>
        </div>
      </div>
    </div>
  );
}
