import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./ScrollingGrid.module.css";

const GRID_CONFIG = {
  TOTAL_IMAGES: 20,
  COLUMNS: 5,
  ROWS: 4,
} as const;

interface GridItemProps {
  index: number;
  className: string;
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ index, className }, ref) => (
    <div ref={ref} className={className}>
      <div
        className={styles.gridItemInner}
        style={{
          backgroundImage: `url(/images/${index + 1}.png)`,
        }}
      />
    </div>
  )
);

GridItem.displayName = "GridItem";

const ScrollingGrid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!gridRef.current) return;

    // Create a master timeline
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
    });

    // Initialize grid items with random positions
    itemsRef.current.forEach((item, index) => {
      if (!item) return;

      const depth = gsap.utils.random(-2000, 2000);
      const rotation = gsap.utils.random(-180, 180);

      gsap.set(item, {
        xPercent: gsap.utils.random(-200, 200),
        yPercent: gsap.utils.random(-200, 200),
        rotationX: gsap.utils.random(-90, 90),
        rotationY: gsap.utils.random(-90, 90),
        rotationZ: rotation,
        z: -1000,
        opacity: 0,
      });

      // Create individual timeline for each item
      const itemTl = gsap.timeline();

      itemTl
        .to(item, {
          xPercent: 0,
          yPercent: 0,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          z: depth,
          opacity: 1,
          duration: 2,
          ease: "power3.out",
        })
        .to(
          item.querySelector(`.${styles.gridItemInner}`),
          {
            scale: 1,
            duration: 1.5,
            ease: "power2.out",
          },
          "<"
        );

      // Add to master timeline with stagger
      masterTl.add(itemTl, index * 0.1);
    });

    // Add hover animations
    const handleMouseEnter = (item: HTMLDivElement) => {
      gsap.to(item, {
        z: 200,
        scale: 1.1,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = (item: HTMLDivElement) => {
      gsap.to(item, {
        z: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.in",
      });
    };

    // Attach event listeners and store cleanup functions
    itemsRef.current.forEach((item) => {
      if (item) {
        const onEnter = () => handleMouseEnter(item);
        const onLeave = () => handleMouseLeave(item);

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);

        // Cleanup listeners on unmount
        return () => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        };
      }
    });
  }, []);

  return (
    <div className={styles.grid} ref={gridRef}>
      <div
        className={styles.gridWrap}
        style={{
          gridTemplateColumns: `repeat(${GRID_CONFIG.COLUMNS}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_CONFIG.ROWS}, 1fr)`,
        }}
      >
        {Array.from({ length: GRID_CONFIG.TOTAL_IMAGES }, (_, index) => (
          <GridItem
            key={index}
            index={index}
            className={styles.gridItem}
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollingGrid;
