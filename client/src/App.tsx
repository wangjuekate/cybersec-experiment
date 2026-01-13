import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaParticipant } from "@empirica/core/player/react";
import React from "react";
import "./empirica-overrides.css";
import { Game } from "./Game";
import { ExitSurvey } from "./intro-exit/ExitSurvey";
import { CustomOnboarding } from "./intro-exit/CustomOnboarding";
import { CustomConsent } from "./intro-exit/CustomConsent";
import { CustomLobby } from "./components/CustomLobby";
import { PlayerIdentifier } from "./components/PlayerIdentifier";
import { StyledPlayerIdentifier } from "./components/StyledPlayerIdentifier";

export default function App() {
  const [showStyledIdentifier, setShowStyledIdentifier] = React.useState(false);

  React.useEffect(() => {
    // Check if we're on the identifier screen
    const checkForIdentifierScreen = () => {
      const defaultForm = document.querySelector('#playerID');
      if (defaultForm && !localStorage.getItem('empirica_participant_id')) {
        setShowStyledIdentifier(true);
      } else {
        setShowStyledIdentifier(false);
      }
    };

    checkForIdentifierScreen();
    const interval = setInterval(checkForIdentifierScreen, 500);
    return () => clearInterval(interval);
  }, []);
  const urlParams = new URLSearchParams(window.location.search);
  const playerKeyFromUrl = urlParams.get("participantKey") || "";

  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;

  // Get or create participant ID
  const getParticipantId = () => {
    // First check URL parameter
    if (playerKeyFromUrl) {
      localStorage.setItem('empirica_participant_id', playerKeyFromUrl);
      return playerKeyFromUrl;
    }
    
    // Then check localStorage
    const stored = localStorage.getItem('empirica_participant_id');
    if (stored) {
      return stored;
    }
    
    // Generate new anonymous ID
    const newId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('empirica_participant_id', newId);
    return newId;
  };

  const participantId = getParticipantId();

  function introSteps({ game, player }: any) {
    return [CustomOnboarding, CustomConsent];
  }

  function exitSteps({ game, player }: any) {
    return [ExitSurvey];
  }

  return (
    <>
      {showStyledIdentifier && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          <StyledPlayerIdentifier />
        </div>
      )}
      <EmpiricaParticipant url={url} ns={participantId} modeFunc={EmpiricaClassic}>
        <div className="h-screen relative">
          <div className="h-full overflow-auto">
            <EmpiricaContext 
              introSteps={introSteps} 
              exitSteps={exitSteps}
              lobby={CustomLobby}
              disableConsent={true}
            >
              <Game />
            </EmpiricaContext>
          </div>
        </div>
      </EmpiricaParticipant>
    </>
  );
}
