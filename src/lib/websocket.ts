import type { ClientEvent, ServerEvent } from "@/types/chat";

const WS_URL = "ws://localhost:3001";

export function createWebSocket(
  onEvent: (event: ServerEvent) => void,
  onClose: () => void
): WebSocket {
  const ws = new WebSocket(WS_URL);

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
