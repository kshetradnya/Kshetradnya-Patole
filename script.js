const stage = document.getElementById("portraitStage");
const mask = document.getElementById("portraitMask");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const styleBtn = document.getElementById("styleBtn");
const themeBubble = document.getElementById("themeBubble");
const fluidCursor = document.getElementById("fluidCursor");
const fluidCursorTrail = document.getElementById("fluidCursorTrail");

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

  const updateHeadReveal = (clientX, clientY) => {
    const rect = mask.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * 100;
    const py = ((clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(0, Math.min(100, px));
    const clampedY = Math.max(0, Math.min(100, py));
    const trailSize =
      fluidCursorTrail && window.matchMedia("(hover: hover)").matches
        ? fluidCursorTrail.getBoundingClientRect().width * 0.5
        : 34;

    mask.style.setProperty("--reveal-x", `${clampedX.toFixed(2)}%`);
    mask.style.setProperty("--reveal-y", `${clampedY.toFixed(2)}%`);
    mask.style.setProperty("--reveal-size", `${trailSize.toFixed(2)}px`);
  };

  stage.addEventListener("pointerenter", (event) => {
    mask.classList.add("revealing");
    updateHeadReveal(event.clientX, event.clientY);
  });

  stage.addEventListener("pointermove", (event) => {
    updateTilt(event.clientX, event.clientY);
    updateHeadReveal(event.clientX, event.clientY);
  });

  stage.addEventListener("pointerleave", () => {
    mask.style.transform = "rotateX(0deg) rotateY(0deg)";
    mask.style.setProperty("--mx", "50%");
    mask.style.setProperty("--my", "20%");
    mask.classList.remove("revealing");
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

if (fluidCursor && fluidCursorTrail && window.matchMedia("(hover: hover)").matches) {
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let dotX = targetX;
  let dotY = targetY;
  let ringX = targetX;
  let ringY = targetY;

  document.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    fluidCursor.style.opacity = "1";
    fluidCursorTrail.style.opacity = "1";
  });

  document.addEventListener("pointerdown", () => {
    fluidCursor.style.transform = "translate3d(-50%, -50%, 0) scale(0.84)";
    fluidCursorTrail.style.transform = "translate3d(-50%, -50%, 0) scale(0.92)";
  });

  document.addEventListener("pointerup", () => {
    fluidCursor.style.transform = "translate3d(-50%, -50%, 0) scale(1)";
    fluidCursorTrail.style.transform = "translate3d(-50%, -50%, 0) scale(1)";
  });

  const animateCursor = () => {
    dotX += (targetX - dotX) * 0.35;
    dotY += (targetY - dotY) * 0.35;
    ringX += (targetX - ringX) * 0.16;
    ringY += (targetY - ringY) * 0.16;

    fluidCursor.style.left = `${dotX}px`;
    fluidCursor.style.top = `${dotY}px`;
    fluidCursorTrail.style.left = `${ringX}px`;
    fluidCursorTrail.style.top = `${ringY}px`;

    requestAnimationFrame(animateCursor);
  };

  requestAnimationFrame(animateCursor);
}
