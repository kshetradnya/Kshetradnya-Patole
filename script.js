const stage = document.getElementById("portraitStage");
const mask = document.getElementById("portraitMask");

if (stage && mask) {
  const maxY = 95;
  const maxX = 10;

  const updateTilt = (clientX, clientY) => {
    const rect = stage.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;

    const rotateY = (px - 0.5) * maxY * 2;
    const rotateX = (0.5 - py) * maxX * 2;

    const clampedY = Math.max(-maxY, Math.min(maxY, rotateY));
    const clampedX = Math.max(-maxX, Math.min(maxX, rotateX));

    mask.style.transform = `rotateX(${clampedX.toFixed(2)}deg) rotateY(${clampedY.toFixed(2)}deg)`;
    mask.style.setProperty("--mx", `${(px * 100).toFixed(2)}%`);
    mask.style.setProperty("--my", `${(py * 100).toFixed(2)}%`);
  };

  stage.addEventListener("pointermove", (event) => {
    updateTilt(event.clientX, event.clientY);
  });

  stage.addEventListener("pointerleave", () => {
    mask.style.transform = "rotateX(0deg) rotateY(0deg)";
    mask.style.setProperty("--mx", "50%");
    mask.style.setProperty("--my", "20%");
  });

  // Subtle autonomous motion on touch devices where hover is unavailable.
  if (window.matchMedia("(hover: none)").matches) {
    let t = 0;
    const animate = () => {
      t += 0.014;
      const x = (Math.sin(t) * 0.5 + 0.5) * stage.clientWidth;
      const y = (Math.cos(t * 0.7) * 0.2 + 0.45) * stage.clientHeight;
      updateTilt(stage.getBoundingClientRect().left + x, stage.getBoundingClientRect().top + y);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    }
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -10% 0px"
  }
);

reveals.forEach((item) => observer.observe(item));
