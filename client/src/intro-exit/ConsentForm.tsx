import React, { useState } from 'react';

interface ConsentFormProps {
  next: () => void;
}

export function ConsentForm({ next }: ConsentFormProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="consent-form">
      <div className="form-container">
        <div className="form-header">
          <h1>Research Consent Form</h1>
        </div>

        <div className="form-content">
          <p className="intro-text">
            You are invited to participate in a research study examining strategic decision-making 
            in cybersecurity threat intelligence sharing.
          </p>

          <div className="section-card">
            <h2>Study Overview</h2>
            <p>
              In this study, you will act as a <strong>Chief Information Security Officer (CISO)</strong> making 
              decisions about sharing threat intelligence with other firms in your ecosystem. 
              The study consists of multiple rounds where you will:
            </p>
            <ul className="study-list">
              <li>Make disclosure decisions about threat telemetry</li>
              <li>Observe AI-driven collective defense improvements</li>
              <li>Compete for security contracts based on your knowledge base</li>
            </ul>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <h3>Time Commitment</h3>
              <p>30-45 minutes to complete</p>
            </div>
            <div className="info-card">
              <h3>Confidentiality</h3>
              <p>Data anonymized and aggregated</p>
            </div>
            <div className="info-card">
              <h3>Voluntary Participation</h3>
              <p>Withdraw anytime without penalty</p>
            </div>
          </div>
        </div>

        <div className="consent-checkbox">
          <label>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              I have read and understood the information above. I agree to participate in this research study.
            </span>
          </label>
        </div>

        <div className="form-actions">
          <button 
            className="btn-primary" 
            onClick={next} 
            disabled={!agreed}
          >
            Continue to Study
          </button>
        </div>
      </div>
    </div>
  );
}
