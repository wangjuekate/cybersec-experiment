import React, { useState } from 'react';

interface CustomConsentProps {
  next: () => void;
}

export function CustomConsent({ next }: CustomConsentProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="stage-container">
      <div className="stage-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="stage-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Research Consent Form
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Do you consent to participate in this experiment?
          </p>
        </div>

        <div className="stage-body">
          <div className="info-card" style={{ 
            padding: '1.5rem', 
            background: '#f9fafb', 
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            marginBottom: '1.5rem'
          }}>
            <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#374151' }}>
              This experiment is part of a <strong>scientific project</strong>. Your decision to participate 
              in this experiment is <strong>entirely voluntary</strong>. There are <strong>no known or 
              anticipated risks</strong> to participating in this experiment. There is <strong>no way for 
              us to identify you</strong>. The only information we will have, in addition to your responses, 
              is the timestamps of your interactions with our site. The results of our research may be 
              presented at scientific meetings or published in scientific journals.
            </p>
          </div>

          <div style={{ 
            marginTop: '2rem', 
            padding: '2rem', 
            background: 'white', 
            borderRadius: '0.5rem',
            border: '2px solid #2563eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              cursor: 'pointer',
              fontSize: '1.125rem'
            }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ 
                  marginRight: '1rem', 
                  marginTop: '0.25rem', 
                  width: '1.5rem', 
                  height: '1.5rem', 
                  cursor: 'pointer',
                  accentColor: '#2563eb'
                }}
              />
              <span style={{ flex: 1, lineHeight: '1.6' }}>
                Clicking on the <strong>"I AGREE"</strong> button indicates that you are <strong>at least 18 years of age</strong>, 
                and agree to participate voluntarily.
              </span>
            </label>
          </div>

          <div className="form-actions" style={{ marginTop: '2rem' }}>
            <button 
              className="btn-primary" 
              onClick={next}
              disabled={!agreed}
              style={{
                fontSize: '1.125rem',
                padding: '1rem 3rem',
                opacity: agreed ? 1 : 0.5,
                cursor: agreed ? 'pointer' : 'not-allowed'
              }}
            >
              I AGREE
            </button>
          </div>

          {!agreed && (
            <p style={{ 
              textAlign: 'center', 
              color: '#6b7280', 
              marginTop: '1rem', 
              fontSize: '0.875rem',
              fontStyle: 'italic'
            }}>
              Please check the box above to proceed
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
