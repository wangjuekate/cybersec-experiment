import React, { useState } from 'react';
import { usePlayer } from "@empirica/core/player/classic/react";

interface ExitSurveyProps {
  next: () => void;
}

interface SurveyResponses {
  strategy: string;
  difficulty: string;
  governance: string;
  learning: string;
  comments: string;
  email: string;
  interestedInResults: boolean;
  interestedInMentorship: boolean;
}

export function ExitSurvey({ next }: ExitSurveyProps) {
  const player = usePlayer();
  const [responses, setResponses] = useState<SurveyResponses>({
    strategy: '',
    difficulty: '',
    governance: '',
    learning: '',
    comments: '',
    email: '',
    interestedInResults: false,
    interestedInMentorship: false
  });

  const handleSubmit = () => {
    player.set("exitSurvey", responses as any);
    next();
  };

  const updateResponse = (field: keyof SurveyResponses, value: string) => {
    setResponses({ ...responses, [field]: value });
  };

  const allRequired = responses.strategy && responses.difficulty && responses.governance && responses.learning;

  return (
    <div className="exit-survey">
      <div className="survey-container">
        <div className="survey-header">
          <h1>Exit Survey</h1>
          <p>Help us improve by sharing your experience</p>
        </div>

        <div className="survey-content">
          <div className="survey-question">
            <label>
              <strong>What was your primary strategy during the collaboration phase?</strong>
            </label>
            <textarea
              value={responses.strategy}
              onChange={(e) => updateResponse('strategy', e.target.value)}
              placeholder="Describe your approach to sharing threat intelligence..."
              rows={4}
            />
          </div>

          <div className="survey-question">
            <label>
              <strong>How difficult was it to make disclosure decisions?</strong>
            </label>
            <div className="radio-group">
              {['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very Difficult'].map(option => (
                <label key={option} className="radio-option">
                  <input
                    type="radio"
                    name="difficulty"
                    value={option}
                    checked={responses.difficulty === option}
                    onChange={(e) => updateResponse('difficulty', e.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="survey-question">
            <label>
              <strong>How did the governance regime affect your decisions?</strong>
            </label>
            <textarea
              value={responses.governance}
              onChange={(e) => updateResponse('governance', e.target.value)}
              placeholder="Did anonymization, restrictions, or auditing influence your sharing behavior?"
              rows={4}
            />
          </div>

          <div className="survey-question">
            <label>
              <strong>Did you feel you learned effectively from others' shared intelligence?</strong>
            </label>
            <div className="radio-group">
              {['Not at all', 'Slightly', 'Moderately', 'Very much', 'Extremely'].map(option => (
                <label key={option} className="radio-option">
                  <input
                    type="radio"
                    name="learning"
                    value={option}
                    checked={responses.learning === option}
                    onChange={(e) => updateResponse('learning', e.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="survey-question">
            <label>
              <strong>Additional comments or feedback</strong> <span className="optional">(optional)</span>
            </label>
            <textarea
              value={responses.comments}
              onChange={(e) => updateResponse('comments', e.target.value)}
              placeholder="Any thoughts about the experiment, interface, or your experience..."
              rows={5}
            />
          </div>

          {/* Email Collection Section */}
          <div className="survey-section email-collection">
            <div className="section-header">
              <h3>📊 Get Your Results & Opportunities</h3>
              <p className="section-description">
                Interested in seeing your performance analysis or getting expert feedback? 
                Leave your email below (optional).
              </p>
            </div>

            <div className="survey-question">
              <label>
                <strong>Email Address</strong> <span className="optional">(optional)</span>
              </label>
              <input
                type="email"
                value={responses.email}
                onChange={(e) => updateResponse('email', e.target.value)}
                placeholder="your.email@example.com"
                className="email-input"
              />
            </div>

            {responses.email && (
              <div className="interest-checkboxes">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={responses.interestedInResults}
                    onChange={(e) => setResponses({ 
                      ...responses, 
                      interestedInResults: e.target.checked 
                    })}
                  />
                  <span>
                    <strong>📈 Send me my detailed performance results</strong>
                    <p className="checkbox-description">
                      Get insights on your decision-making patterns, collaboration effectiveness, 
                      and how you compared to other participants
                    </p>
                  </span>
                </label>

                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={responses.interestedInMentorship}
                    onChange={(e) => setResponses({ 
                      ...responses, 
                      interestedInMentorship: e.target.checked 
                    })}
                  />
                  <span>
                    <strong>🎯 I'm interested in expert mentorship</strong>
                    <p className="checkbox-description">
                      Connect with experienced professionals who can provide personalized 
                      feedback on your cybersecurity strategy and decision-making
                    </p>
                  </span>
                </label>
              </div>
            )}

            {responses.email && (
              <div className="privacy-note">
                <small>
                  🔒 Your email will only be used for the purposes you selected above. 
                  We respect your privacy and won't share your information with third parties.
                </small>
              </div>
            )}
          </div>
        </div>

        <div className="survey-actions">
          <button 
            className="btn-primary" 
            onClick={handleSubmit} 
            disabled={!allRequired}
          >
            Complete Study
          </button>
        </div>
      </div>
    </div>
  );
}
