"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WelcomeForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    if (trimmed.length > 20) {
      setError("Name must be 20 characters or less");
      return;
    }
    router.push(`/chat?username=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full max-w-sm">
      <div className="w-full">
        <input
          type="text"
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          maxLength={20}
          className="w-full px-6 py-4 text-xl rounded-2xl border-3 border-purple-300
                     focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200
                     bg-white text-gray-800 placeholder-gray-400
                     transition-all duration-200"
          autoFocus
        />
        {error && (
          <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full px-8 py-4 text-xl font-bold text-white
                   bg-gradient-to-r from-purple-500 to-pink-500
                   hover:from-purple-600 hover:to-pink-600
                   rounded-2xl shadow-lg hover:shadow-xl
                   transform hover:scale-105 active:scale-95
                   transition-all duration-200 cursor-pointer"
      >
        Join Chat
      </button>
    </form>
  );
}
