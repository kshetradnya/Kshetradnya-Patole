document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // UNIVERSE 1: THE PRO MODE (NOW DEFAULT)
  // ==========================================
  
  const ideUniverse = document.getElementById('ide-universe');
  const proUniverse = document.getElementById('pro-universe');
  const launchBtn = document.getElementById('launchIdeBtn');
  const exitIdeBtns = [document.getElementById('exitIdeBtn'), document.getElementById('exitIdeTopBtn')];

  // GSAP ScrollTrigger init
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  
  // Set initial state
  const elements = gsap.utils.toArray('.gsap-fade-up');
  elements.forEach(el => gsap.set(el, { y: 60, opacity: 0 }));

  // The scroll container is manually dictating the scroll axis
  function initGsap() {
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    elements.forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        scroller: ".pro-scroll-container",
        start: "top 85%",
        onEnter: () => {
          gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            clearProps: "all"
          });
        },
        once: true
      });
    });
  }
  
  // Trigger GSAP immediately because we are now starting in Pro Mode
  setTimeout(initGsap, 100);

  // Transitions
  if (launchBtn) {
    launchBtn.addEventListener('click', () => {
      proUniverse.style.transition = 'opacity 0.6s cubic-bezier(0.2,0.8,0.2,1), visibility 0.6s';
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
      
      setTimeout(() => {
        proUniverse.classList.add('active');
      }, 600);
    });
  });

  // CUSTOM MAGNETIC CURSOR & FOLLOW IMAGE
  const customCursor = document.getElementById('custom-cursor');
  const followerImage = document.getElementById('project-image-follower');

  document.addEventListener('mousemove', (e) => {
    // Only track when not in IDE mode
    if(document.body.classList.contains('ide-active')) return;

    if(customCursor) {
      customCursor.style.left = e.clientX + 'px';
      customCursor.style.top = e.clientY + 'px';
    }

    if(followerImage && followerImage.classList.contains('visible')) {
      followerImage.style.left = e.clientX + 'px';
      followerImage.style.top = e.clientY + 'px';
    }
  });

  const hoverables = document.querySelectorAll('a, button, .project-row, .magnet-btn');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if(customCursor) customCursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      if(customCursor) customCursor.classList.remove('hover');
    });
  });

  const projectTriggers = document.querySelectorAll('.project-trigger');
  projectTriggers.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (followerImage) {
        followerImage.style.backgroundImage = `url('${el.getAttribute('data-img')}')`;
        followerImage.classList.add('visible');
      }
    });
    el.addEventListener('mouseleave', () => {
      if (followerImage) {
        followerImage.classList.remove('visible');
        followerImage.classList.remove('ball-mode');
      }
    });

    const viewLink = el.querySelector('.view-link');
    if (viewLink) {
      viewLink.addEventListener('mouseenter', () => {
        if(followerImage) followerImage.classList.add('ball-mode');
      });
      viewLink.addEventListener('mouseleave', () => {
        if(followerImage) followerImage.classList.remove('ball-mode');
      });
    }
  });


  // ==========================================
  // UNIVERSE 2: THE IDE LOGIC
  // ==========================================

  // Live Time
  const timeEl = document.getElementById('ideTime');
  if (timeEl) {
    setInterval(() => {
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit' });
    }, 1000);
  }

  // File Switching
  const fileItems = document.querySelectorAll('.file-item');
  const tabs = document.querySelectorAll('.tab');
  const fileContents = document.querySelectorAll('.file-content');
  const breadcrumbPath = document.getElementById('breadcrumbPath');

  function openFile(fileId, breadcrumbText) {
    fileItems.forEach(i => i.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    fileContents.forEach(c => c.classList.remove('active'));

    const targetItem = document.querySelector(`.file-item[data-file="${fileId}"]`);
    const targetTab = document.querySelector(`.tab[data-file="${fileId}"]`);
    const targetContent = document.getElementById(`file-${fileId}`);

    if (targetItem) targetItem.classList.add('active');
    if (targetTab) targetTab.classList.add('active');
    if (targetContent) targetContent.classList.add('active');

    if (breadcrumbPath && breadcrumbText) {
      breadcrumbPath.textContent = `ML_PORTFOLIO_V2 > ${breadcrumbText}`;
    }
  }

  fileItems.forEach(item => {
    item.addEventListener('click', () => {
      const text = item.querySelector('.file-item-left').textContent.trim();
      openFile(item.getAttribute('data-file'), text);
    });
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      if(e.target.classList.contains('close-tab')) {
         e.stopPropagation();
         tab.style.display = 'none';
         const linkedItem = document.querySelector(`.file-item[data-file="${tab.getAttribute('data-file')}"]`);
         if(linkedItem) linkedItem.style.opacity = '0.5';
         openFile('readme', 'README.md'); 
         return;
      }
      const title = tab.textContent.replace('×', '').trim().split(' ')[0];
      openFile(tab.getAttribute('data-file'), title);
    });
  });

  // Run Code Terminal Simulation
  const runBtn = document.getElementById('runCodeBtn');
  const terminalOut = document.getElementById('terminalOutput');
  let isTraining = false;

  if (runBtn && terminalOut) {
    runBtn.addEventListener('click', () => {
      if (isTraining) return;
      isTraining = true;
      openFile('train', 'src/train_model.py');
      runBtn.textContent = "Running...";
      runBtn.style.opacity = 0.5;

      const outputLines = [
        "python3 src/train_model.py",
        "Loading dataset 'portfolio_assets.csv' ... (10,000 samples)",
        "Initializing PortfolioNet Architecture:",
        " -> Linear(128 -> 256) -> Dropout(0.3) -> ReLu -> Linear(256 -> 64) -> Linear(64 -> 10)",
        "Training Sequence Initiated",
        "[Epoch 1/5] Loss: 0.8923 - Accuracy: 64.2%",
        "[Epoch 2/5] Loss: 0.4510 - Accuracy: 78.5%",
        "[Epoch 3/5] Loss: 0.3204 - Accuracy: 85.9%",
        "[Epoch 4/5] Loss: 0.1988 - Accuracy: 92.1%",
        "[Epoch 5/5] Loss: 0.0812 - Accuracy: 98.4%",
        "Training Complete. Weights saved to 'Kshetradnya_Net_V2.pth'.",
        "=> Ready to deploy to production."
      ];

      terminalOut.innerHTML = '<div style="color: #aaa; margin-bottom: 8px;">Windows PowerShell / zsh / bash<br>Copyright (C) Microsoft Corporation. All rights reserved.<br><br></div>';
      
      let i = 0;
      function printLine() {
        if (i < outputLines.length) {
          const div = document.createElement('div');
          div.style.marginBottom = "4px";
          
          if(i===0) div.innerHTML = `<span class="prompt">kshetra@macbook:~/ML_PORTFOLIO_V2$</span> ${outputLines[i]}`;
          else if(i===outputLines.length-1) div.innerHTML = `<br><span style="color:#73c991; font-weight:bold">${outputLines[i]}</span>`;
          else div.textContent = outputLines[i];
          
          terminalOut.appendChild(div);
          terminalOut.scrollTop = terminalOut.scrollHeight;
          i++;
          setTimeout(printLine, Math.random() * 300 + 100);
        } else {
          isTraining = false;
          runBtn.textContent = "▶ Run Code";
          runBtn.style.opacity = 1;
          const finalPrompt = document.createElement('div');
          finalPrompt.innerHTML = `<br><span class="prompt">kshetra@macbook:~/ML_PORTFOLIO_V2$</span> `;
          terminalOut.appendChild(finalPrompt);
          terminalOut.scrollTop = terminalOut.scrollHeight;
        }
      }
      printLine();
    });
  }

  // Populate Line Numbers for Editor
  document.querySelectorAll('.line-numbers').forEach(ln => { 
    let html = ''; 
    for(let i=1; i<=35; i++) html += i + '<br>'; 
    ln.innerHTML = html; 
  });


  // ==========================================
  // HOBBY CAMERA SYSTEM: MY LIFE THROUGH A LENS
  // ==========================================

  const HOBBIES_DATA = [
    {
      id: 'photography',
      title: 'Visual Storytelling',
      desc: 'Capturing moments that tell a story beyond words. My lens, my rules!',
      img: 'projects/hobby_photography.png',
      stats: { iso: '100', aperture: 'f/1.8', shutter: '1/4000' },
      funFact: 'POW! Captured in 0.01s!'
    },
    {
      id: 'running',
      title: 'The Trail Runner',
      desc: 'Escaping the simulation one kilometer at a time. Pure adrenaline!',
      img: 'projects/hobby_running.png',
      stats: { iso: '800', aperture: 'f/2.8', shutter: '1/8000' },
      funFact: 'ZAP! Speeding through reality.'
    },
    {
      id: 'sports',
      title: 'Goal & Checkmate',
      desc: 'Football on the field, Chess on the board. The duality of strategy.',
      img: 'projects/hobby_sports_chess.png',
      stats: { iso: '400', aperture: 'f/4.0', shutter: '1/2000' },
      funFact: 'BOOM! Strategic dominance.'
    }
  ];

  let currentHobbyIdx = 0;
  let camZoom = 1;

  function initCamera() {
    gsap.from('.camera-body', { scale: 0.8, opacity: 0, duration: 0.8, ease: "back.out(1.2)" });
    
    // Boot sequence
    setTimeout(() => {
      const boot = document.getElementById('lcdBootLoader');
      const content = document.getElementById('lcdContent');
      if (boot) boot.style.display = 'none';
      if (content) content.style.display = 'flex';
      updateHobbyDisplay();
    }, 2000);
  }

  function updateHobbyDisplay() {
    const data = HOBBIES_DATA[currentHobbyIdx];
    const img = document.getElementById('hobbyImage');
    const title = document.getElementById('hobbyTitle');
    const desc = document.getElementById('hobbyDesc');
    const funFact = document.getElementById('hobbyFunFact');
    
    if (img) img.src = data.img;
    if (title) title.innerText = data.title;
    if (desc) desc.innerText = data.desc;
    if (funFact) funFact.innerText = data.funFact;
    
    document.getElementById('hudIso').innerText = `ISO ${data.stats.iso}`;
    document.getElementById('hudAperture').innerText = data.stats.aperture;
    document.getElementById('hudShutter').innerText = `${data.stats.shutter}s`;
    
    const dots = document.querySelectorAll('.hobby-dots .dot');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentHobbyIdx));
  }

  function snapPhoto() {
    const flashUnit = document.getElementById('cameraFlashUnit');
    const lcdOverlay = document.getElementById('lcdFlashOverlay');
    if (flashUnit) flashUnit.classList.add('active');
    if (lcdOverlay) {
      gsap.set(lcdOverlay, { opacity: 1 });
      gsap.to(lcdOverlay, { opacity: 0, duration: 0.5, delay: 0.1 });
    }
    setTimeout(() => { if (flashUnit) flashUnit.classList.remove('active'); }, 200);
    gsap.fromTo('.camera-body', { x: -5 }, { x: 5, duration: 0.05, repeat: 5, yoyo: true });
  }

  const birdLauncher = document.getElementById('birdLauncher');
  if (birdLauncher) {
    birdLauncher.addEventListener('click', () => {
      const trans = document.getElementById('hobbyTransition');
      if (trans) trans.style.display = 'flex';
      
      gsap.to('.pull-text', { scale: 1, rotate: 0, duration: 0.5, ease: "back.out" });
      gsap.set(['.left-bird', '.right-bird'], { display: 'block', opacity: 1 });
      
      const tl = gsap.timeline({ onComplete: () => {
        const universe = document.getElementById('hobbyCameraUniverse');
        if (universe) universe.style.display = 'flex';
        initCamera();
      }});

      tl.to(['.left-half', '.left-bird'], { x: '-100%', duration: 1.5, ease: "power4.inOut" }, "+=0.5")
        .to(['.right-half', '.right-bird'], { x: '100%', duration: 1.5, ease: "power4.inOut" }, "<")
        .to('.pull-text', { opacity: 0, scale: 2, duration: 0.5 }, "<0.2");
    });
  }

  const camRight = document.getElementById('camRight');
  const camLeft = document.getElementById('camLeft');
  const camOk = document.getElementById('camOk');
  const physicalShutter = document.getElementById('physicalShutter');
  const zoomIn = document.getElementById('zoomInBtn');
  const zoomOut = document.getElementById('zoomOutBtn');
  const exitLens = document.getElementById('exitLensBtn');

  if (camRight) camRight.addEventListener('click', () => {
    currentHobbyIdx = (currentHobbyIdx + 1) % HOBBIES_DATA.length;
    updateHobbyDisplay();
  });
  if (camLeft) camLeft.addEventListener('click', () => {
    currentHobbyIdx = (currentHobbyIdx - 1 + HOBBIES_DATA.length) % HOBBIES_DATA.length;
    updateHobbyDisplay();
  });
  if (camOk) camOk.addEventListener('click', snapPhoto);
  if (physicalShutter) physicalShutter.addEventListener('click', snapPhoto);
  
  if (zoomIn) zoomIn.addEventListener('click', () => {
    camZoom = Math.min(camZoom + 0.2, 2);
    gsap.to('#hobbyImage', { scale: camZoom, duration: 0.3 });
  });
  if (zoomOut) zoomOut.addEventListener('click', () => {
    camZoom = Math.max(camZoom - 0.2, 0.8);
    gsap.to('#hobbyImage', { scale: camZoom, duration: 0.3 });
  });

  if (exitLens) exitLens.addEventListener('click', () => {
    gsap.to('.camera-body', { scale: 0.5, opacity: 0, duration: 0.5, onComplete: () => {
      document.getElementById('hobbyCameraUniverse').style.display = 'none';
      document.getElementById('hobbyTransition').style.display = 'none';
      gsap.set(['.left-half', '.right-half'], { x: '0%' });
      gsap.set(['.left-bird', '.right-bird'], { x: '0%', opacity: 0 });
    }});
  });

});