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
}

export function ExitSurvey({ next }: ExitSurveyProps) {
  const player = usePlayer();
  const [responses, setResponses] = useState<SurveyResponses>({
    strategy: '',
    difficulty: '',
    governance: '',
    learning: '',
    comments: ''
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
