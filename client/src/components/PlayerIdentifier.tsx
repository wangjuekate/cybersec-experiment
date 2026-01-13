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
      <div className="stage-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="stage-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Participant Identifier
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Please enter your unique identifier to begin
          </p>
        </div>

        <div className="stage-body">
          <form onSubmit={handleSubmit}>
            <div className="form-section" style={{ marginBottom: '2rem' }}>
              <label 
                className="form-label" 
                htmlFor="identifier"
                style={{ 
                  display: 'block',
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  color: '#374151'
                }}
              >
                Your Identifier
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g., email@example.com or participant code"
                autoFocus
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  fontSize: '18px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                }}
              />
              <p style={{ 
                marginTop: '0.75rem', 
                fontSize: '0.875rem', 
                color: '#6b7280',
                lineHeight: '1.5'
              }}>
                This identifier was provided to you by the research team. It can be your email address, 
                a participant code, or any unique identifier you were given.
              </p>
            </div>

            <div className="form-actions">
              <button 
                type="submit"
                className="btn-primary"
                disabled={!identifier.trim()}
                style={{
                  width: '100%',
                  fontSize: '1.125rem',
                  padding: '1rem',
                  opacity: identifier.trim() ? 1 : 0.5,
                  cursor: identifier.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Continue to Experiment
              </button>
            </div>
          </form>

          <div className="info-card" style={{ 
            marginTop: '2rem',
            padding: '1.25rem',
            background: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Need Help?
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
              If you don't have an identifier or are experiencing issues, please contact the research team 
              for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
