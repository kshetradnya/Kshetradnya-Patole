import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function TextScroll() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Create two opposing movements based on scroll
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);

  return (
    <div ref={containerRef} className="text-scroll-wrap">
      <motion.div style={{ x: x1 }} className="text-scroll-row">
        <span className="ts-solid">SELECTED</span>
        <span className="ts-outline">SELECTED</span>
        <span className="ts-solid">SELECTED</span>
        <span className="ts-outline">SELECTED</span>
        <span className="ts-solid">SELECTED</span>
      </motion.div>
      <motion.div style={{ x: x2 }} className="text-scroll-row">
        <span className="ts-outline">WORKS.</span>
        <span className="ts-solid">WORKS.</span>
        <span className="ts-outline">WORKS.</span>
        <span className="ts-solid">WORKS.</span>
        <span className="ts-outline">WORKS.</span>
      </motion.div>
    </div>
  );
}
