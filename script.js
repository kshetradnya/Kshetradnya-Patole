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
const puzzleGiveUp = document.getElementById("puzzleGiveUp");
const projectGrid = document.getElementById("projectGrid");
const projectsPrev = document.getElementById("projectsPrev");
const projectsNext = document.getElementById("projectsNext");

if (puzzleIntro && puzzleStage) {
  const rows = 3;
  const cols = 3;
  const stageRect = puzzleStage.getBoundingClientRect();
  const pieceW = stageRect.width / cols;
  const pieceH = stageRect.height / rows;
  const snapDistance = Math.min(pieceW, pieceH) * 0.18;
  const pieces = [];
  const pieceState = new WeakMap();
  let solvedCount = 0;
  let activePiece = null;
  let grabOffsetX = 0;
  let grabOffsetY = 0;
  let targetDragX = 0;
  let targetDragY = 0;
  let dragFrame = 0;
  let introFinished = false;

  const endIntro = () => {
    if (introFinished) {
      return;
    }
    introFinished = true;
    window.setTimeout(() => {
      puzzleIntro.classList.add("done");
    }, 980);
  };

  const shatterPieces = () => {
    pieces.forEach((piece, index) => {
      const shatterX = (Math.random() - 0.5) * 1300;
      const shatterY = (Math.random() - 0.5) * 950;
      const shatterR = (Math.random() - 0.5) * 280;
      piece.style.setProperty("--sx", `${shatterX}px`);
      piece.style.setProperty("--sy", `${shatterY}px`);
      piece.style.setProperty("--sr", `${shatterR}deg`);
      piece.style.animationDelay = `${index * 16}ms`;
      piece.classList.add("shatter");
    });
    endIntro();
  };

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const targetX = c * pieceW;
      const targetY = r * pieceH;

      const slot = document.createElement("div");
      slot.className = "puzzle-slot";
      slot.style.width = `${pieceW}px`;
      slot.style.height = `${pieceH}px`;
      slot.style.left = `${targetX}px`;
      slot.style.top = `${targetY}px`;
      puzzleStage.appendChild(slot);

      const piece = document.createElement("div");
      piece.className = "puzzle-piece";
      const startX = Math.random() * (stageRect.width - pieceW);
      const startY = Math.random() * (stageRect.height - pieceH);
      piece.style.width = `${pieceW}px`;
      piece.style.height = `${pieceH}px`;
      piece.style.left = `${startX}px`;
      piece.style.top = `${startY}px`;
      piece.style.backgroundSize = `${stageRect.width}px ${stageRect.height}px`;
      piece.style.backgroundPosition = `${-targetX}px ${-targetY}px`;
      piece.dataset.targetX = String(targetX);
      piece.dataset.targetY = String(targetY);
      piece.dataset.locked = "false";
      pieceState.set(piece, { x: startX, y: startY });
      puzzleStage.appendChild(piece);
      pieces.push(piece);
    }
  }

  const pointerMove = (event) => {
    if (!activePiece) {
      return;
    }
    const bounds = puzzleStage.getBoundingClientRect();
    const x = event.clientX - bounds.left - grabOffsetX;
    const y = event.clientY - bounds.top - grabOffsetY;
    targetDragX = Math.max(0, Math.min(bounds.width - pieceW, x));
    targetDragY = Math.max(0, Math.min(bounds.height - pieceH, y));
  };

  const pointerUp = () => {
    if (!activePiece) {
      return;
    }
    activePiece.classList.remove("dragging");
    const targetX = Number(activePiece.dataset.targetX);
    const targetY = Number(activePiece.dataset.targetY);
    const state = pieceState.get(activePiece) || { x: 0, y: 0 };
    const currentX = state.x;
    const currentY = state.y;
    const distance = Math.hypot(currentX - targetX, currentY - targetY);

    if (distance <= snapDistance) {
      activePiece.style.left = `${targetX}px`;
      activePiece.style.top = `${targetY}px`;
      pieceState.set(activePiece, { x: targetX, y: targetY });
      activePiece.dataset.locked = "true";
      activePiece.classList.add("assembled");
      solvedCount += 1;
    }

    activePiece = null;

    if (solvedCount === pieces.length) {
      shatterPieces();
    }
  };

  puzzleStage.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.classList.contains("puzzle-piece")) {
      return;
    }
    if (target.dataset.locked === "true") {
      return;
    }
    activePiece = target;
    activePiece.classList.add("dragging");
    const pieceRect = target.getBoundingClientRect();
    grabOffsetX = event.clientX - pieceRect.left;
    grabOffsetY = event.clientY - pieceRect.top;
    targetDragX = parseFloat(target.style.left);
    targetDragY = parseFloat(target.style.top);
    target.style.zIndex = String(50 + solvedCount);
  });

  const animateDrag = () => {
    if (activePiece) {
      const state = pieceState.get(activePiece) || {
        x: parseFloat(activePiece.style.left) || 0,
        y: parseFloat(activePiece.style.top) || 0
      };
      state.x += (targetDragX - state.x) * 0.34;
      state.y += (targetDragY - state.y) * 0.34;
      activePiece.style.left = `${state.x}px`;
      activePiece.style.top = `${state.y}px`;
      pieceState.set(activePiece, state);
    }
    dragFrame = requestAnimationFrame(animateDrag);
  };
  dragFrame = requestAnimationFrame(animateDrag);

  window.addEventListener("pointermove", pointerMove);
  window.addEventListener("pointerup", pointerUp);

  if (puzzleGiveUp) {
    puzzleGiveUp.addEventListener("click", () => {
      puzzleIntro.classList.add("bombed");
      shatterPieces();
    });
  }
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

if (projectGrid && projectsPrev && projectsNext) {
  const getStep = () => Math.max(280, Math.floor(projectGrid.clientWidth * 0.92));
  projectsNext.addEventListener("click", () => {
    projectGrid.scrollBy({ left: getStep(), behavior: "smooth" });
  });
  projectsPrev.addEventListener("click", () => {
    projectGrid.scrollBy({ left: -getStep(), behavior: "smooth" });
  });
}

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

    const sideItems = window.gsap.utils.toArray(".side-scroll-item");
    sideItems.forEach((item, idx) => {
      window.gsap.fromTo(
        item,
        { x: idx % 2 === 0 ? -120 : 120, opacity: 0.2 },
        {
          x: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 84%",
            end: "top 52%",
            scrub: 1
          }
        }
      );
    });
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
