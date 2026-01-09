import React, { useState } from 'react';

interface PlayerIdentifierProps {
  onSubmit: (identifier: string) => void;
}

export function PlayerIdentifier({ onSubmit }: PlayerIdentifierProps) {
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim()) {
      onSubmit(identifier.trim());
    }
  };

  return (
    <div className="stage-container">
      <div className="stage-content" style={{ maxWidth: '600px' }}>
        <div className="stage-header">
          <h1>Enter Your Player Identifier</h1>
          <p>This should be given to you (e.g., email, code, participant ID)</p>
        </div>

        <div className="stage-body">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <label className="form-label" htmlFor="identifier">
                <strong>Identifier</strong>
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your identifier..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '6px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <p style={{ 
                marginTop: '8px', 
                fontSize: '14px', 
                color: '#6b7280' 
              }}>
                Please enter the unique identifier provided to you by the research team
              </p>
            </div>

            <div className="form-actions">
              <button 
                type="submit"
                className="btn-primary"
                disabled={!identifier.trim()}
              >
                Continue
              </button>
            </div>
          </form>

          <div className="info-card" style={{ marginTop: '2rem' }}>
            <h3>Need Help?</h3>
            <p>
              If you don't have an identifier or are experiencing issues, please contact the research team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
