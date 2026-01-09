import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React from "react";
import { Game } from "./Game";
import { ExitSurvey } from "./intro-exit/ExitSurvey";
import { CustomOnboarding } from "./intro-exit/CustomOnboarding";
import { CustomConsent } from "./intro-exit/CustomConsent";
import { CustomLobby } from "./components/CustomLobby";
import { PlayerIdentifier } from "./components/PlayerIdentifier";

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";

  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;

  function introSteps({ game, player }: any) {
    return [CustomOnboarding, CustomConsent];
  }

  function exitSteps({ game, player }: any) {
    return [ExitSurvey];
  }

  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
      <div className="h-screen relative">
        <EmpiricaMenu position="bottom-left" />
        <div className="h-full overflow-auto">
          <EmpiricaContext 
            introSteps={introSteps} 
            exitSteps={exitSteps}
            lobby={CustomLobby}
            playerIdentifier={PlayerIdentifier}
          >
            <Game />
          </EmpiricaContext>
        </div>
      </div>
    </EmpiricaParticipant>
  );
}
