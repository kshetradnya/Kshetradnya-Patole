import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function TextScroll() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Create two opposing movements based on scroll
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

  return (
    <div ref={containerRef} className="text-scroll-wrap">
      <motion.div style={{ x: x1 }} className="text-scroll-row">
        <span className="ts-solid">CREATIVE</span>
        <span className="ts-outline">FRONTEND</span>
        <span className="ts-solid">MOTION</span>
        <span className="ts-outline">STUDIO</span>
        <span className="ts-solid">CREATIVE</span>
        <span className="ts-outline">FRONTEND</span>
      </motion.div>
      <motion.div style={{ x: x2 }} className="text-scroll-row">
        <span className="ts-outline">NEURAL</span>
        <span className="ts-solid">NETWORKS</span>
        <span className="ts-outline">AI & ML</span>
        <span className="ts-solid">ARCHITECT</span>
        <span className="ts-outline">NEURAL</span>
        <span className="ts-solid">NETWORKS</span>
      </motion.div>
    </div>
  );
}
