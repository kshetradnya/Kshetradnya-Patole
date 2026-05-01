// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// Integrate Lenis with GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
});

gsap.ticker.lagSmoothing(0);

// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const hoverTargets = document.querySelectorAll('.hover-target');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Instant cursor follow
  gsap.to(cursor, {
    x: mouseX,
    y: mouseY,
    duration: 0.1,
    ease: "power2.out"
  });
});

// Smooth follower logic
gsap.ticker.add(() => {
  followerX += (mouseX - followerX) * 0.15;
  followerY += (mouseY - followerY) * 0.15;
  
  gsap.set(follower, {
    x: followerX,
    y: followerY
  });
});

// Hover effects
hoverTargets.forEach(target => {
  target.addEventListener('mouseenter', (e) => {
    follower.classList.add('hover-active');
    const customText = target.getAttribute('data-cursor');
    if (customText) {
      follower.setAttribute('data-text', customText);
      cursor.style.opacity = '0';
    } else {
      follower.setAttribute('data-text', '');
    }
  });
  
  target.addEventListener('mouseleave', () => {
    follower.classList.remove('hover-active');
    follower.setAttribute('data-text', '');
    cursor.style.opacity = '1';
  });
});

// Animations
const tl = gsap.timeline();

tl.fromTo('.role-badge', 
  { y: 20, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
)
.fromTo('.hero-title .line',
  { y: 150, opacity: 0 },
  { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'expo.out' },
  '-=0.8'
)
.fromTo('.scroll-indicator',
  { y: 20, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
  '-=0.5'
);

// Scroll Animations
const fadeUps = document.querySelectorAll('.fade-up:not(.role-badge):not(.scroll-indicator)');

fadeUps.forEach(el => {
  gsap.fromTo(el,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );
});

// About Text specific fade
const aboutText = document.querySelector('.about-text');
if (aboutText) {
  gsap.fromTo(aboutText, 
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: aboutText,
        start: 'top 80%',
      }
    }
  );
}

// Project Images Parallax
const projectImages = document.querySelectorAll('.project-image img');
projectImages.forEach(img => {
  gsap.to(img, {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: img.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
});

// Certificates Modal Logic
const openBtn = document.getElementById('openCertsBtn');
const closeBtn = document.getElementById('closeCertsBtn');
const certModal = document.getElementById('certModal');

let modalTl = gsap.timeline({ paused: true });
modalTl.to(certModal, {
  y: 0,
  duration: 0.8,
  ease: 'power4.inOut'
})
.fromTo('.cert-card', 
  { y: 40, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
  '-=0.3'
);

openBtn.addEventListener('click', () => {
  certModal.style.display = 'flex';
  lenis.stop(); // Disable scrolling on main page
  modalTl.play();
});

closeBtn.addEventListener('click', () => {
  modalTl.reverse().then(() => {
    lenis.start(); // Re-enable scrolling
  });
});

// Text Scramble Effect
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud" style="opacity:0.3">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

const phrases = [
  "Transitioning from pure web development into core AI mechanics.",
  "Focusing on neural network architectures.",
  "Building high-performance data pipelines.",
  "Obsessed with building seamless full-stack ecosystems."
];

const el = document.querySelector('.scramble-text');
if (el) {
  const fx = new TextScramble(el);
  let counter = 0;
  const next = () => {
    fx.setText(phrases[counter]).then(() => {
      setTimeout(next, 3000);
    });
    counter = (counter + 1) % phrases.length;
  };
  // Start the scramble sequence after a short delay
  setTimeout(next, 1000);
}

// Magnetic Elements
const magnetics = document.querySelectorAll('.magnetic-pill, .magnetic-btn');
magnetics.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.4,
      ease: 'power2.out'
    });
  });
  
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)'
    });
  });
});