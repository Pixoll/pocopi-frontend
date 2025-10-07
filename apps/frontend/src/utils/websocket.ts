import type {SendOptionEvent} from "@/hooks/useWebSocket.ts";

type WSMethods<SendOptionEvent> = {
  onOpen: () => Promise<void> | void;
  onData: (data: SendOptionEvent) => Promise<void> | void;
  onError?: () => Promise<void> | void;
  onClose: (event: CloseEvent) => Promise<void> | void;
};

export function openWS<T>({ onOpen, onData, onError, onClose }: WSMethods<T>): WebSocket {
  const socket = new WebSocket("ws://localhost:8080/ws/option-event");

  socket.onopen = () => {
    console.log(" WebSocket is connected");
    onOpen();
  };

  socket.onmessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log("WebSocket message", data);
    onData(data);
  };

  socket.onerror = (event) => {
    console.error("WebSocket error:", event);
    onError?.();
  };

  socket.onclose = (event) => {
    console.log("WebSocket closed:", event);
    onClose(event);
  };

  return socket;
}

export function sendEvent(ws: WebSocket, data: SendOptionEvent): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
    console.log("Sent:", data);
  } else {
    console.error("WS is not open. State:", ws.readyState);
  }
}

export function closeWS(ws: WebSocket): void {
  if (ws.readyState === WebSocket.OPEN) {
    console.log("Closing WebSocket...");
    ws.close();
  }
}