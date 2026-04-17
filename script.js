document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // UNIVERSE 1: THE PRO MODE (NOW DEFAULT)
  // ==========================================
  
  const ideUniverse = document.getElementById('ide-universe');
  const proUniverse = document.getElementById('pro-universe');
  const launchBtn = document.getElementById('launchIdeBtn');
  const exitIdeBtns = [document.getElementById('exitIdeBtn'), document.getElementById('exitIdeTopBtn')];

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
      proUniverse.classList.remove('active');
      setTimeout(() => {
        document.body.classList.add('ide-active');
        ideUniverse.classList.add('active');
      }, 600);
    });
  }

  exitIdeBtns.forEach(btn => {
    if(!btn) return;
    btn.addEventListener('click', () => {
      ideUniverse.classList.remove('active');
      document.body.classList.remove('ide-active');
      setTimeout(() => proUniverse.classList.add('active'), 600);
    });
  });

  // CUSTOM MAGNETIC CURSOR
  const customCursor = document.getElementById('custom-cursor');
  document.addEventListener('mousemove', (e) => {
    if(document.body.classList.contains('ide-active')) return;
    if(customCursor) {
      customCursor.style.left = e.clientX + 'px';
      customCursor.style.top = e.clientY + 'px';
    }
  });

  // ==========================================
  // 📸 HOBBY CAMERA: EOS 13000D WITH SWITCH
  // ==========================================

  const HOBBIES_DATA = [
    { id: 'photography', title: 'Visual Storytelling', desc: 'Capturing moments that tell a story beyond words. My lens, my rules!', img: 'projects/hobby_photography.png', stats: { iso: '100', aperture: 'f/1.8', shutter: '1/4000' }, funFact: 'POW! Captured in 0.01s!' },
    { id: 'running', title: 'The Trail Runner', desc: 'Escaping the simulation one kilometer at a time. Pure adrenaline!', img: 'projects/hobby_running.png', stats: { iso: '800', aperture: 'f/2.8', shutter: '1/8000' }, funFact: 'ZAP! Speeding through reality.' },
    { id: 'sports', title: 'Goal & Checkmate', desc: 'Football on the field, Chess on the board. The duality of strategy.', img: 'projects/hobby_sports_chess.png', stats: { iso: '400', aperture: 'f/4.0', shutter: '1/2000' }, funFact: 'BOOM! Strategic dominance!' }
  ];

  let currentHobbyIdx = 0;
  let camZoom = 1;

  const camLauncher = document.getElementById('cameraLauncher');
  const powerOverlay = document.getElementById('powerSwitchOverlay');
  const powerToggle = document.getElementById('mainPowerSwitch');
  const hobbyUniverse = document.getElementById('hobbyCameraUniverse');
  const trans = document.getElementById('hobbyTransition');

  if (camLauncher) {
    camLauncher.addEventListener('click', () => {
      powerOverlay.style.display = 'flex';
      gsap.from('.switch-box', { scale: 0.5, opacity: 0, duration: 0.5, ease: "back.out" });
    });
  }

  if (powerToggle) {
    powerToggle.addEventListener('click', () => {
      powerToggle.classList.toggle('on');
      if (powerToggle.classList.contains('on')) {
        setTimeout(() => {
          powerOverlay.style.display = 'none';
          triggerCameraIntro();
        }, 800);
      }
    });
  }

  function triggerCameraIntro() {
    if (trans) trans.style.display = 'flex';
    gsap.set(['.left-half', '.right-half'], { x: '0%' });
    gsap.to('.pull-text', { scale: 1, opacity: 1, duration: 0.5, ease: "back.out" });

    const tl = gsap.timeline({ onComplete: () => {
        hobbyUniverse.style.display = 'flex';
        initCamera();
    }});

    tl.to('.left-half', { x: '-100%', duration: 1.5, ease: "power4.inOut" }, "+=0.3")
      .to('.right-half', { x: '100%', duration: 1.5, ease: "power4.inOut" }, "<")
      .to('.pull-text', { opacity: 0, scale: 2, duration: 0.5 }, "<0.2");
  }

  function initCamera() {
    gsap.set('.camera-body', { scale: 1, opacity: 1 });
    gsap.from('.camera-body', { scale: 0.8, opacity: 0, duration: 0.8, ease: "back.out" });
    document.getElementById('lcdBootLoader').style.display = 'flex';
    document.getElementById('lcdContent').style.display = 'none';
    setTimeout(() => {
      document.getElementById('lcdBootLoader').style.display = 'none';
      document.getElementById('lcdContent').style.display = 'flex';
      updateHobbyDisplay();
    }, 2000);
  }

  function updateHobbyDisplay() {
    const data = HOBBIES_DATA[currentHobbyIdx];
    document.getElementById('hobbyImage').src = data.img;
    document.getElementById('hobbyTitle').innerText = data.title;
    document.getElementById('hobbyDesc').innerText = data.desc;
    document.getElementById('hobbyFunFact').innerText = data.funFact;
    document.querySelectorAll('.hobby-dots .dot').forEach((dot, i) => dot.classList.toggle('active', i === currentHobbyIdx));
  }

  function snapPhoto() {
    gsap.fromTo('.camera-body', { x: -5 }, { x: 5, duration: 0.05, repeat: 5, yoyo: true });
    const flash = document.getElementById('lcdFlashOverlay');
    gsap.set(flash, { opacity: 1 });
    gsap.to(flash, { opacity: 0, duration: 0.5 });
  }

  document.getElementById('physicalShutter')?.addEventListener('click', snapPhoto);
  document.getElementById('camRight')?.addEventListener('click', () => { currentHobbyIdx = (currentHobbyIdx + 1) % HOBBIES_DATA.length; updateHobbyDisplay(); });
  document.getElementById('camLeft')?.addEventListener('click', () => { currentHobbyIdx = (currentHobbyIdx - 1 + HOBBIES_DATA.length) % HOBBIES_DATA.length; updateHobbyDisplay(); });
  document.getElementById('exitLensBtn')?.addEventListener('click', () => {
    gsap.to('.camera-body', { scale: 0.5, opacity: 0, duration: 0.5, onComplete: () => {
      hobbyUniverse.style.display = 'none';
      if (trans) trans.style.display = 'none';
      powerToggle.classList.remove('on');
    }});
  });

  // ==========================================
  // 🔥 VALORANT HOBBY: PROTOCOL 1
  // ==========================================

  const gamingLauncher = document.getElementById('gamingLauncher');
  const valUniverse = document.getElementById('valHobbyUniverse');
  const flashCont = document.getElementById('valFlashContainer');
  const flashSprite = document.getElementById('valFlashProjectile');
  const flashWhite = document.getElementById('valFlashWhiteout');

  if (gamingLauncher) {
    gamingLauncher.addEventListener('click', () => {
      flashCont.style.display = 'block';
      
      // Phoenix-style entry
      const tl = gsap.timeline();
      tl.set(flashSprite, { x: -200, y: window.innerHeight, scale: 0.5, opacity: 1 })
        .to(flashSprite, { 
          bezier: { values: [{x: -200, y: window.innerHeight}, {x: window.innerWidth/2, y: window.innerHeight/2}, {x: window.innerWidth/2, y: window.innerHeight/2}]},
          duration: 0.6, ease: "power2.out" 
        })
        .to(flashSprite, { scale: 15, duration: 0.3, ease: "expo.in" })
        .to(flashWhite, { opacity: 1, duration: 0.1 }, "-=0.1")
        .set(valUniverse, { display: 'flex' })
        .to(flashWhite, { opacity: 0, duration: 1.5, ease: "power2.out", onComplete: () => {
            flashCont.style.display = 'none';
            initValProtocol();
        }});
    });
  }

  function initValProtocol() {
    gsap.from('.val-top-nav', { y: -50, opacity: 0, duration: 0.8 });
    gsap.from('.agent-sidebar', { x: -100, opacity: 0, duration: 1, delay: 0.2 });
    gsap.from('.val-hobby-card', { y: 100, opacity: 0, duration: 0.6, stagger: 0.2, delay: 0.5 });
    
    // Play "Match Found" mockup sound or visual
    const stinger = document.createElement('div');
    stinger.className = 'val-match-stinger font-comic';
    stinger.innerText = 'MATCH FOUND';
    document.body.appendChild(stinger);
    gsap.to(stinger, { opacity: 1, scale: 1.5, duration: 0.5, onComplete: () => {
        setTimeout(() => stinger.remove(), 1000);
    }});
  }

  document.getElementById('exitValBtn')?.addEventListener('click', () => {
    gsap.to('.val-ui-frame', { opacity: 0, scale: 0.9, duration: 0.5, onComplete: () => {
        valUniverse.style.display = 'none';
        gsap.set('.val-ui-frame', { opacity: 1, scale: 1 });
    }});
  });

  // Dynamic abilities hover
  document.querySelectorAll('.ability').forEach(ab => {
    ab.addEventListener('mouseenter', () => {
        gsap.to(ab, { backgroundColor: 'rgba(255,70,85,0.2)', borderColor: '#ff4655', scale: 1.1, duration: 0.2 });
    });
    ab.addEventListener('mouseleave', () => {
        gsap.to(ab, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', scale: 1, duration: 0.2 });
    });
  });

  // ==========================================
  // UNIVERSE 2: THE IDE LOGIC
  // ==========================================

  const timeEl = document.getElementById('ideTime');
  if (timeEl) setInterval(() => {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit' });
  }, 1000);

  const fileItems = document.querySelectorAll('.file-item');
  const tabs = document.querySelectorAll('.tab');
  const fileContents = document.querySelectorAll('.file-content');

  function openFile(fileId, breadcrumbText) {
    fileItems.forEach(i => i.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    fileContents.forEach(c => c.classList.remove('active'));
    document.querySelector(`.file-item[data-file="${fileId}"]`)?.classList.add('active');
    document.querySelector(`.tab[data-file="${fileId}"]`)?.classList.add('active');
    document.getElementById(`file-${fileId}`)?.classList.add('active');
  }

  fileItems.forEach(item => item.addEventListener('click', () => openFile(item.getAttribute('data-file'), '')));
  
  document.querySelectorAll('.line-numbers').forEach(ln => { 
    let html = ''; for(let i=1; i<=35; i++) html += i + '<br>'; ln.innerHTML = html; 
  });

});