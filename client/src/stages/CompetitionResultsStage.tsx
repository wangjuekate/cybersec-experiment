import { usePlayer, usePlayers, useRound, useGame } from "@empirica/core/player/classic/react";
import React from "react";

export function CompetitionResultsStage() {
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const game = useGame();
  
  const competitionScore = (player.round.get("competitionScore") as number) || 0;
  const payoff = (player.round.get("payoff") as number) || 0;
  const totalPayoff = (player.get("totalPayoff") as number) || 0;

  const allScores = players.map(p => ({
    id: p.id,
    score: (p.round.get("competitionScore") as number) || 0,
    isYou: p.id === player.id
  })).sort((a, b) => b.score - a.score);

  const yourRank = allScores.findIndex(s => s.isYou) + 1;

  return (
    <div className="stage-container">
      <div className="stage-content">
        <div className="stage-header">
          <h1>Competition Results</h1>
          <p>See how your firm performed in the competition for security contracts</p>
        </div>

        <div className="stage-body">
          <div className="results-grid three-col">
            <div className="info-card">
              <h3>Your Rank</h3>
              <div className="metric-large">
                #{yourRank}
              </div>
              <p>Out of {players.length} firms</p>
            </div>

            <div className="info-card">
              <h3>Competition Score</h3>
              <div className="metric-large">
                {competitionScore.toFixed(1)}
              </div>
              <p>Based on knowledge base and strategy</p>
            </div>

            <div className="info-card">
              <h3>Round Payoff</h3>
              <div className="metric-large">
                ${payoff.toFixed(2)}
              </div>
              <p>Contract award value</p>
            </div>
          </div>

          <div className="info-card highlight">
            <h3>Leaderboard</h3>
            <div className="leaderboard">
              {allScores.map((entry, idx) => (
                <div key={entry.id} className={`leaderboard-item ${entry.isYou ? 'highlight' : ''}`}>
                  <span className="rank">#{idx + 1}</span>
                  <span className="firm-name">
                    {entry.isYou ? 'Your Firm' : `Firm ${entry.id.slice(-4)}`}
                  </span>
                  <span className="score">{entry.score.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="info-card success">
            <h3>Cumulative Performance</h3>
            <div className="metric-large">
              ${totalPayoff.toFixed(2)}
            </div>
            <p>Total earnings across all rounds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
