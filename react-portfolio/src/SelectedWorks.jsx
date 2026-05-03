import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

const featuredProjects = [
  { 
    id: 1, 
    title: "Patole.in Portfolio", 
    img: "/projects/patole-new.png", 
    tags: ["React", "Tailwind", "GSAP"], 
    desc: "Cinematic Layered GSAP Experience featuring strict Neumorphic Soft UI design systems, interactive sliders, and custom frame-sequence video rendering." 
  },
  { 
    id: 2, 
    title: "Sparks Foundation", 
    img: "/projects/sparks.png", 
    tags: ["HTML", "CSS", "JS"], 
    desc: "Banking System Website for Sparks Foundation Internship.", 
    link: "https://kshetradnya.github.io/Sparks/" 
  },
  { 
    id: 3, 
    title: "Transform Editor", 
    img: "/projects/transform_preview.png", 
    tags: ["Canvas API", "AI"], 
    desc: "An AI-Powered Photo Grading application utilizing the Canvas API for high-performance image manipulation and filtering in the browser." 
  }
];

const allProjects = [
  ...featuredProjects,
  { 
    id: 4, 
    title: "Interactive ML Biology", 
    img: "/projects/biology_preview.png", 
    tags: ["Three.js", "Python"], 
    desc: "A WebGL Sandbox Simulation exploring biological patterns through machine learning algorithms and real-time rendering techniques." 
  }
];

export function SelectedWorks() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="react-works">
      <div className="rw-container">

        <div className="rw-grid">
          {featuredProjects.map((proj, i) => (
            <motion.div 
              key={proj.id}
              className="rw-card"
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
              whileHover={{ y: -10 }}
            >
              <div className="rw-img-wrap">
                <img src={proj.img} alt={proj.title} />
              </div>
              <div className="rw-info">
                <h3>{proj.title}</h3>
                <p>{proj.desc}</p>
                <div className="rw-tags">
                  {proj.tags.map(t => <span key={t}>{t}</span>)}
                </div>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer" className="rw-link">View Project</a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="rw-view-all"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <button onClick={() => setShowAll(true)} className="rw-btn">
            View All Selected Works
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showAll && (
          <motion.div 
            className="rw-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="rw-modal"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="rw-modal-head">
                <h2>All Projects</h2>
                <button onClick={() => setShowAll(false)}>Close</button>
              </div>
              
              <div className="rw-modal-grid">
                {allProjects.map((proj, i) => (
                  <motion.div
                    key={proj.id}
                    className="rw-modal-card"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <img src={proj.img} alt={proj.title} />
                    <div className="rw-m-info">
                      <h4>{proj.title}</h4>
                      <p>{proj.desc}</p>
                      {proj.link && <a href={proj.link} target="_blank" rel="noreferrer">Open</a>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
