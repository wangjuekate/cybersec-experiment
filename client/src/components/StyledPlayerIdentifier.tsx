import React, { useState, useEffect } from 'react';

export function StyledPlayerIdentifier() {
  const [identifier, setIdentifier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Try to find the default Empirica form and hide it
    const hideDefaultForm = () => {
      const defaultForm = document.querySelector('form[action="#"]');
      if (defaultForm) {
        const container = defaultForm.closest('.min-h-screen');
        if (container) {
          (container as HTMLElement).style.display = 'none';
        }
      }
    };

    hideDefaultForm();
    const interval = setInterval(hideDefaultForm, 100);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsSubmitting(true);

    // Find and fill the hidden Empirica form
    const empiricaInput = document.querySelector('#playerID') as HTMLInputElement;
    const empiricaForm = document.querySelector('form[action="#"]') as HTMLFormElement;
    
    if (empiricaInput && empiricaForm) {
      empiricaInput.value = identifier.trim();
      
      // Trigger form submission
      const submitButton = empiricaForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.click();
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '3rem',
        animation: 'fadeIn 0.5s ease-in'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Welcome to the Study
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#6b7280'
          }}>
            Please enter your participant identifier to begin
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="custom-identifier"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}
            >
              Participant Identifier
            </label>
            <input
              id="custom-identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or participant code"
              autoFocus
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                outline: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              }}
            />
            <p style={{
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              This should be provided by the research team (e.g., email, code, participant ID)
            </p>
          </div>

          <button
            type="submit"
            disabled={!identifier.trim() || isSubmitting}
            style={{
              width: '100%',
              padding: '0.875rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'white',
              background: identifier.trim() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#9ca3af',
              border: 'none',
              borderRadius: '8px',
              cursor: identifier.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              boxShadow: identifier.trim() ? '0 4px 12px rgba(102,126,234,0.4)' : 'none',
              opacity: isSubmitting ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (identifier.trim() && !isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102,126,234,0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = identifier.trim() ? '0 4px 12px rgba(102,126,234,0.4)' : 'none';
            }}
          >
            {isSubmitting ? 'Entering...' : 'Enter Study'}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0,
            lineHeight: '1.5'
          }}>
            <strong style={{ color: '#374151' }}>Need help?</strong><br />
            If you don't have an identifier, please contact the research team for assistance.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
