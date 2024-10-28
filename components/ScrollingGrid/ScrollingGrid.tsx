import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useScroll } from "./ScrollProvider";
import styles from "./ScrollingGrid.module.css";

const TOTAL_IMAGES = 50;

const ScrollingGrid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { updateScrollTrigger } = useScroll();

  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      if (!gridRef.current) return;

      const gridItems = gsap.utils.toArray<HTMLElement>(`.${styles.gridItem}`);
      const gridWrap = gridRef.current.querySelector(`.${styles.gridWrap}`);

      if (!gridWrap) return;

      // Create main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: updateScrollTrigger,
        },
      });

      // Set initial states
      gsap.set(gridWrap, {
        rotationY: 25,
        transformPerspective: 1000,
      });

      gsap.set(gridItems, {
        z: () => gsap.utils.random(-1500, 1500),
        rotationX: () => gsap.utils.random(-45, 45),
        rotationY: () => gsap.utils.random(-45, 45),
        opacity: 0,
      });

      // Animate grid wrap
      tl.to(gridWrap, {
        rotationY: -25,
        ease: "none",
      });

      // Batch animate grid items for better performance
      tl.to(gridItems, {
        z: (i) => gsap.utils.random(-500, 500),
        rotationX: 0,
        rotationY: 0,
        opacity: 1,
        duration: 1,
        stagger: {
          amount: 1,
          from: "random",
        },
        ease: "power2.inOut",
      });

      // Add hover animations
      const createHoverAnimation = (item: HTMLElement) => {
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl
          .to(item, {
            scale: 1.1,
            z: "+=50",
            duration: 0.3,
            ease: "power2.out",
          })
          .to(
            item.querySelector(`.${styles.gridItemInner}`),
            {
              scale: 1.1,
              duration: 0.3,
              ease: "power2.out",
            },
            0
          );
        return hoverTl;
      };

      gridItems.forEach((item) => {
        const hoverTl = createHoverAnimation(item);
        item.addEventListener("mouseenter", () => hoverTl.play());
        item.addEventListener("mouseleave", () => hoverTl.reverse());
      });
    });

    return () => {
      ctx.revert();

      // Clean up event listeners
      const gridItems = gsap.utils.toArray<HTMLElement>(`.${styles.gridItem}`);
      gridItems.forEach((item) => {
        item.removeEventListener("mouseenter", () => {});
        item.removeEventListener("mouseleave", () => {});
      });
    };
  }, [updateScrollTrigger]);

  return (
    <div className={styles.grid} ref={gridRef}>
      <div className={styles.gridWrap}>
        {Array.from({ length: TOTAL_IMAGES }, (_, index) => (
          <div className={styles.gridItem} key={index}>
            <div
              className={styles.gridItemInner}
              style={{
                backgroundImage: `url(/images/${index + 1}.png)`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingGrid;
