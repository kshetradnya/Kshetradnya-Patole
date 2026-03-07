const stage = document.getElementById("portraitStage");
const mask = document.getElementById("portraitMask");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const styleBtn = document.getElementById("styleBtn");
const themeBubble = document.getElementById("themeBubble");

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

  if (window.matchMedia("(hover: none)").matches) {
    let t = 0;
    const animate = () => {
      t += 0.014;
      const bounds = stage.getBoundingClientRect();
      const x = (Math.sin(t) * 0.5 + 0.5) * stage.clientWidth;
      const y = (Math.cos(t * 0.7) * 0.2 + 0.45) * stage.clientHeight;
      updateTilt(bounds.left + x, bounds.top + y);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
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

const themes = [
  { key: "theme-elegant", label: "Elegant" },
  { key: "theme-scrapbook", label: "Scrapbook" },
  { key: "theme-waves", label: "Waves" }
];

let activeTheme = themes[0];
let bubbleTimeout;

const applyTheme = (theme) => {
  document.body.classList.remove(...themes.map((t) => t.key));
  document.body.classList.add(theme.key);
  activeTheme = theme;
};

const showThemeBubble = (label) => {
  if (!themeBubble) {
    return;
  }

  themeBubble.textContent = `This is ${label} style. The current style is ${label}.`;
  themeBubble.classList.add("show");

  window.clearTimeout(bubbleTimeout);
  bubbleTimeout = window.setTimeout(() => {
    themeBubble.classList.remove("show");
  }, 2200);
};

if (styleBtn) {
  styleBtn.addEventListener("click", () => {
    const available = themes.filter((theme) => theme.key !== activeTheme.key);
    const next = available[Math.floor(Math.random() * available.length)];
    applyTheme(next);
    showThemeBubble(next.label);
  });
}

showThemeBubble(activeTheme.label);
