import { usePlayer, useGame } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import React, { useState } from "react";

export function TrainingStage() {
  const player = usePlayer();
  const game = useGame();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);

  const slides = [
    {
      title: "Welcome to the Cybersecurity Intelligence Sharing Study",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            In this experiment, you will play the role of a <strong>Chief Information Security Officer (CISO)</strong> at a cybersecurity firm.
          </p>
          <p>
            Your firm detects cyber threats and must decide whether to share this intelligence with other firms in the ecosystem.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
            <p className="font-semibold text-blue-900">Key Goal:</p>
            <p className="text-blue-800">Maximize your firm's payoff by making strategic decisions about information sharing and competition.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Your Threat Portfolio",
      content: (
        <div className="space-y-4">
          <p>
            Each firm starts with a unique set of <strong>threat signatures</strong> - attack patterns you've detected.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg my-4">
            <p className="font-mono text-sm">Example: THREAT-A7X2K, THREAT-B9M4P, THREAT-C3N8R</p>
          </div>
          <p>
            This is your <strong>proprietary knowledge</strong> - what you know that others don't.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <p className="font-semibold text-green-900">✓ Advantage</p>
              <p className="text-sm text-green-800">Unique knowledge gives you competitive edge</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <p className="font-semibold text-yellow-900">⚠ Trade-off</p>
              <p className="text-sm text-yellow-800">Sharing helps everyone but reduces your advantage</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "The Disclosure Decision",
      content: (
        <div className="space-y-4">
          <p>
            Each round, you decide <strong>how much threat intelligence to share</strong> with other firms:
          </p>
          <div className="space-y-3 mt-4">
            <div className="bg-white border-2 border-gray-300 p-4 rounded-lg">
              <p className="font-semibold text-gray-900">🚫 None (0%)</p>
              <p className="text-sm text-gray-600">Keep all intelligence private. No risk of leakage, but no contribution to collective defense.</p>
            </div>
            <div className="bg-white border-2 border-blue-300 p-4 rounded-lg">
              <p className="font-semibold text-blue-900">📊 Partial (50%)</p>
              <p className="text-sm text-blue-600">Share half your threats. Moderate contribution with moderate leakage risk.</p>
            </div>
            <div className="bg-white border-2 border-green-300 p-4 rounded-lg">
              <p className="font-semibold text-green-900">✅ Full (100%)</p>
              <p className="text-sm text-green-600">Share all threats. Maximum collective benefit but highest leakage risk.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "The Collective AI Model",
      content: (
        <div className="space-y-4">
          <p>
            All shared intelligence trains a <strong>collective AI model</strong> that helps everyone detect threats.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg my-4 border border-purple-200">
            <p className="font-semibold text-purple-900 mb-2">How It Works:</p>
            <ul className="list-disc list-inside space-y-1 text-purple-800 text-sm">
              <li>More sharing → Better AI accuracy</li>
              <li>Better AI → Higher detection rates for everyone</li>
              <li><strong>Everyone benefits</strong>, even firms that don't share</li>
            </ul>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="font-semibold text-orange-900 mb-2">⚠️ The Dilemma:</p>
            <p className="text-sm text-orange-800">
              You can "free-ride" by not sharing but still using the AI. However, if everyone free-rides, the AI stays weak and everyone loses.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Leakage Risk",
      content: (
        <div className="space-y-4">
          <p>
            When you share intelligence, there's a risk that <strong>adversaries learn about your capabilities</strong>.
          </p>
          <div className="bg-red-50 p-4 rounded-lg my-4 border border-red-200">
            <p className="font-semibold text-red-900 mb-2">Leakage Consequences:</p>
            <ul className="list-disc list-inside space-y-1 text-red-800 text-sm">
              <li>Competitors may gain insights into your defenses</li>
              <li>Reduces your competitive advantage</li>
              <li>Affects your reputation and future payoffs</li>
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-3 bg-green-100 rounded">
              <p className="font-bold text-green-900">Low Risk</p>
              <p className="text-xs text-green-700">Share less</p>
            </div>
            <div className="text-center p-3 bg-yellow-100 rounded">
              <p className="font-bold text-yellow-900">Medium Risk</p>
              <p className="text-xs text-yellow-700">Partial sharing</p>
            </div>
            <div className="text-center p-3 bg-red-100 rounded">
              <p className="font-bold text-red-900">High Risk</p>
              <p className="text-xs text-red-700">Share everything</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Your Payoff Structure",
      content: (
        <div className="space-y-4">
          <p>
            Your earnings depend on your <strong>detection accuracy</strong>:
          </p>
          <div className="bg-gray-100 p-4 rounded-lg my-4">
            <p className="font-mono text-sm text-center">
              Detection Accuracy = Baseline + AI Boost + Learned Threats
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-semibold">Baseline (60%)</p>
                <p className="text-sm text-gray-600">Your firm's starting capability</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <p className="font-semibold">AI Boost</p>
                <p className="text-sm text-gray-600">Benefit from collective AI (everyone gets this)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧠</span>
              <div>
                <p className="font-semibold">Learned Threats</p>
                <p className="text-sm text-gray-600">Intelligence you absorbed from others' sharing</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg mt-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Higher detection accuracy → Higher payoff</strong> from security contracts
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Competition Phase",
      content: (
        <div className="space-y-4">
          <p>
            After collaboration rounds, you'll compete for <strong>exclusive security contracts</strong>.
          </p>
          <div className="bg-indigo-50 p-4 rounded-lg my-4 border border-indigo-200">
            <p className="font-semibold text-indigo-900 mb-2">Competition Strategies:</p>
            <ul className="list-disc list-inside space-y-1 text-indigo-800 text-sm">
              <li><strong>Leverage unique knowledge:</strong> Use threats only you know</li>
              <li><strong>Showcase capabilities:</strong> Demonstrate detection accuracy</li>
              <li><strong>Build reputation:</strong> Past cooperation affects trust</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">
            Firms with more unique threat knowledge and better reputations earn higher competition payoffs.
          </p>
        </div>
      ),
    },
    {
      title: "Understanding the Trade-offs",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-semibold">The Core Dilemma:</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
              <p className="font-bold text-green-900 mb-2">✓ Benefits of Sharing</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Stronger collective AI</li>
                <li>• Everyone detects threats better</li>
                <li>• Build trust and reputation</li>
                <li>• Long-term ecosystem health</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
              <p className="font-bold text-red-900 mb-2">✗ Costs of Sharing</p>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Risk of information leakage</li>
                <li>• Lose competitive advantage</li>
                <li>• Others may free-ride</li>
                <li>• Reputation damage if leaked</li>
              </ul>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg mt-4 border border-yellow-300">
            <p className="font-semibold text-yellow-900">💡 Strategic Consideration:</p>
            <p className="text-sm text-yellow-800">
              Your optimal strategy depends on what others do, the governance rules, and whether you prioritize short-term competition or long-term cooperation.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const quiz = [
    {
      question: "What happens to shared threat intelligence?",
      options: [
        "Only you can see it",
        "It trains a collective AI that everyone can use",
        "It's deleted after each round",
        "Only the highest-paying firms can access it",
      ],
      correct: 1,
      explanation: "Shared intelligence trains a collective AI model that all firms can use, regardless of how much they contributed.",
    },
    {
      question: "What is the main risk of sharing your threat intelligence?",
      options: [
        "You lose all your data",
        "Other firms steal your clients",
        "Information may leak to adversaries, reducing your competitive advantage",
        "The AI becomes less accurate",
      ],
      correct: 2,
      explanation: "Sharing creates a risk that your proprietary knowledge leaks to competitors or adversaries, potentially reducing your competitive advantage.",
    },
    {
      question: "How is your payoff determined?",
      options: [
        "Random lottery",
        "Based on your detection accuracy",
        "Equal for all players",
        "Only based on how much you share",
      ],
      correct: 1,
      explanation: "Your payoff depends on your detection accuracy, which comes from your baseline capability, the collective AI, and threats you learned from others.",
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setShowFeedback(false);
    } else if (currentSlide === slides.length - 1) {
      // Move to quiz
      setCurrentSlide(slides.length);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setShowFeedback(false);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [questionIndex]: answerIndex.toString() });
  };

  const handleSubmitQuiz = () => {
    setShowFeedback(true);
    
    // Check if all answers are correct
    const allCorrect = quiz.every((q, idx) => 
      parseInt(quizAnswers[idx] || "-1") === q.correct
    );
    
    if (allCorrect) {
      player.set("trainingCompleted", true as any);
      setCompleted(true);
    }
  };

  const handleComplete = () => {
    player.stage.set("submit", true as any);
  };

  const allQuizAnswered = quiz.every((_, idx) => quizAnswers[idx] !== undefined);
  const allCorrect = quiz.every((q, idx) => 
    parseInt(quizAnswers[idx] || "-1") === q.correct
  );

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-green-900 mb-4">Training Complete!</h2>
          <p className="text-lg text-green-800 mb-6">
            You've successfully completed the training and understand the key concepts.
          </p>
          <p className="text-gray-700 mb-6">
            You're now ready to begin the experiment. Click below to proceed to the first round.
          </p>
          <Button onClick={handleComplete} primary>
            Begin Experiment
          </Button>
        </div>
      </div>
    );
  }

  if (currentSlide === slides.length) {
    // Quiz section
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Knowledge Check</h1>
          <p className="text-gray-600 mb-6">
            Answer these questions to ensure you understand the key concepts. All answers must be correct to proceed.
          </p>

          <div className="space-y-6">
            {quiz.map((q, qIdx) => (
              <div key={qIdx} className="border border-gray-200 rounded-lg p-6">
                <p className="font-semibold text-gray-900 mb-4">
                  {qIdx + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((option, oIdx) => {
                    const isSelected = quizAnswers[qIdx] === oIdx.toString();
                    const isCorrect = oIdx === q.correct;
                    const showResult = showFeedback && isSelected;

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleQuizAnswer(qIdx, oIdx)}
                        disabled={showFeedback}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                          showResult && isCorrect
                            ? "border-green-500 bg-green-50"
                            : showResult && !isCorrect
                            ? "border-red-500 bg-red-50"
                            : isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400 bg-white"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? "border-blue-500" : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            )}
                          </span>
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {showFeedback && quizAnswers[qIdx] !== undefined && (
                  <div
                    className={`mt-3 p-3 rounded-lg ${
                      parseInt(quizAnswers[qIdx]) === q.correct
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    <p className="text-sm">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Button onClick={() => setCurrentSlide(slides.length - 1)}>
              ← Review Training
            </Button>
            {!showFeedback ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={!allQuizAnswered}
                primary
              >
                Submit Answers
              </Button>
            ) : allCorrect ? (
              <Button onClick={() => setCompleted(true)} primary>
                Continue to Experiment →
              </Button>
            ) : (
              <Button onClick={() => setShowFeedback(false)} primary>
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Training slides
  const slide = slides[currentSlide];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Training Progress</span>
            <span>
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Slide content */}
        <h1 className="text-3xl font-bold mb-6 text-gray-900">{slide.title}</h1>
        <div className="text-gray-700 leading-relaxed">{slide.content}</div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentSlide === 0}
          >
            ← Previous
          </Button>
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentSlide ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
          <Button onClick={handleNext} primary>
            {currentSlide === slides.length - 1 ? "Take Quiz →" : "Next →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
