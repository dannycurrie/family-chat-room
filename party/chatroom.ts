import type * as Party from "partykit/server";
import type { ServerEvent } from "../src/types/chat";

const AVATARS = ["🦊", "🐱", "🐶", "🐸", "🐵", "🐰", "🐻", "🐼", "🦁", "🐯", "🐨", "🦄"];

function getDefaultAvatar(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATARS[Math.abs(hash) % AVATARS.length];
}

interface ConnectionState {
  username: string;
  avatar: string;
}

export default class ChatRoom implements Party.Server {
  constructor(readonly room: Party.Room) {}

  private lastMessageTime = new Map<string, number>();

  private getActiveUsers(): { username: string; avatar: string }[] {
    const users: { username: string; avatar: string }[] = [];
    for (const conn of this.room.getConnections<ConnectionState>()) {
      const state = conn.state;
      if (state?.username) {
        users.push({ username: state.username, avatar: state.avatar });
      }
    }
    return users;
  }

  private broadcast(event: ServerEvent, exclude?: string) {
    const data = JSON.stringify(event);
    for (const conn of this.room.getConnections<ConnectionState>()) {
      if (conn.id !== exclude && conn.state?.username) {
        conn.send(data);
      }
    }
  }

  private broadcastAll(event: ServerEvent) {
    const data = JSON.stringify(event);
    for (const conn of this.room.getConnections<ConnectionState>()) {
      if (conn.state?.username) {
        conn.send(data);
      }
    }
  }

  onConnect(conn: Party.Connection<ConnectionState>, ctx: Party.ConnectionContext) {
    const url = new URL(ctx.request.url);
    const username = url.searchParams.get("username")?.trim().slice(0, 20);

    if (!username || username.length < 2) {
      conn.close(4000, "Invalid username");
      return;
    }

    const avatarParam = url.searchParams.get("avatar");
    const avatar = avatarParam && AVATARS.includes(avatarParam)
      ? avatarParam
      : getDefaultAvatar(username);

    conn.setState({ username, avatar });

    // Tell everyone (except this user) that they joined
    this.broadcast({ event: "user-joined", username, avatar }, conn.id);

    // Send updated users list to all
    this.broadcastAll({ event: "users-list", users: this.getActiveUsers() });
  }

  onMessage(message: string, sender: Party.Connection<ConnectionState>) {
    const state = sender.state;
    if (!state?.username) return;

    let parsed: { event: string; text?: string; avatar?: string };
    try {
      parsed = JSON.parse(message);
    } catch {
      return;
    }

    if (parsed.event === "change-avatar") {
      const newAvatar = parsed.avatar;
      if (newAvatar && AVATARS.includes(newAvatar)) {
        sender.setState({ ...state, avatar: newAvatar });
        this.broadcastAll({ event: "users-list", users: this.getActiveUsers() });
      }
      return;
    }

    if (parsed.event !== "message") return;

    const text = (parsed.text ?? "").trim().slice(0, 500);
    if (!text) return;

    // Rate limit: 1 message per second
    const now = Date.now();
    const lastTime = this.lastMessageTime.get(sender.id) ?? 0;
    if (now - lastTime < 1000) return;
    this.lastMessageTime.set(sender.id, now);

    const messageEvent: ServerEvent = {
      event: "message",
      id: crypto.randomUUID(),
      username: state.username,
      avatar: state.avatar,
      text,
      timestamp: now,
    };

    // Broadcast to ALL including sender
    this.broadcastAll(messageEvent);
  }

  onClose(conn: Party.Connection<ConnectionState>) {
    const state = conn.state;
    this.lastMessageTime.delete(conn.id);

    if (state?.username) {
      this.broadcast({ event: "user-left", username: state.username, avatar: state.avatar }, conn.id);
      this.broadcastAll({ event: "users-list", users: this.getActiveUsers() });
    }
  }
}

ChatRoom satisfies Party.Worker;
