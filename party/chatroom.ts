import type * as Party from "partykit/server";
import type { ServerEvent } from "../src/types/chat";

interface ConnectionState {
  username: string;
}

export default class ChatRoom implements Party.Server {
  constructor(readonly room: Party.Room) {}

  private lastMessageTime = new Map<string, number>();

  private getActiveUsers(): string[] {
    const users: string[] = [];
    for (const conn of this.room.getConnections<ConnectionState>()) {
      const username = conn.state?.username;
      if (username) {
        users.push(username);
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

    conn.setState({ username });

    // Tell everyone (except this user) that they joined
    this.broadcast({ event: "user-joined", username }, conn.id);

    // Send updated users list to all
    this.broadcastAll({ event: "users-list", users: this.getActiveUsers() });
  }

  onMessage(message: string, sender: Party.Connection<ConnectionState>) {
    const username = sender.state?.username;
    if (!username) return;

    let parsed: { event: string; text?: string };
    try {
      parsed = JSON.parse(message);
    } catch {
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
      username,
      text,
      timestamp: now,
    };

    // Broadcast to ALL including sender
    this.broadcastAll(messageEvent);
  }

  onClose(conn: Party.Connection<ConnectionState>) {
    const username = conn.state?.username;
    this.lastMessageTime.delete(conn.id);

    if (username) {
      this.broadcast({ event: "user-left", username }, conn.id);
      this.broadcastAll({ event: "users-list", users: this.getActiveUsers() });
    }
  }
}

ChatRoom satisfies Party.Worker;
