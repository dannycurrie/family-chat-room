import type { ClientEvent, ServerEvent } from "@/types/chat";

function getWsUrl(): string {
  const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
  return `ws://${host}:3001`;
}

export function createWebSocket(
  onEvent: (event: ServerEvent) => void,
  onClose: () => void
): WebSocket {
  const ws = new WebSocket(getWsUrl());

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

export function sendEvent(ws: WebSocket | null, event: ClientEvent) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(event));
  }
}
