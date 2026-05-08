import { TextScroll } from "./TextScroll";
import { SelectedWorks } from "./SelectedWorks";
import { motion, useScroll, useSpring } from "motion/react";

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="app-shell">
      <motion.div className="progress-bar" style={{ scaleX }} />
      <header className="react-head">
        <h1>Kshetradnya Patole</h1>
        <p>AI & ML Engineer crafting high-end cinematic web experiences. Bridging the gap between premium frontend architectures (React, Framer Motion) and complex machine learning algorithms. I build intelligent systems that wow users.</p>
      </header>

      <TextScroll />
      <SelectedWorks />

      <section className="site-frame-wrap">
        <iframe
          className="site-frame"
          src="/Kshetra.html"
          title="Kshetradnya Portfolio"
          loading="lazy"
        />
      </section>
    </main>
  );
}
