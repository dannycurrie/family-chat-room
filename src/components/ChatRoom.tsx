"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { createWebSocket, sendEvent } from "@/lib/websocket";
import type { DisplayMessage, ServerEvent } from "@/types/chat";
import type PartySocket from "partysocket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import UsersList from "./UsersList";

const AVATARS = ["🦊", "🐱", "🐶", "🐸", "🐵", "🐰", "🐻", "🐼", "🦁", "🐯", "🐨", "🦄"];

function getDefaultAvatar(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATARS[Math.abs(hash) % AVATARS.length];
}

interface ChatRoomProps {
  username: string;
}

export default function ChatRoom({ username }: ChatRoomProps) {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [users, setUsers] = useState<{ username: string; avatar: string }[]>([]);
  const [connected, setConnected] = useState(false);
  const [avatar, setAvatar] = useState(() => getDefaultAvatar(username));
  const wsRef = useRef<PartySocket | null>(null);

  const handleEvent = useCallback((event: ServerEvent) => {
    switch (event.event) {
      case "user-joined":
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            text: `${event.username} joined the chat`,
            timestamp: Date.now(),
            type: "system",
          },
        ]);
        break;

      case "user-left":
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            text: `${event.username} left the chat`,
            timestamp: Date.now(),
            type: "system",
          },
        ]);
        break;

      case "message":
        setMessages((prev) => [
          ...prev,
          {
            id: event.id,
            username: event.username,
            avatar: event.avatar,
            text: event.text,
            timestamp: event.timestamp,
            type: "message",
          },
        ]);
        break;

      case "users-list":
        setUsers(event.users);
        break;
    }
  }, []);

  useEffect(() => {
    const ws = createWebSocket(
      username,
      avatar,
      handleEvent,
      () => setConnected(false)
    );

    ws.onopen = () => {
      setConnected(true);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
    // avatar is intentionally excluded — we only use the initial value on connect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, handleEvent]);

  const handleSend = (text: string) => {
    sendEvent(wsRef.current, { event: "message", text });
  };

  const handleAvatarChange = (newAvatar: string) => {
    setAvatar(newAvatar);
    sendEvent(wsRef.current, { event: "change-avatar", avatar: newAvatar });
  };

  const avatarMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const u of users) {
      map[u.username] = u.avatar;
    }
    return map;
  }, [users]);

  return (
    <div className="flex flex-col h-dvh bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Family Chat
        </h1>
        <div className="flex items-center gap-2">
          {connected ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm text-red-500">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Disconnected
            </span>
          )}
        </div>
      </header>

      {/* Users bar */}
      <div className="px-4 pt-3">
        <UsersList
          users={users}
          currentUser={username}
          onAvatarChange={handleAvatarChange}
        />
      </div>

      {/* Messages */}
      <MessageList messages={messages} currentUser={username} avatarMap={avatarMap} />

      {/* Input */}
      <MessageInput onSend={handleSend} />
    </div>
  );
}
