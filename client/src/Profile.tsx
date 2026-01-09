import { usePlayer, useGame, useRound } from "@empirica/core/player/classic/react";
import React from "react";

export function Profile() {
  const player = usePlayer();
  const game = useGame();
  const round = useRound();

  if (!player || !game || !round) {
    return null;
  }

  const totalPayoff = (player.get("totalPayoff") as number) || 0;
  const phase = game.get("phase") as string;
  const governanceRegime = game.get("governanceRegime") as string;
  const absorptiveCapacity = player.get("absorptiveCapacity") as string;
  const roundIndex = (round.get("index") as number) + 1;
  const treatment = game.get("treatment") as any;
  const totalRounds = treatment.collaborationRounds + treatment.competitionRounds;

  return (
    <div className="profile-header">
      <div className="profile-container">
        <div className="profile-info">
          <div className="info-item">
            <span className="label">Round</span>
            <span className="value">{roundIndex} / {totalRounds}</span>
          </div>
          <div className="info-item">
            <span className="label">Phase</span>
            <span className="value phase-badge">{String(phase)}</span>
          </div>
          <div className="info-item">
            <span className="label">Governance</span>
            <span className="value">{String(governanceRegime)}</span>
          </div>
          <div className="info-item">
            <span className="label">Learning Capacity</span>
            <span className="value">{String(absorptiveCapacity)}</span>
          </div>
        </div>
        <div className="profile-payoff">
          <span className="payoff-label">Total Payoff</span>
          <span className="payoff-value">${totalPayoff.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
