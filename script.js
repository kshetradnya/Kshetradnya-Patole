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
      proUniverse.classList.remove('active');
      setTimeout(() => {
        proUniverse.style.display = 'none';
        document.body.classList.add('ide-active');
        ideUniverse.style.display = 'flex';
        void ideUniverse.offsetWidth;
        ideUniverse.classList.add('active');
        customCursor.style.display = 'none';
      }, 500);
    });
  }

  exitIdeBtns.forEach(btn => {
    if(!btn) return;
    btn.addEventListener('click', () => {
      ideUniverse.classList.remove('active');
      setTimeout(() => {
        ideUniverse.style.display = 'none';
        document.body.classList.remove('ide-active');
        proUniverse.style.display = 'block';
        void proUniverse.offsetWidth;
        proUniverse.classList.add('active');
        customCursor.style.display = 'block';
        ScrollTrigger.refresh();
      }, 500);
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

    if (imageFollower) {
      gsap.to(imageFollower, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power2.out" });
    }
  });

  const hoverables = document.querySelectorAll('a, button, .magnet-btn, .skill-pill');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      customCursor?.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      customCursor?.classList.remove('hover');
    });
  });

  projectRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const img = row.getAttribute('data-img');
      if (imageFollower && img) {
        imageFollower.style.backgroundImage = `url(${img})`;
        imageFollower.classList.add('visible');
        imageFollower.classList.remove('ball-mode');
      }
    });

    row.addEventListener('mouseleave', () => {
      if (imageFollower) {
        imageFollower.classList.remove('visible');
        imageFollower.classList.remove('ball-mode');
      }
    });

    const viewLink = row.querySelector('.view-link');
    if (viewLink) {
      viewLink.addEventListener('mouseenter', () => {
        imageFollower?.classList.add('ball-mode');
      });
      viewLink.addEventListener('mouseleave', () => {
        imageFollower?.classList.remove('ball-mode');
      });
    }
  });

  // Bento Spotlight Logic
  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ==========================================
  // VIRTUAL IDE INTERACTIVITY
  // ==========================================

  const ideTabs = document.querySelectorAll('.ide-editor .tab');
  const ideFiles = document.querySelectorAll('.ide-sidebar .file-item');
  const ideContents = document.querySelectorAll('.ide-editor .file-content');
  const breadcrumbPath = document.getElementById('breadcrumbPath');
  
  function switchIdeFile(fileId) {
    ideTabs.forEach(tab => {
      if(tab.getAttribute('data-file') === fileId) tab.classList.add('active');
      else tab.classList.remove('active');
    });
    ideFiles.forEach(file => {
      if(file.getAttribute('data-file') === fileId) {
        file.classList.add('active');
        if (breadcrumbPath) {
           let fileName = file.innerText.replace(/M$|U$/,'').trim();
           breadcrumbPath.innerText = `ML_PORTFOLIO_V2 > ${fileName}`;
        }
      }
      else file.classList.remove('active');
    });
    ideContents.forEach(content => {
      if(content.id === `file-${fileId}`) content.style.display = 'flex';
      else content.style.display = 'none';
    });
  }
  
  ideTabs.forEach(tab => {
    tab.addEventListener('click', () => { switchIdeFile(tab.getAttribute('data-file')); });
  });
  ideFiles.forEach(file => {
    file.addEventListener('click', () => { switchIdeFile(file.getAttribute('data-file')); });
  });

  // Terminal Typing Simulation
  const runCodeBtn = document.getElementById('runCodeBtn');
  const terminalOutput = document.getElementById('terminalOutput');
  if(runCodeBtn && terminalOutput) {
    let isRunning = false;
    runCodeBtn.addEventListener('click', () => {
      if(isRunning) return;
      isRunning = true;
      runCodeBtn.style.opacity = '0.5';
      const promptLine = document.createElement('div');
      promptLine.innerHTML = `<span class="prompt">kshetra@macbook:~/ML_PORTFOLIO_V2$</span> python src/train_model.py`;
      terminalOutput.appendChild(promptLine);
      
      let texts = [
        "Initializing PortfolioNet Architecture...",
        "Epoch 1/10 - loss: 0.892 - val_accuracy: 0.91",
        "Epoch 2/10 - loss: 0.710 - val_accuracy: 0.93",
        "Epoch 3/10 - loss: 0.520 - val_accuracy: 0.95",
        "Training Complete. Model saved to disk.",
      ];
      let i = 0;
      let interval = setInterval(() => {
        if(i < texts.length) {
          const line = document.createElement('div');
          line.innerText = texts[i];
          terminalOutput.appendChild(line);
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
          i++;
        } else {
          const finalPrompt = document.createElement('div');
          finalPrompt.innerHTML = `<br><span class="prompt">kshetra@macbook:~/ML_PORTFOLIO_V2$</span>`;
          terminalOutput.appendChild(finalPrompt);
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
          clearInterval(interval);
          isRunning = false;
          runCodeBtn.style.opacity = '1';
        }
      }, 600);
    });
  }

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