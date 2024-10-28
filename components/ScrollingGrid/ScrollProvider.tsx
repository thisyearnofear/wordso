// ScrollProvider.tsx
import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollContextValue {
  lenis: Lenis | null;
  updateScrollTrigger: () => void;
}

const ScrollContext = createContext<ScrollContextValue>({
  lenis: null,
  updateScrollTrigger: () => {},
});

export const useScroll = () => useContext(ScrollContext);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Define separate functions for ScrollTrigger update and raf
    const updateScrollTrigger = () => ScrollTrigger.update();
    const rafFunction = (time: number) => {
      lenisRef.current?.raf(time * 1000);
    };

    // Connect Lenis to GSAP
    lenisRef.current.on("scroll", updateScrollTrigger);

    // Update GSAP ticker with Lenis
    gsap.ticker.add(rafFunction);

    // Essential: stop smooth scrolling during GSAP animations
    const stopScroll = () => lenisRef.current?.stop();
    const startScroll = () => lenisRef.current?.start();

    ScrollTrigger.defaults({
      onEnter: stopScroll,
      onLeave: startScroll,
      onEnterBack: stopScroll,
      onLeaveBack: startScroll,
    });

    return () => {
      // Clean up
      if (lenisRef.current) {
        lenisRef.current.off("scroll", updateScrollTrigger);
        lenisRef.current.destroy();
        gsap.ticker.remove(rafFunction);
      }
      // Optionally, kill all ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <ScrollContext.Provider
      value={{
        lenis: lenisRef.current,
        updateScrollTrigger: () => ScrollTrigger.update(),
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};
