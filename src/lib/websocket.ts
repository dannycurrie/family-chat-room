import PartySocket from "partysocket";
import type { ClientEvent, ServerEvent } from "@/types/chat";

export function createWebSocket(
  username: string,
  avatar: string,
  onEvent: (event: ServerEvent) => void,
  onClose: () => void
): PartySocket {
  const host = process.env.NEXT_PUBLIC_PARTYKIT_HOST ?? "127.0.0.1:1999";

  const ws = new PartySocket({
    host,
    room: "main",
    query: { username, avatar },
  });

  ws.onmessage = (e) => {
    try {
      const event: ServerEvent = JSON.parse(e.data);
      onEvent(event);
    } catch {
      // Ignore malformed messages
    }
  };

  ws.onclose = onClose;

  return ws;
}

export function sendEvent(ws: PartySocket | null, event: ClientEvent) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(event));
  }
}
