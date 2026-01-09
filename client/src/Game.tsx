import {
  usePlayer,
  usePlayers,
  useRound,
  useStage,
} from "@empirica/core/player/classic/react";
import React from "react";
import { Profile } from "./Profile";
import { Stage } from "./Stage";
import { ChatPanel } from "./components/ChatPanel";

export function Game() {
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const stage = useStage();

  if (!player || !players || !round || !stage) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Main game area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="h-full w-full flex">
          <div className="h-full w-full flex flex-col">
            <Profile />
            <div className="h-full flex items-center justify-center">
              <Stage />
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat panel on the right */}
      <ChatPanel position="right" />
    </div>
  );
}
