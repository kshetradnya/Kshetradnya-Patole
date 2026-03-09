const stage = document.getElementById("portraitStage");
const mask = document.getElementById("portraitMask");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const styleBtn = document.getElementById("styleBtn");
const themeBubble = document.getElementById("themeBubble");
const fluidCursor = document.getElementById("fluidCursor");
const fluidCursorTrail = document.getElementById("fluidCursorTrail");
const puzzleIntro = document.getElementById("puzzleIntro");
const puzzleStage = document.getElementById("puzzleStage");

if (puzzleIntro && puzzleStage) {
  const rows = 5;
  const cols = 4;
  const pieceW = 100 / cols;
  const pieceH = 100 / rows;
  const pieces = [];

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const piece = document.createElement("div");
      piece.className = "puzzle-piece";
      piece.style.setProperty("--pw", `${pieceW}%`);
      piece.style.setProperty("--ph", `${pieceH}%`);
      piece.style.setProperty("--px", `${c * pieceW}%`);
      piece.style.setProperty("--py", `${r * pieceH}%`);
      piece.style.setProperty("--bx", `${(c / (cols - 1)) * 100}%`);
      piece.style.setProperty("--by", `${(r / (rows - 1)) * 100}%`);
      const scatterX = (Math.random() - 0.5) * 1100;
      const scatterY = (Math.random() - 0.5) * 760;
      const scatterR = (Math.random() - 0.5) * 120;
      piece.style.transform = `translate3d(${scatterX}px, ${scatterY}px, 0) rotate(${scatterR}deg)`;
      piece.style.transitionDelay = `${(r + c) * 28}ms`;
      puzzleStage.appendChild(piece);
      pieces.push(piece);
    }
  }

  requestAnimationFrame(() => {
    pieces.forEach((piece) => piece.classList.add("assembled"));
  });

  window.setTimeout(() => {
    pieces.forEach((piece, index) => {
      const shatterX = (Math.random() - 0.5) * 1300;
      const shatterY = (Math.random() - 0.5) * 950;
      const shatterR = (Math.random() - 0.5) * 240;
      piece.style.transitionDelay = `${index * 12}ms`;
      piece.style.transform = `translate3d(${shatterX}px, ${shatterY}px, 0) rotate(${shatterR}deg)`;
      piece.classList.add("shatter");
    });
    puzzleIntro.classList.add("done");
  }, 1850);
}

if (stage && mask) {
  const maxY = 4;
  const maxX = 1.2;

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
        ? fluidCursorTrail.getBoundingClientRect().width * 0.9
        : 52;

    mask.style.setProperty("--reveal-x", `${clampedX.toFixed(2)}%`);
    mask.style.setProperty("--reveal-y", `${clampedY.toFixed(2)}%`);
    mask.style.setProperty("--reveal-size", `${trailSize.toFixed(2)}px`);
  };

  mask.addEventListener("pointerenter", (event) => {
    mask.classList.add("revealing");
    updateHeadReveal(event.clientX, event.clientY);
  });

  stage.addEventListener("pointermove", (event) => {
    updateTilt(event.clientX, event.clientY);
  });

  mask.addEventListener("pointermove", (event) => {
    updateHeadReveal(event.clientX, event.clientY);
  });

  mask.addEventListener("pointerleave", () => {
    mask.classList.remove("revealing");
    mask.style.setProperty("--reveal-size", "0px");
  });

  stage.addEventListener("pointerleave", () => {
    mask.style.transform = "rotateX(0deg) rotateY(0deg)";
    mask.style.setProperty("--mx", "50%");
    mask.style.setProperty("--my", "20%");
  });

  if (window.matchMedia("(hover: none)").matches) {
    let t = 0;
    const animate = () => {
      t += 0.009;
      const bounds = stage.getBoundingClientRect();
      const x = (Math.sin(t) * 0.24 + 0.5) * stage.clientWidth;
      const y = (Math.cos(t * 0.65) * 0.08 + 0.46) * stage.clientHeight;
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

const nameExplode = document.querySelectorAll(".name-explode");
if (nameExplode.length > 0) {
  nameExplode.forEach((node) => {
    const label = node.textContent || "";
    node.textContent = "";
    for (const char of label) {
      const span = document.createElement("span");
      span.className = "killer-letter";
      span.textContent = char === " " ? "\u00A0" : char;
      node.appendChild(span);
    }
  });

  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    const letters = document.querySelectorAll(".name-explode .killer-letter");
    const heroHeading = document.querySelector(".hero h1");

    window.gsap.set(letters, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 });

    if (heroHeading) {
      const explosion = window.gsap.timeline({
        scrollTrigger: {
          trigger: heroHeading,
          start: "top 46%",
          end: "+=460",
          scrub: 1
        }
      });

      explosion.to(letters, {
        x: () => window.gsap.utils.random(-190, 190),
        y: () => window.gsap.utils.random(-130, 130),
        rotation: () => window.gsap.utils.random(-150, 150),
        opacity: 0.14,
        scale: () => window.gsap.utils.random(0.72, 1.32),
        ease: "power3.out",
        stagger: {
          each: 0.014,
          from: "random"
        }
      });
    }
  }
}

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
