import React, { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import styles from "./ScrollSequence.module.css";

interface ScrollSequenceProps {
  children: ReactNode[];
}

const ScrollSequence: React.FC<ScrollSequenceProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<Array<HTMLDivElement | null>>([]);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenisOptions = {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical" as const,
      gestureOrientation: "vertical" as const,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    };

    lenisRef.current = new Lenis(lenisOptions);

    function raf(time: number) {
      if (lenisRef.current) {
        lenisRef.current.raf(time);
      }
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (lenisRef.current) {
      lenisRef.current.on("scroll", () => {
        ScrollTrigger.update();
      });
    }

    const updateLenis = (time: number) => {
      if (lenisRef.current) {
        lenisRef.current.raf(time * 1000);
      }
    };

    gsap.ticker.add(updateLenis);

    const ctx = gsap.context(() => {
      const sections = sectionsRef.current.filter(
        (section): section is HTMLDivElement => section !== null
      );

      // Create a timeline for each section
      sections.forEach((section, index) => {
        // Base visibility timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
          },
        });

        // Initial state
        gsap.set(section, {
          opacity: index === 0 ? 1 : 0,
          y: 50,
          scale: 0.95,
        });

        // Animation for entering viewport
        tl.to(section, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        });

        // Special handling for the first section (game)
        if (index === 0) {
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              // Gradually fade out and scale down as we scroll away
              const progress = self.progress;
              gsap.to(section, {
                opacity: 1 - progress * 0.5, // Don't fade completely
                scale: 1 - progress * 0.1,
                y: progress * -30,
                duration: 0,
                overwrite: true,
              });
            },
            onLeave: () => {
              gsap.to(section, {
                opacity: 0.5,
                scale: 0.9,
                duration: 0.3,
              });
            },
            onEnterBack: () => {
              gsap.to(section, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.3,
              });
            },
          });
        }
      });

      // Navigation
      const nav = document.createElement("div");
      nav.className = styles.navigation;
      nav.style.cssText =
        "position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 1000;";

      sections.forEach((section) => {
        const button = document.createElement("button");
        button.className = styles.navButton;
        button.onclick = () => {
          if (section) {
            if (lenisRef.current) {
              lenisRef.current.stop();
            }

            section.scrollIntoView({ behavior: "smooth" });

            setTimeout(() => {
              if (lenisRef.current) {
                lenisRef.current.start();
              }
            }, 1000);
          }
        };
        nav.appendChild(button);
      });

      document.body.appendChild(nav);

      // Update active navigation button
      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onToggle: ({ isActive }) => {
            const button = nav.children[index] as HTMLButtonElement;
            if (isActive) {
              button.classList.add(styles.active);
            } else {
              button.classList.remove(styles.active);
            }
          },
        });
      });

      return () => {
        document.body.removeChild(nav);
      };
    }, containerRef);

    return () => {
      ctx.revert();
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      gsap.ticker.remove(updateLenis);
    };
  }, [children.length]);

  return (
    <div ref={containerRef} className={styles.container}>
      {React.Children.map(children, (child, index) => (
        <div
          ref={(el) => {
            sectionsRef.current[index] = el;
          }}
          className={styles.section}
          key={index}
          style={{
            position: "relative",
            zIndex: children.length - index, // Higher sections stay on top
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default ScrollSequence;
