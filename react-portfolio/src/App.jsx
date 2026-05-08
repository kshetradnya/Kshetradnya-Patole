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
        <h1>React Wrapper Enabled</h1>
        <p>Your current portfolio is now mounted inside a React app.</p>
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
