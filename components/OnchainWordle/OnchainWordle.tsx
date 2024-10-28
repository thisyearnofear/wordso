// OnchainWordle.tsx

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScroll } from "../ScrollingGrid/ScrollProvider";
import styles from "./OnchainWordle.module.css";

export interface InstructionSection {
  title: string;
  content: string;
}

interface OnChainWordleProps {
  instructionSections: InstructionSection[];
}

const OnChainWordle: React.FC<OnChainWordleProps> = ({
  instructionSections,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);
  const { updateScrollTrigger } = useScroll();

  const setRef = useCallback((el: HTMLElement | null, index: number) => {
    sectionsRef.current[index] = el;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Create main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: updateScrollTrigger,
        },
      });

      sectionsRef.current.forEach((section, index) => {
        if (!section) return;

        const title = section.querySelector("h2");
        const content = section.querySelector("p");

        // Set initial states
        gsap.set([title, content], {
          opacity: 0,
          y: 100,
          rotationX: 45,
          transformPerspective: 1000,
        });

        // Add section animations to main timeline
        tl.addLabel(`section${index}`)
          .to(title, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            ease: "power2.out",
          })
          .to(
            content,
            {
              opacity: 1,
              y: 0,
              rotationX: 0,
              duration: 1,
              ease: "power2.out",
            },
            "<+=0.2"
          )
          .to(
            [title, content],
            {
              opacity: 0,
              y: -50,
              duration: 0.5,
              ease: "power2.in",
            },
            "+=2"
          );
      });
    });

    return () => ctx.revert();
  }, [updateScrollTrigger]);

  const sections = useMemo(
    () =>
      instructionSections.map((section, index) => (
        <section
          key={index}
          ref={(el) => setRef(el, index)}
          className={styles.section}
        >
          <h2>{section.title}</h2>
          <p>{section.content}</p>
        </section>
      )),
    [instructionSections, setRef]
  );

  return (
    <div className={styles.container} ref={containerRef}>
      {sections}
      <div className={styles.inputSection}>
        <h2>Make Your On-Chain Guess</h2>
        <input type="text" placeholder="Enter your guess" maxLength={5} />
        <button>Submit On-Chain Guess</button>
      </div>
    </div>
  );
};

export default OnChainWordle;
