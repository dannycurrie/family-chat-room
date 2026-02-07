"use client";

import { useState, useRef, useEffect } from "react";

const AVATARS = ["🦊", "🐱", "🐶", "🐸", "🐵", "🐰", "🐻", "🐼", "🦁", "🐯", "🐨", "🦄"];

interface UsersListProps {
  users: { username: string; avatar: string }[];
  currentUser: string;
  onAvatarChange: (avatar: string) => void;
}

export default function UsersList({ users, currentUser, onAvatarChange }: UsersListProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    if (pickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [pickerOpen]);

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-md">
      <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-3">
        Online — {users.length}
      </h2>
      <div className="flex flex-wrap gap-2">
        {users.map((user) => {
          const isCurrentUser = user.username === currentUser;

          return (
            <div key={user.username} className="relative" ref={isCurrentUser ? pickerRef : undefined}>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5
                           bg-gradient-to-r from-purple-100 to-pink-100
                           rounded-full text-sm font-medium text-gray-700
                           ${isCurrentUser ? "cursor-pointer ring-2 ring-purple-300 hover:ring-purple-400" : ""}`}
                onClick={isCurrentUser ? () => setPickerOpen((v) => !v) : undefined}
              >
                <span>{user.avatar}</span>
                {user.username}
              </span>

              {isCurrentUser && pickerOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-2 grid grid-cols-4 gap-1 w-48">
                  {AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      className={`text-2xl p-2 rounded-lg hover:bg-purple-100 transition-colors
                                 ${emoji === user.avatar ? "bg-purple-200 ring-2 ring-purple-400" : ""}`}
                      onClick={() => {
                        onAvatarChange(emoji);
                        setPickerOpen(false);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {users.length === 0 && (
          <p className="text-gray-400 text-sm italic">No one here yet...</p>
        )}
      </div>
    </div>
  );
}
