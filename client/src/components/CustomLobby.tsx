import React from "react";

export function CustomLobby() {
  return (
    <div className="stage-container">
      <div className="stage-content">
        <div className="stage-header">
          <h1>Waiting for Other Players</h1>
          <p>Please wait while we prepare your cybersecurity experiment session</p>
        </div>

        <div className="stage-body">
          <div className="info-card">
            <div className="loading-indicator">
              <div className="spinner" />
            </div>
            <h3 style={{ textAlign: 'center', marginTop: '2rem' }}>
              Preparing Your Session
            </h3>
            <p style={{ textAlign: 'center', color: '#6b7280' }}>
              The experiment will begin once all participants have joined and completed the introduction.
            </p>
          </div>

          <div className="info-card" style={{ marginTop: '2rem' }}>
            <h3>What to Expect</h3>
            <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
              <li>You will act as a CISO making threat intelligence sharing decisions</li>
              <li>The study includes collaboration and competition phases</li>
              <li>Your decisions will impact both your firm and the ecosystem</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
