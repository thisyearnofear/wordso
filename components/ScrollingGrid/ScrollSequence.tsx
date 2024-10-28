// ScrollSequence.tsx

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ScrollSequence.module.css";
import { InstructionSection } from "../OnchainWordle/OnchainWordle";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_IMAGES = 50;
const IMAGES_PER_SECTION = 10; // Number of images per section

interface ScrollSequenceProps {
  instructionSections: InstructionSection[];
  showInput?: boolean;
}

const ScrollSequence: React.FC<ScrollSequenceProps> = ({
  instructionSections,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<Array<HTMLDivElement | null>>([]);

  const getImagesForSection = (sectionIndex: number) => {
    const startIndex = sectionIndex * IMAGES_PER_SECTION;
    return Array.from({ length: IMAGES_PER_SECTION }, (_, i) => {
      const imageIndex = (startIndex + i) % TOTAL_IMAGES;
      return (
        <div className={styles.gridItem} key={i}>
          <div
            className={styles.gridItemInner}
            style={{
              backgroundImage: `url(/images/${imageIndex + 1}.png)`,
            }}
          />
        </div>
      );
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${window.innerHeight * (instructionSections.length + 0.5)}`, // Added extra space for input section
          scrub: 1,
          pin: true,
          pinSpacing: true,
        },
      });

      sectionsRef.current.forEach((section, index) => {
        if (!section) return;

        const images = section.querySelectorAll<HTMLElement>(
          `.${styles.gridItem}`
        );
        const text = section.querySelector<HTMLElement>(
          `.${styles.textSection}`
        );

        if (!text) return;

        // Set initial states
        gsap.set([images, text], {
          opacity: 0,
          y: 50,
        });

        // Create section timeline
        const sectionTl = gsap.timeline();

        // Fade in
        sectionTl
          .to(images, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
          })
          .to(
            text,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
            },
            "-=0.3"
          )
          // Fade out
          .to(
            [images, text],
            {
              opacity: 0,
              y: -50,
              duration: 0.5,
              ease: "power2.in",
            },
            "+=1"
          );

        // Add section timeline to master timeline
        masterTl.add(sectionTl, index * 2);
      });

      // Add specific animation for the final input section
      const inputSection = container.querySelector<HTMLElement>(
        `.${styles.inputSection}`
      );
      if (inputSection) {
        gsap.set(inputSection, {
          opacity: 0,
          y: 50,
          display: "block", // Ensure it's visible
        });

        masterTl.to(
          inputSection,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          `>-0.2`
        ); // Slightly overlap with last section
      }
    });

    return () => ctx.revert();
  }, [instructionSections.length]);

  return (
    <div ref={containerRef} className={styles.sequence}>
      {instructionSections.map((section, index) => (
        <div
          key={index}
          className={styles.section}
          ref={(el) => {
            if (el) sectionsRef.current[index] = el;
          }}
        >
          <div className={styles.grid}>
            <div className={styles.gridWrap}>{getImagesForSection(index)}</div>
          </div>
          <div className={styles.textSection}>
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </div>
        </div>
      ))}

      {/* Always render the input section */}
      <div className={styles.inputSection}>
        <h2>Make Your On-Chain Guess</h2>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Enter your guess"
            maxLength={5}
            className={styles.guessInput}
          />
          <button className={styles.submitButton}>Submit On-Chain Guess</button>
        </div>
      </div>
    </div>
  );
};

export default ScrollSequence;
