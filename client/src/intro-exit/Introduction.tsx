import React from 'react';

interface IntroductionProps {
  next: () => void;
}

export function Introduction({ next }: IntroductionProps) {
  return (
    <div className="introduction">
      <div className="intro-container">
        <div className="intro-header">
          <h1>Cybersecurity Threat Intelligence Sharing Study</h1>
        </div>

        <div className="intro-content">
          <section className="intro-section">
            <h2>Your Role</h2>
            <p>
              You are the <strong>Chief Information Security Officer (CISO)</strong> of a firm 
              operating in a small cybersecurity ecosystem with 3-5 other firms. Your decisions 
              will impact both your firm's security posture and the collective defense of the ecosystem.
            </p>
          </section>

          <section className="intro-section">
            <h2>Study Structure</h2>
            
            <div className="phase-card phase-collaboration">
              <h3>Phase 1: Collaboration (Rounds 1-8)</h3>
              <p>Each round, you will decide whether to share threat telemetry with the ecosystem:</p>
              <ul>
                <li><strong>Disclosure Amount:</strong> None, Partial, or Full sharing of attack signatures</li>
                <li><strong>Resolution Level:</strong> Coarse-grained or Fine-grained detail</li>
                <li><strong>AI Aggregation:</strong> Shared intelligence trains a collective detection model</li>
                <li><strong>Payoffs:</strong> Better detection = fewer attacks, but sharing has costs</li>
              </ul>
            </div>

            <div className="phase-card phase-competition">
              <h3>Phase 2: Competition (Rounds 9-12)</h3>
              <p>Firms compete independently for scarce security contracts:</p>
              <ul>
                <li><strong>Knowledge Base:</strong> Your competitive advantage depends on accumulated intelligence</li>
                <li><strong>Leakage Measurement:</strong> We track how you benefit from others' past disclosures</li>
                <li><strong>Contract Awards:</strong> Performance determines your earnings</li>
              </ul>
            </div>
          </section>

          <section className="intro-section">
            <h2>Key Concepts</h2>
            <div className="concepts-grid">
              <div className="concept-card">
                <h4>Telemetry</h4>
                <p>Threat intelligence signals and attack signatures your firm has detected</p>
              </div>
              <div className="concept-card">
                <h4>Detection Accuracy</h4>
                <p>Your firm's ability to identify and prevent cyber attacks</p>
              </div>
              <div className="concept-card">
                <h4>Attack Exposure</h4>
                <p>The volume of attacks targeting your firm each round</p>
              </div>
              <div className="concept-card">
                <h4>Knowledge Leakage</h4>
                <p>Using others' shared intelligence without reciprocal contribution</p>
              </div>
            </div>
          </section>

          <section className="intro-section important-notes">
            <h2>Important Notes</h2>
            <ul>
              <li>Your firm has a unique threat portfolio and learning capacity</li>
              <li>The governance regime affects how sharing works (open, anonymized, restricted, or auditable)</li>
              <li>Strategic decisions in the collaboration phase affect competition outcomes</li>
              <li>There are no "right" answers - we're studying decision-making patterns</li>
            </ul>
          </section>
        </div>

        <div className="intro-actions">
          <button className="btn-primary" onClick={next}>
            Begin Experiment
          </button>
        </div>
      </div>
    </div>
  );
}
