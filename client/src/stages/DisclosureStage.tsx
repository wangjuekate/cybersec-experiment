import { usePlayer, useGame, useStage } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import React, { useState } from "react";

export function DisclosureStage() {
  const player = usePlayer();
  const game = useGame();
  const stage = useStage();
  
  const [disclosureAmount, setDisclosureAmount] = useState("none");
  const [disclosureResolution, setDisclosureResolution] = useState("coarse");
  const [submitted, setSubmitted] = useState(false);

  const threatPortfolio = (player.get("threatPortfolio") as string[]) || [];
  const governanceRegime = game.get("governanceRegime") as string;
  const aggregationType = (game.get("aggregationType") as string) || "ai";
  const isNonprofit = aggregationType === "nonprofit";

  const handleSubmit = () => {
    const signals = disclosureAmount === "none" ? [] :
                   disclosureAmount === "partial" ? threatPortfolio.slice(0, Math.ceil(threatPortfolio.length / 2)) :
                   threatPortfolio;

    player.round.set("disclosureDecision", {
      amount: disclosureAmount,
      resolution: disclosureResolution,
      signals: signals
    } as any);
    
    player.stage.set("submit", true as any);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="stage-container">
        <div className="stage-content">
          <div className="success-message">
            <h2>Decision Submitted</h2>
            <p>Waiting for other firms to make their disclosure decisions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stage-container">
      <div className="stage-content">
        <div className="stage-header">
          <h1>Telemetry Disclosure Decision</h1>
          <p>
            {isNonprofit 
              ? "As the CISO of your firm, decide how much threat intelligence to contribute to the Cybersecurity Information Sharing Organization (CISO), a nonprofit that helps protect all member firms."
              : "As the CISO of your firm, decide how much threat intelligence to share with the ecosystem."}
          </p>
        </div>

        <div className="stage-body">
          <div className="info-card highlight">
            <h3>Your Threat Portfolio</h3>
            <p>You have detected {threatPortfolio.length} unique attack signatures:</p>
            <div className="badge-list">
              {threatPortfolio.map((signature, idx) => (
                <span key={idx} className="badge">
                  {signature}
                </span>
              ))}
            </div>
          </div>

          {governanceRegime !== "open" && (
            <div className="info-card warning">
              <h3>Governance: {governanceRegime}</h3>
              <p>
                {governanceRegime === "anonymized" && "Your disclosures will be anonymized - other firms won't know who shared what."}
                {governanceRegime === "restricted" && "Shared signals will decay over time or incur a reuse tax."}
                {governanceRegime === "auditable" && "Misuse of shared intelligence will be tracked and penalized through reputation scores."}
              </p>
            </div>
          )}

          <div className="form-section">
            <label className="form-label">
              <strong>Disclosure Amount</strong>
            </label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="amount"
                  value="none"
                  checked={disclosureAmount === "none"}
                  onChange={(e) => setDisclosureAmount(e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">None</div>
                  <div className="radio-description">Keep all telemetry private</div>
                </div>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="amount"
                  value="partial"
                  checked={disclosureAmount === "partial"}
                  onChange={(e) => setDisclosureAmount(e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Partial</div>
                  <div className="radio-description">Share approximately half of your signals</div>
                </div>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="amount"
                  value="full"
                  checked={disclosureAmount === "full"}
                  onChange={(e) => setDisclosureAmount(e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Full</div>
                  <div className="radio-description">Share all detected attack signatures</div>
                </div>
              </label>
            </div>
          </div>

          {disclosureAmount !== "none" && (
            <div className="form-section">
              <label className="form-label">
                <strong>Resolution Level</strong>
              </label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="resolution"
                    value="coarse"
                    checked={disclosureResolution === "coarse"}
                    onChange={(e) => setDisclosureResolution(e.target.value)}
                  />
                  <div className="radio-content">
                    <div className="radio-title">Coarse-grained</div>
                    <div className="radio-description">General threat categories only</div>
                  </div>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="resolution"
                    value="fine"
                    checked={disclosureResolution === "fine"}
                    onChange={(e) => setDisclosureResolution(e.target.value)}
                  />
                  <div className="radio-content">
                    <div className="radio-title">Fine-grained</div>
                    <div className="radio-description">Detailed attack signatures and indicators</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          <div className="form-actions">
            <Button onClick={handleSubmit} primary>
              Submit Disclosure Decision
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
