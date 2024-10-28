declare module "@studio-freight/lenis" {
  export interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    orientation?: "vertical" | "horizontal";
    gestureOrientation?: "vertical" | "horizontal";
    smoothWheel?: boolean;
    wheelMultiplier?: number;
    smoothTouch?: boolean;
    touchMultiplier?: number;
    infinite?: boolean;
  }

  export default class Lenis {
    constructor(options?: LenisOptions);
    on(event: string, callback: () => void): void; // Correctly typed without implementation
    raf(time: number): void;
    destroy(): void;
    start(): void; // Add start method
    stop(): void; // Add stop method
  }
}
