document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // UNIVERSE 1: THE PRO MODE (NOW DEFAULT)
  // ==========================================
  
  const ideUniverse = document.getElementById('ide-universe');
  const proUniverse = document.getElementById('pro-universe');
  const launchBtn = document.getElementById('launchIdeBtn');
  const exitIdeBtns = [document.getElementById('exitIdeBtn'), document.getElementById('exitIdeTopBtn')];

  // Initial State Enforcement
  if(ideUniverse) ideUniverse.style.display = 'none';
  if(proUniverse) proUniverse.style.display = 'block';

  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  
  const elements = gsap.utils.toArray('.gsap-fade-up');
  elements.forEach(el => gsap.set(el, { y: 60, opacity: 0 }));

  function initGsap() {
    ScrollTrigger.getAll().forEach(st => st.kill());
    elements.forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        scroller: ".pro-scroll-container",
        start: "top 85%",
        onEnter: () => {
          gsap.to(el, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", clearProps: "all" });
        },
        once: true
      });
    });
  }
  
  setTimeout(initGsap, 100);

  if (launchBtn) {
    launchBtn.addEventListener('click', () => {
      proUniverse.style.display = 'none';
      document.body.classList.add('ide-active');
      ideUniverse.classList.add('active');
      ideUniverse.style.display = 'flex';
      customCursor.style.display = 'none';
    });
  }

  exitIdeBtns.forEach(btn => {
    if(!btn) return;
    btn.addEventListener('click', () => {
      ideUniverse.classList.remove('active');
      ideUniverse.style.display = 'none';
      document.body.classList.remove('ide-active');
      proUniverse.style.display = 'block';
      customCursor.style.display = 'block';
    });
  });

  // CUSTOM MAGNETIC CURSOR & PROJECT HOVER
  const customCursor = document.getElementById('custom-cursor');
  const imageFollower = document.getElementById('image-follower');
  const projectRows = document.querySelectorAll('.project-row');

  document.addEventListener('mousemove', (e) => {
    if(document.body.classList.contains('ide-active')) return;
    
    // Smooth cursor movement
    gsap.to(customCursor, { x: e.clientX, y: e.clientY, duration: 0.1 });

    if (imageFollower && imageFollower.classList.contains('visible')) {
      gsap.to(imageFollower, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power2.out" });
    }
  });

  projectRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const img = row.getAttribute('data-img');
      if (imageFollower && img) {
        imageFollower.style.backgroundImage = `url(${img})`;
        imageFollower.classList.add('visible');
        imageFollower.classList.remove('ball-mode');
      }
      customCursor?.classList.add('hover');
    });
    row.addEventListener('mouseleave', () => {
      imageFollower?.classList.add('ball-mode'); // Curl back into ball
      setTimeout(() => {
        if (!imageFollower.classList.contains('visible')) {
            imageFollower?.classList.remove('visible');
        }
      }, 400);
      customCursor?.classList.remove('hover');
    });
  });

  // ==========================================
  // 📸 HOBBY CAMERA: EOS 13000D (30+ FEATURES)
  // ==========================================

  const HOBBIES_DATA = [
    { 
      id: 'photography', 
      title: 'Visual Storytelling', 
      desc: 'Capturing moments that tell a story beyond words.', 
      img: 'projects/hobby_photography.png', 
      stats: { shutter: '1/4000', aperture: 'ƒ/1.8', iso: '100' },
      meta: { file: 'PAT_0042.CR2', gps: '19.076° N, 72.877° E', color: 'CINEMATIC VIVID' }
    },
    { 
      id: 'running', 
      title: 'The Trail Runner', 
      desc: 'Escaping the simulation one kilometer at a time.', 
      img: 'projects/hobby_running.png', 
      stats: { shutter: '1/8000', aperture: 'ƒ/2.8', iso: '800' },
      meta: { file: 'PAT_0912.CR2', gps: '46.818° N, 8.227° E', color: 'RUGGED NATURAL' }
    },
    { 
      id: 'sports', 
      title: 'The Dual Strategy', 
      desc: 'Football on the grass, Chess on the wooden board.', 
      img: 'projects/hobby_sports_chess.png', 
      stats: { shutter: '1/2000', aperture: 'ƒ/4.0', iso: '400' },
      meta: { file: 'PAT_0543.CR2', gps: '51.507° N, 0.127° W', color: 'DYNAMIC SPORTS' }
    }
  ];

  let currentHobbyIdx = 0;
  let isCamOn = false;
  let batteryLevel = 98;

  const camLauncher = document.getElementById('cameraLauncherMini');
  const powerOverlay = document.getElementById('powerSwitchOverlay');
  const powerToggle = document.getElementById('mainPowerSwitch');
  const hobbyUniverse = document.getElementById('hobbyCameraUniverse');

  if (camLauncher) {
    camLauncher.addEventListener('click', () => {
      powerOverlay.style.display = 'flex';
      gsap.from('.switch-box', { scale: 0.8, opacity: 0, duration: 0.4, ease: "back.out" });
    });
  }

  if (powerToggle) {
    powerToggle.addEventListener('click', () => {
      powerToggle.classList.toggle('on');
      if (powerToggle.classList.contains('on')) {
        setTimeout(() => {
          powerOverlay.style.display = 'none';
          isCamOn = true;
          startCameraEngine();
        }, 600);
      }
    });
  }

  function startCameraEngine() {
    hobbyUniverse.style.display = 'flex';
    document.getElementById('lcdBootLoader').style.display = 'flex';
    document.getElementById('lcdContent').style.display = 'none';
    document.getElementById('lcdHud').style.opacity = '0';

    // Randomized Boot Sequence
    const bootTL = gsap.timeline({ onComplete: () => {
        document.getElementById('lcdBootLoader').style.display = 'none';
        document.getElementById('lcdContent').style.display = 'flex';
        gsap.to('#lcdHud', { opacity: 1, duration: 1 });
        initInteractiveFeatures();
        updateHobbyDisplay();
    }});

    bootTL.to('.boot-progress', { width: '100%', duration: 1.5, ease: "slow(0.7, 0.7, false)" });
  }

  function initInteractiveFeatures() {
    // 1. Stochastic Histogram
    const bars = document.querySelectorAll('.h-bar');
    gsap.to(bars, {
        height: () => (Math.random() * 80 + 10) + "%",
        duration: 0.2,
        repeat: -1,
        stagger: 0.05,
        ease: "none"
    });

    // 2. Face Tracking AI Simulation
    const focusBoxes = document.querySelectorAll('.focus-box');
    gsap.to(focusBoxes, {
        x: () => (Math.random() * 100 - 50),
        y: () => (Math.random() * 100 - 50),
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // 3. Spirit Level / Horizon
    gsap.to('.horizon-line', {
        rotation: () => (Math.random() * 4 - 2),
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });

    // 4. Battery drain simulation
    setInterval(() => {
        if(isCamOn && batteryLevel > 5) {
            batteryLevel -= 1;
            document.getElementById('batCap').innerText = batteryLevel + "%";
        }
    }, 15000);
  }

  function updateHobbyDisplay() {
    const data = HOBBIES_DATA[currentHobbyIdx];
    
    // UI Updates
    document.getElementById('hobbyImage').src = data.img;
    document.getElementById('hobbyTitle').innerText = data.title;
    document.getElementById('hobbyDesc').innerText = data.desc;
    
    // Stats Update
    document.getElementById('valShutter').innerText = data.stats.shutter;
    document.getElementById('valAperture').innerText = data.stats.aperture;
    document.getElementById('valIso').innerText = data.stats.iso;

    // Meta Update
    document.getElementById('fileName').innerText = data.meta.file;

    // Dots
    document.querySelectorAll('.hobby-dots .dot').forEach((dot, i) => dot.classList.toggle('active', i === currentHobbyIdx));
    
    // Scan Animation
    gsap.from('#hobbyImage', { scale: 1.1, filter: 'blur(10px)', duration: 1 });
  }

  function snapPhoto() {
    const flash = document.getElementById('lcdFlashOverlay');
    gsap.timeline()
        .set(flash, { opacity: 1 })
        .to(flash, { opacity: 0, duration: 0.4 })
        .to('.camera-body', { y: -10, duration: 0.1, yoyo: true, repeat: 1 });
  }

  // Event Listeners
  document.getElementById('physicalShutter')?.addEventListener('click', snapPhoto);
  document.getElementById('camRight')?.addEventListener('click', () => { currentHobbyIdx = (currentHobbyIdx + 1) % HOBBIES_DATA.length; updateHobbyDisplay(); });
  document.getElementById('camLeft')?.addEventListener('click', () => { currentHobbyIdx = (currentHobbyIdx - 1 + HOBBIES_DATA.length) % HOBBIES_DATA.length; updateHobbyDisplay(); });
  
  document.getElementById('exitLensBtn')?.addEventListener('click', () => {
    isCamOn = false;
    gsap.to('.camera-body', { scale: 0.8, opacity: 0, duration: 0.5, onComplete: () => {
      hobbyUniverse.style.display = 'none';
      powerToggle.classList.remove('on');
    }});
  });


});