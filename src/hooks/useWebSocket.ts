import { useEffect, useRef } from 'react';
import { openWS, sendEvent, closeWS } from "@/utils/websocket";

type UseWebSocketOptions<T> = {
  onOpen?: () => void;
  onData?: (data: T) => void;
  onError?: () => void;
  onClose?: (event: CloseEvent) => void;
};

export type SendOptionEvent = {
  optionId: number;
  username: string;
  type: 'deselect' | 'select' | 'hover';
};

export function useWebSocket<T>({ onOpen, onData, onError, onClose }: UseWebSocketOptions<T>) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = openWS({
      onOpen: onOpen || (() => {}),
      onData: onData || (() => {}),
      onError: onError || (() => {}),
      onClose: onClose || (() => {}),
    });

    return () => {
      if (socketRef.current) {
        closeWS(socketRef.current);
      }
    };
  }, []);

  const send = (data: SendOptionEvent) => {
    if (socketRef.current) {
      sendEvent(socketRef.current, data);
    }
  };

  return { send };
}
