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
  // MASSIVE HOBBIES EXPANSION LOGIC
  // ==========================================

  // --- Hobby 1: Photography Studio ---
  const shutterBtn = document.getElementById('shutterBtn');
  const webcamBtn = document.getElementById('webcamBtn');
  const webcamVideo = document.getElementById('webcamVideo');
  const cameraFlash = document.getElementById('cameraFlash');
  const polaroidRender = document.getElementById('polaroidRender');
  const polaroidImg = document.getElementById('polaroidImg');
  const polaroidTime = document.getElementById('polaroidTime');
  const filterToggleBtn = document.getElementById('filterToggleBtn');
  const viewfinderArea = document.getElementById('viewfinderArea');

  let stream = null;
  let filters = ['None', 'Grayscale', 'Sepia', 'Invert'];
  let currentFilter = 0;

  if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', () => {
      currentFilter = (currentFilter + 1) % filters.length;
      filterToggleBtn.innerText = 'Filter: ' + filters[currentFilter];
      let cssFilter = 'none';
      if(filters[currentFilter] === 'Grayscale') cssFilter = 'grayscale(100%)';
      if(filters[currentFilter] === 'Sepia') cssFilter = 'sepia(100%)';
      if(filters[currentFilter] === 'Invert') cssFilter = 'invert(100%)';
      viewfinderArea.style.filter = cssFilter;
      polaroidRender.style.filter = cssFilter;
    });
  }

  async function startWebcam() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      webcamVideo.srcObject = stream;
      webcamVideo.style.display = 'block';
    } catch (err) {
      alert("Camera access denied or unavailable.");
    }
  }

  function snapPhoto() {
    // Flash effect with focus hunt simulation
    viewfinderArea.classList.add('blur');
    setTimeout(() => {
      viewfinderArea.classList.remove('blur');
      cameraFlash.classList.add('flash-active');
      
      // Auto stamp time
      const now = new Date();
      if(polaroidTime) polaroidTime.innerText = now.toLocaleTimeString();

      setTimeout(() => {
        cameraFlash.classList.remove('flash-active');
        
        // If webcam is active, capture from video to canvas
        if (stream) {
          const cvs = document.createElement('canvas');
          cvs.width = webcamVideo.videoWidth;
          cvs.height = webcamVideo.videoHeight;
          const ctx = cvs.getContext('2d');
          ctx.drawImage(webcamVideo, 0, 0, cvs.width, cvs.height);
          polaroidImg.src = cvs.toDataURL('image/png');
        } else {
           // Default mock image
           polaroidImg.src = 'projects/IMG_8729.JPG';
        }

        // Drop polaroid (stacking effect)
        polaroidRender.classList.remove('dropped');
        void polaroidRender.offsetWidth; // trigger reflow
        const randomRot = (Math.random() - 0.5) * 10; // random tilt 
        polaroidRender.style.transform = `translateX(-50%) rotate(${randomRot}deg)`;
        polaroidRender.classList.add('dropped');

      }, 150);
    }, 400); // autofocus delay
  }

  if (webcamBtn) webcamBtn.addEventListener('click', () => {
     if(!stream) startWebcam();
     else snapPhoto(); // if already streaming, snap
  });
  if (shutterBtn) shutterBtn.addEventListener('click', () => {
    // stop stream if running to use default
    if(stream) { stream.getTracks().forEach(t => t.stop()); stream = null; webcamVideo.style.display = 'none'; }
    snapPhoto();
  });


  // --- Hobby 2: Coastal Parallax Running Game ---
  const canvas = document.getElementById('dinoCanvas');
  const startGameBtn = document.getElementById('startGameBtn');
  const gameOverlay = document.getElementById('gameOverlay');
  const scoreUI = document.getElementById('scoreUI');
  
  if (canvas && startGameBtn && gameOverlay) {
    const ctx = canvas.getContext('2d');
    let isGameRunning = false;
    let frame = 0, score = 0;
    
    // Day Night Cycle vars
    let timeCycle = 0; // 0 to 1 wrapping
    
    // Load User Sprite
    const runnerSprite = new Image();
    runnerSprite.src = 'projects/runner.png.png';
    let spriteLoaded = false;
    runnerSprite.onload = () => { spriteLoaded = true; };

    // Game Entities
    const dino = { x: 50, y: 220, w: 40, h: 60, vy: 0, gravity: 0.8, jumpPower: -14, grounded: true };
    let obstacles = [];
    let cars = [];
    let particles = [];
    let problemTypes = ["🍔", "📚", "📱"];
    
    function resetGame() {
      dino.y = 220;
      dino.vy = 0;
      obstacles = []; cars = []; particles = [];
      frame = 0; score = 0; timeCycle = 0;
      isGameRunning = true;
      gameOverlay.style.display = 'none';
      requestAnimationFrame(gameLoop);
    }

    startGameBtn.addEventListener('click', resetGame);
    
    // Jump Controls
    function jump() {
      if(dino.grounded && isGameRunning) {
        dino.vy = dino.jumpPower;
        dino.grounded = false;
      }
    }
    canvas.addEventListener('mousedown', jump);
    window.addEventListener('keydown', (e) => {
      if(e.code === 'Space' && isGameRunning) { e.preventDefault(); jump(); }
    });

    // Helper: color lerp
    function lerpColor(c1, c2, t) {
      return `rgb(${Math.round(c1[0] + (c2[0]-c1[0])*t)}, ${Math.round(c1[1] + (c2[1]-c1[1])*t)}, ${Math.round(c1[2] + (c2[2]-c1[2])*t)})`;
    }

    function gameLoop() {
      if(!isGameRunning) return;
      
      // Time cycle math
      timeCycle += 0.0005; // speed of day passing
      let t = (Math.sin(timeCycle * Math.PI * 2) + 1) / 2; // 0 to 1 to 0
      
      // Sky Color (Day: 135,206,235 -> Sunset: 255,140,0 -> Night: 10,10,40)
      let skyColor = lerpColor([135,206,235], [10,10,40], t);
      ctx.fillStyle = skyColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height); // clear with sky
      
      // Draw Ocean Parallax (Back layer)
      ctx.fillStyle = lerpColor([0,105,148], [5,20,50], t);
      let waveOffset = (frame * 1) % 40;
      for(let x = -waveOffset; x < canvas.width; x += 40) {
         ctx.fillRect(x, 150, 40, canvas.height - 150);
         // Wave highlights
         ctx.fillStyle = 'rgba(255,255,255,0.2)';
         ctx.fillRect(x + 10, 155 + Math.sin(x)*5, 10, 2);
         ctx.fillStyle = lerpColor([0,105,148], [5,20,50], t);
      }

      // Draw Road Parallax (Mid layer)
      ctx.fillStyle = '#444';
      ctx.fillRect(0, 200, canvas.width, 100);
      // Road markings
      ctx.fillStyle = '#ffcc00';
      let roadOffset = (frame * 3) % 60;
      for(let x = -roadOffset; x < canvas.width; x += 60) {
         ctx.fillRect(x, 220, 30, 4);
      }

      // Traffic Cars
      if(frame % 150 === 0) {
         cars.push({ x: canvas.width, y: 205, speed: Math.random()*2 + 4, color: ['#fff','#f00','#000'][Math.floor(Math.random()*3)] });
      }
      for(let i=0; i<cars.length; i++) {
        let c = cars[i];
        c.x -= c.speed;
        ctx.fillStyle = c.color;
        ctx.fillRect(c.x, c.y, 50, 20); // car body
        ctx.fillStyle = '#ff0000'; ctx.fillRect(c.x+45, c.y+5, 5, 5); // taillight
      }
      if(cars.length && cars[0].x < -100) cars.shift(); // cleanup

      // Draw Sidewalk Parallax (Foreground)
      ctx.fillStyle = '#aaa';
      ctx.fillRect(0, 270, canvas.width, 30);
      ctx.fillStyle = '#888';
      let walkOffset = (frame * 6) % 40;
      for(let x = -walkOffset; x < canvas.width; x += 40) {
         ctx.fillRect(x, 270, 2, 30); // concrete cracks
      }

      // Physics applied to player
      dino.vy += dino.gravity;
      dino.y += dino.vy;
      if (dino.y >= 210) { // Ground level on sidewalk
        if(!dino.grounded) {
          // Explode particles on landing
          for(let p=0; p<5; p++) particles.push({x: dino.x+20, y: 270, vx: (Math.random()-0.5)*4, vy: -Math.random()*3, life: 1});
        }
        dino.y = 210;
        dino.grounded = true;
      }
      
      // Draw Player
      if (spriteLoaded) {
         // Bobbing animation if running
         let bobOffset = dino.grounded ? Math.sin(frame * 0.4) * 4 : 0;
         ctx.drawImage(runnerSprite, dino.x, dino.y + bobOffset, dino.w, dino.h);
      } else {
         ctx.fillStyle = '#333';
         ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
      }

      // Particles
      ctx.fillStyle = '#fff';
      for(let i=particles.length-1; i>=0; i--) {
        let p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.05;
        if(p.life <= 0) particles.splice(i,1);
        else ctx.fillRect(p.x, p.y, 4, 4);
      }

      // Obstacles
      let gameSpeed = 6 + (score * 0.005); // progressive speed
      if (frame % (Math.max(40, 100 - Math.floor(score/10))) === 0 && frame > 0) {
        let type = problemTypes[Math.floor(Math.random() * problemTypes.length)];
        obstacles.push({ x: canvas.width, y: 240, w: 30, h: 30, text: type });
      }
      
      for(let i=0; i<obstacles.length; i++) {
        let obs = obstacles[i];
        obs.x -= gameSpeed; 
        
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.font = '20px sans-serif';
        ctx.fillText(obs.text, obs.x + 5, obs.y + 22);

        // Collision detection
        if (dino.x < obs.x + obs.w - 10 && dino.x + dino.w > obs.x + 10 &&
            dino.y < obs.y + obs.h && dino.y + dino.h > obs.y) {
          isGameRunning = false;
          gameOverlay.style.display = 'flex';
          startGameBtn.innerHTML = "Oof! Restart Run";
        }
      }
      if(obstacles.length && obstacles[0].x < -100) obstacles.shift();

      // UI
      score++;
      if(scoreUI) scoreUI.innerText = "Score: " + Math.floor(score/10) + "m";

      frame++;
      if(isGameRunning) requestAnimationFrame(gameLoop);
    }
  }

  // --- Hobby 3: Royal Flight Map GSAP ---
  if (document.getElementById('airplanePathBase') && document.getElementById('airplane')) {
     
     const airplane = document.getElementById('airplane');
     const altitudeHud = document.getElementById('altitudeHud');
     const passportStamp = document.getElementById('passportStamp');
     
     // The main flight animation
     gsap.to("#airplane", {
       scrollTrigger: {
         trigger: "#flightPathContainer",
         start: "top 40%",    
         end: "bottom 80%",   
         scrub: 1,            
         scroller: ".pro-scroll-container",
         onUpdate: (self) => {
            // Altitude HUD update
            if(altitudeHud) altitudeHud.innerText = `Cruising Altitude: ${Math.floor(self.progress * 35000)}ft`;
            
            // Dynamic scaling effect based on progress milestones
            const p = self.progress;
            // Hotspots roughly mapped to progress based on curve geometry:
            // Kashmir (~0%), Amritsar (~0.3), Goa (~0.65), Kerala (~1.0)
            const isNearNode = (Math.abs(p - 0) < 0.05) || (Math.abs(p - 0.3) < 0.05) || 
                               (Math.abs(p - 0.65) < 0.05) || (Math.abs(p - 1.0) < 0.05);
            
            if (isNearNode) airplane.classList.add('scaled');
            else airplane.classList.remove('scaled');
         }
       },
       motionPath: {
         path: "#airplanePathBase",
         align: "#airplanePathBase",
         alignOrigin: [0.5, 0.5],
         autoRotate: 90
       },
       ease: "none"
     });
     
     // Travel Modal Node Clicks
     const mapNodes = document.querySelectorAll('.map-node');
     const modals = document.querySelectorAll('.t-modal');

     mapNodes.forEach(node => {
       node.addEventListener('click', (e) => {
         // Close all modals first
         modals.forEach(m => m.classList.remove('active'));
         passportStamp.classList.remove('stamped');
         
         const dest = node.getAttribute('data-dest');
         const modal = document.getElementById('tModal' + dest.charAt(0).toUpperCase() + dest.slice(1));
         
         if (modal) {
            // Position near node
            const containerRect = document.getElementById('flightPathContainer').getBoundingClientRect();
            const nodeRect = node.getBoundingClientRect();
            modal.style.left = (nodeRect.left - containerRect.left + 30) + 'px';
            modal.style.top = (nodeRect.top - containerRect.top - 20) + 'px';
            modal.classList.add('active');
            
            // Trigger stamp
            passportStamp.style.left = (nodeRect.left - containerRect.left - 100) + 'px';
            passportStamp.style.top = (nodeRect.top - containerRect.top - 50) + 'px';
            
            setTimeout(() => { passportStamp.classList.add('stamped'); }, 100);
         }
       });
     });
     
     // Close modals when clicking elsewhere
     document.getElementById('flightPathContainer').addEventListener('click', (e) => {
       if(!e.target.closest('.map-node') && !e.target.closest('.t-modal')) {
         modals.forEach(m => m.classList.remove('active'));
         passportStamp.classList.remove('stamped');
       }
     });
  }

});
