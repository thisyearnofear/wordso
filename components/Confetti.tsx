import confetti, { type Options } from "canvas-confetti";
import { useEffect } from "react";

const defaultOptions: Options = {
  startVelocity: 30,
  spread: 360,
  ticks: 60,
  zIndex: 0,
};

function fire(min: number, max: number, particleCount: number) {
  void confetti({
    ...defaultOptions,
    particleCount,
    zIndex: 9999,
    origin: { x: randomInRange(min, max), y: Math.random() - 0.2 },
  });
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface ConfettiProps {
  duration?: number;
}

export function Confetti({ duration = 5000 }: ConfettiProps) {
  useEffect(() => {
    const animationEnd = Date.now() + duration;

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      fire(0.1, 0.3, particleCount);
      fire(0.7, 0.9, particleCount);
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, [duration]);

  return null;
}
