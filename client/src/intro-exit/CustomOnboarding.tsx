import React from 'react';

interface CustomOnboardingProps {
  next: () => void;
}

export function CustomOnboarding({ next }: CustomOnboardingProps) {
  return (
    <div className="stage-container">
      <div className="stage-content">
        <div className="stage-header">
          <h1>Welcome to the Cybersecurity Intelligence Sharing Study</h1>
          <p>Thank you for participating in this research experiment</p>
        </div>

        <div className="stage-body">
          <div className="info-card">
            <h3>About This Study</h3>
            <p>
              This experiment examines strategic decision-making in cybersecurity threat intelligence 
              sharing among firms. You will take on the role of a Chief Information Security Officer (CISO) 
              and make decisions that affect both your firm's security and the broader ecosystem.
            </p>
          </div>

          <div className="info-card highlight">
            <h3>What You'll Do</h3>
            <ul style={{ marginLeft: '1.5rem', marginTop: '1rem', lineHeight: '1.8' }}>
              <li><strong>Phase 1 - Collaboration:</strong> Decide whether to share threat intelligence with other firms</li>
              <li><strong>AI Aggregation:</strong> Observe how shared intelligence improves collective defense</li>
              <li><strong>Phase 2 - Competition:</strong> Compete for security contracts based on your knowledge base</li>
              <li><strong>Strategic Decisions:</strong> Balance cooperation and competition throughout the study</li>
            </ul>
          </div>

          <div className="results-grid">
            <div className="info-card">
              <h3>⏱️ Duration</h3>
              <p style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0' }}>
                30-45 minutes
              </p>
              <p style={{ textAlign: 'center', color: '#6b7280' }}>
                Complete all rounds
              </p>
            </div>

            <div className="info-card">
              <h3>👥 Participants</h3>
              <p style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0' }}>
                3-5 firms
              </p>
              <p style={{ textAlign: 'center', color: '#6b7280' }}>
                In your ecosystem
              </p>
            </div>

            <div className="info-card">
              <h3>🎯 Rounds</h3>
              <p style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0' }}>
                12 rounds
              </p>
              <p style={{ textAlign: 'center', color: '#6b7280' }}>
                8 collaboration + 4 competition
              </p>
            </div>
          </div>

          <div className="info-card warning">
            <h3>Important Information</h3>
            <ul style={{ marginLeft: '1.5rem', marginTop: '1rem', lineHeight: '1.8' }}>
              <li>All data will be anonymized and used only for research purposes</li>
              <li>You can withdraw at any time without penalty</li>
              <li>There are no right or wrong answers - we're studying decision patterns</li>
              <li>Your decisions will be confidential from other participants</li>
            </ul>
          </div>

          <div className="form-actions">
            <button className="btn-primary" onClick={next}>
              Continue to Consent Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
