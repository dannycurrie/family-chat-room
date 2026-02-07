"use client";

import { useState } from "react";

interface MessageInputProps {
  onSend: (text: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 p-4 bg-white/80 backdrop-blur border-t border-gray-200"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        maxLength={500}
        className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200
                   focus:border-purple-400 focus:outline-none focus:ring-3 focus:ring-purple-200
                   bg-white text-gray-800 placeholder-gray-400
                   transition-all duration-200"
        autoFocus
      />
      <button
        type="submit"
        className="px-6 py-3 font-bold text-white
                   bg-gradient-to-r from-purple-500 to-pink-500
                   hover:from-purple-600 hover:to-pink-600
                   rounded-2xl shadow-md hover:shadow-lg
                   active:scale-95 transition-all duration-200 cursor-pointer"
      >
        Send
      </button>
    </form>
  );
}
