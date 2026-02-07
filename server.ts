import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import type { ClientEvent, ServerEvent } from "./src/types/chat";

const PORT = 3001;

interface ConnectedClient {
  ws: WebSocket;
  id: string;
  username: string | null;
  lastMessageTime: number;
}

const clients = new Map<WebSocket, ConnectedClient>();

const wss = new WebSocketServer({ port: PORT });

function broadcast(event: ServerEvent, exclude?: WebSocket) {
  const data = JSON.stringify(event);
  for (const [ws, client] of clients) {
    if (ws !== exclude && client.username && ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  }
}

function getActiveUsers(): string[] {
  const users: string[] = [];
  for (const client of clients.values()) {
    if (client.username) {
      users.push(client.username);
    }
  }
  return users;
}

function broadcastUsersList() {
  const event: ServerEvent = { event: "users-list", users: getActiveUsers() };
  const data = JSON.stringify(event);
  for (const [ws, client] of clients) {
    if (client.username && ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  }
}

wss.on("connection", (ws: WebSocket) => {
  const client: ConnectedClient = {
    ws,
    id: uuidv4(),
    username: null,
    lastMessageTime: 0,
  };
  clients.set(ws, client);

  ws.on("message", (raw: Buffer) => {
    let parsed: ClientEvent;
    try {
      parsed = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (parsed.event === "join") {
      const username = parsed.username.trim().slice(0, 20);
      if (username.length < 2) return;

      client.username = username;

      // Tell everyone this user joined
      broadcast({ event: "user-joined", username }, ws);

      // Send updated users list to all
      broadcastUsersList();
    }

    if (parsed.event === "message") {
      if (!client.username) return;

      const text = parsed.text.trim().slice(0, 500);
      if (!text) return;

      // Rate limit: 1 message per second
      const now = Date.now();
      if (now - client.lastMessageTime < 1000) return;
      client.lastMessageTime = now;

      const messageEvent: ServerEvent = {
        event: "message",
        id: uuidv4(),
        username: client.username,
        text,
        timestamp: now,
      };

      // Broadcast to ALL including sender
      broadcast(messageEvent);
    }
  });

  ws.on("close", () => {
    const username = client.username;
    clients.delete(ws);

    if (username) {
      broadcast({ event: "user-left", username });
      broadcastUsersList();
    }
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
