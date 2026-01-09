import React from "react";
import { Chat } from "./Chat";

interface ChatPanelProps {
  position?: "right" | "bottom";
}

export function ChatPanel({ position = "right" }: ChatPanelProps) {
  if (position === "bottom") {
    return (
      <div className="w-full h-64 border-t border-gray-200">
        <Chat />
      </div>
    );
  }

  return (
    <div className="w-80 h-full border-l border-gray-200">
      <Chat />
    </div>
  );
}
