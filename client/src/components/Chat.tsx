import React, { useState, useEffect, useRef } from "react";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  timestamp: number;
}

export function Chat() {
  const player = usePlayer();
  const game = useGame();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load existing messages and auto-refresh every 5 seconds
  useEffect(() => {
    const updateMessages = () => {
      const chatHistory = (game.get("chatHistory") as unknown as ChatMessage[]) || [];
      setMessages(chatHistory);
    };

    // Initial load
    updateMessages();

    // Set up auto-refresh every 5 seconds
    const intervalId = setInterval(updateMessages, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [game]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: `${Date.now()}-${player.id}`,
      playerId: player.id,
      playerName: (player.get("identifier") as string) || `Player ${player.id.slice(-4)}`,
      text: message.trim(),
      timestamp: Date.now(),
    };

    // Add to game chat history
    const chatHistory = (game.get("chatHistory") as unknown as ChatMessage[]) || [];
    chatHistory.push(newMessage);
    game.set("chatHistory", chatHistory as any);

    // Clear input
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-800">Firm Communication</h3>
        <p className="text-xs text-gray-500">Chat with other firms</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.playerId === player.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 ${
                    isOwnMessage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {!isOwnMessage && (
                    <div className="text-xs font-semibold mb-1 opacity-75">
                      {msg.playerName}
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap break-words">
                    {msg.text}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      isOwnMessage ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            maxLength={500}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Send
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
