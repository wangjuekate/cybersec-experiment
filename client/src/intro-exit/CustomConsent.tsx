import React, { useState } from 'react';

interface CustomConsentProps {
  next: () => void;
}

export function CustomConsent({ next }: CustomConsentProps) {
  const [agreed, setAgreed] = useState(false);
  const [understoodRisks, setUnderstoodRisks] = useState(false);
  const [understoodWithdrawal, setUnderstoodWithdrawal] = useState(false);

  const canProceed = agreed && understoodRisks && understoodWithdrawal;

  return (
    <div className="stage-container">
      <div className="stage-content">
        <div className="stage-header">
          <h1>Informed Consent</h1>
          <p>Please read carefully and confirm your understanding</p>
        </div>

        <div className="stage-body">
          <div className="info-card">
            <h3>Study Purpose</h3>
            <p>
              This research examines how cybersecurity professionals make decisions about sharing 
              threat intelligence in collaborative and competitive environments. Your participation 
              will help us understand the factors that influence information sharing in cybersecurity ecosystems.
            </p>
          </div>

          <div className="info-card highlight">
            <h3>What Participation Involves</h3>
            <ul style={{ marginLeft: '1.5rem', marginTop: '1rem', lineHeight: '1.8' }}>
              <li>Acting as a CISO making strategic decisions about threat intelligence sharing</li>
              <li>Participating in 12 rounds of decision-making (approximately 30-45 minutes)</li>
              <li>Completing a brief survey about your experience at the end</li>
              <li>Your decisions will be recorded for research analysis</li>
            </ul>
          </div>

          <div className="results-grid">
            <div className="info-card">
              <h3>🔒 Confidentiality</h3>
              <p>
                All data collected will be anonymized. Your identity will not be linked to your responses. 
                Data will be stored securely and used only for research purposes.
              </p>
            </div>

            <div className="info-card">
              <h3>⚠️ Risks</h3>
              <p>
                There are minimal risks associated with this study. You may experience mild fatigue 
                from decision-making tasks. You can take breaks as needed.
              </p>
            </div>

            <div className="info-card">
              <h3>✋ Voluntary</h3>
              <p>
                Your participation is completely voluntary. You may withdraw at any time without 
                penalty or loss of benefits to which you are otherwise entitled.
              </p>
            </div>
          </div>

          <div className="info-card warning">
            <h3>Your Rights</h3>
            <ul style={{ marginLeft: '1.5rem', marginTop: '1rem', lineHeight: '1.8' }}>
              <li>You have the right to ask questions about the study at any time</li>
              <li>You have the right to withdraw from the study at any time</li>
              <li>You have the right to request that your data be deleted</li>
              <li>You have the right to receive a summary of the research findings</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>Contact Information</h3>
            <p>
              If you have questions about this study, please contact the research team. 
              If you have questions about your rights as a research participant, please contact 
              your institution's Institutional Review Board (IRB).
            </p>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '0.5rem', border: '2px solid #e5e7eb' }}>
            <h3 style={{ marginBottom: '1rem' }}>Please confirm your understanding:</h3>
            
            <label style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ marginRight: '0.75rem', marginTop: '0.25rem', width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
              />
              <span style={{ flex: 1 }}>
                I have read and understood the information above. I agree to participate in this research study.
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={understoodRisks}
                onChange={(e) => setUnderstoodRisks(e.target.checked)}
                style={{ marginRight: '0.75rem', marginTop: '0.25rem', width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
              />
              <span style={{ flex: 1 }}>
                I understand the potential risks and benefits of participating in this study.
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={understoodWithdrawal}
                onChange={(e) => setUnderstoodWithdrawal(e.target.checked)}
                style={{ marginRight: '0.75rem', marginTop: '0.25rem', width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
              />
              <span style={{ flex: 1 }}>
                I understand that my participation is voluntary and I can withdraw at any time.
              </span>
            </label>
          </div>

          <div className="form-actions">
            <button 
              className="btn-primary" 
              onClick={next}
              disabled={!canProceed}
            >
              I Consent - Begin Study
            </button>
          </div>

          {!canProceed && (
            <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '1rem', fontSize: '0.875rem' }}>
              Please check all boxes to proceed
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
