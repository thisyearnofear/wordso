import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ContainerRef, SectionRefs } from "../types/onchain-wordle";

export const useOnchainWordleAnimations = (
  containerRef: ContainerRef,
  sectionRefs: SectionRefs
) => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      sectionRefs.current.forEach((section) => {
        if (!section) return;

        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(section, {
          scale: 1.02,
          rotateX: "2deg",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          duration: 0.3,
          ease: "power2.out",
        });

        // Convert Promise-returning handlers to void functions
        const handleMouseEnter = () => {
          void hoverTl.play();
        };
        const handleMouseLeave = () => {
          void hoverTl.reverse();
        };

        section.addEventListener("mouseenter", handleMouseEnter);
        section.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          section.removeEventListener("mouseenter", handleMouseEnter);
          section.removeEventListener("mouseleave", handleMouseLeave);
        };
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, sectionRefs]); // Add missing dependencies
};
