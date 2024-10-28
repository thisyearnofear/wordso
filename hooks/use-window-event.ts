import { useEffect, useRef } from "react";

export type EventHandler<K extends keyof WindowEventMap> = (
  ev: WindowEventMap[K]
) => void;

export function useWindowEvent<K extends keyof WindowEventMap>(
  eventName: K,
  handler: EventHandler<K>
): void {
  const savedHandler = useRef<EventHandler<K>>();
  const element = typeof window !== "undefined" ? window : undefined;

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element?.addEventListener;
    if (!isSupported) return;

    function eventListener(event: WindowEventMap[K]) {
      return savedHandler?.current?.(event);
    }
    element.addEventListener(eventName, eventListener);
    return () => element.removeEventListener(eventName, eventListener);
  }, [eventName, element]);
}
