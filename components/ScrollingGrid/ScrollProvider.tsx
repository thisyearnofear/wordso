// ScrollProvider.tsx
import { ReactNode, useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollProviderProps {
  children: ReactNode;
}

export const ScrollProvider = ({ children }: ScrollProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Connect Lenis to GSAP
    lenisRef.current.on("scroll", ScrollTrigger.update);

    // Update GSAP ticker with Lenis
    gsap.ticker.add((time) => {
      lenisRef.current?.raf(time * 1000);
    });

    // Essential: stop smooth scrolling during GSAP animations
    ScrollTrigger.defaults({
      onEnter: () => lenisRef.current?.stop(), // Safely call stop if lenisRef.current is defined
      onLeave: () => lenisRef.current?.start(), // Safely call start if lenisRef.current is defined
      onEnterBack: () => lenisRef.current?.stop(), // Safely call stop if lenisRef.current is defined
      onLeaveBack: () => lenisRef.current?.start(), // Safely call start if lenisRef.current is defined
    });

    return () => {
      // Clean up: check if lenisRef.current is not null before calling methods
      if (lenisRef.current) {
        lenisRef.current.destroy();
        gsap.ticker.remove(lenisRef.current.raf); // Remove raf if it is a valid function
      }
    };
  }, []);

  return <>{children}</>;
};
