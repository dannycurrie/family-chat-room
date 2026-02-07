"use client";

import { useEffect, useRef } from "react";
import type { DisplayMessage } from "@/types/chat";

const USER_COLORS = [
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-pink-100",
  "bg-purple-100",
  "bg-orange-100",
  "bg-teal-100",
  "bg-indigo-100",
];

function getUserColor(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

interface MessageListProps {
  messages: DisplayMessage[];
  currentUser: string;
}

export default function MessageList({ messages, currentUser }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-gray-400 text-lg text-center">
          You&apos;re here! Send a message to whoever joins next.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => {
        if (msg.type === "system") {
          return (
            <div key={msg.id} className="text-center">
              <span className="text-sm text-gray-400 italic">{msg.text}</span>
            </div>
          );
        }

        const isOwn = msg.username === currentUser;

        return (
          <div
            key={msg.id}
            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm
                ${isOwn
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : `${getUserColor(msg.username)} text-gray-800`
                }`}
            >
              {!isOwn && (
                <p className="text-xs font-bold mb-0.5 opacity-75">
                  {msg.username}
                </p>
              )}
              <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
              <p
                className={`text-[11px] mt-1 ${
                  isOwn ? "text-white/70" : "text-gray-400"
                } text-right`}
              >
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
