import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./OnchainWordle.module.css";

gsap.registerPlugin(ScrollTrigger);

interface InstructionSection {
  title: string;
  content: string;
  icon?: string;
  highlight?: string;
}

const instructionSections: InstructionSection[] = [
  {
    title: "Welcome to On-Chain Wordle",
    content: "Get ready for a blockchain-powered word guessing game!",
    icon: "🎮",
    highlight: "blockchain-powered",
  },
  {
    title: "How to Play",
    content:
      "Start with the off-chain version, then use image clues for the on-chain word.",
    icon: "🎯",
    highlight: "image clues",
  },
  {
    title: "Daily Challenge",
    content: "You get one on-chain guess every 24 hours. Make it count!",
    icon: "⏰",
    highlight: "24 hours",
  },
  {
    title: "Blockchain Integration",
    content:
      "Your guesses are recorded on the blockchain, ensuring fairness and transparency.",
    icon: "⛓️",
    highlight: "fairness and transparency",
  },
  {
    title: "Ready to Play?",
    content:
      "Scroll down to make your on-chain guess and join the crypto-word revolution!",
    icon: "🚀",
    highlight: "crypto-word revolution",
  },
];

const OnChainWordle: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      sectionRefs.current.forEach((section, index) => {
        if (!section) return;

        // Hover effect timeline
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(section, {
          scale: 1.02,
          rotateX: "2deg",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          duration: 0.3,
          ease: "power2.out",
        });

        // Mouseenter/leave events with cleanup
        const handleMouseEnter = () => hoverTl.play();
        const handleMouseLeave = () => hoverTl.reverse();

        section.addEventListener("mouseenter", handleMouseEnter);
        section.addEventListener("mouseleave", handleMouseLeave);

        // Clean up event listeners
        const cleanup = () => {
          section.removeEventListener("mouseenter", handleMouseEnter);
          section.removeEventListener("mouseleave", handleMouseLeave);
        };

        // Apply scroll animation
        gsap.fromTo(
          section,
          { opacity: 0, y: 50, rotateX: "10deg" },
          {
            opacity: 1,
            y: 0,
            rotateX: "0deg",
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top bottom-=100",
              end: "top center",
              toggleActions: "play none none reverse",
              onLeaveBack: cleanup,
            },
          }
        );

        // Animate highlights
        const highlight = section.querySelector(`.${styles.highlight}`);
        if (highlight) {
          gsap.fromTo(
            highlight,
            { backgroundSize: "0% 100%" },
            {
              backgroundSize: "100% 100%",
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top center+=100",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      // Input section animation
      const inputSection = containerRef.current.querySelector(
        `.${styles.placeholder}`
      );
      if (inputSection) {
        gsap.fromTo(
          inputSection,
          { opacity: 0, y: 100, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: inputSection,
              start: "top bottom-=100",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={`OnChainWordle ${styles.container}`} ref={containerRef}>
      {instructionSections.map((section, index) => (
        <section
          key={index}
          ref={(el) => {
            sectionRefs.current[index] = el; // Assignment only, no return
          }}
          className={styles.section}
        >
          <div className={styles.sectionContent}>
            <span className={styles.icon}>{section.icon}</span>
            <h2>{section.title}</h2>
            <p>
              {section.content
                .split(section.highlight || "")
                .map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className={styles.highlight}>
                        {section.highlight}
                      </span>
                    )}
                  </React.Fragment>
                ))}
            </p>
          </div>
        </section>
      ))}

      <div className={styles.placeholder}>
        <div className={styles.inputContainer}>
          <h2>On-Chain Wordle Game</h2>
          <p>Your on-chain Wordle interface will be implemented here.</p>
          <div className={styles.gameInterface}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter your guess"
              className={styles.guessInput}
              maxLength={5}
            />
            <button className={styles.submitButton}>
              Submit On-Chain Guess
              <span className={styles.buttonGlow} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnChainWordle;
