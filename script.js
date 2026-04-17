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


  // --- Hobby 2: Coastal 3-Lane Dodger ---
  const canvas = document.getElementById('dinoCanvas');
  const startGameBtn = document.getElementById('startGameBtn');
  const gameOverlay = document.getElementById('gameOverlay');
  const scoreUI = document.getElementById('scoreUI');
  
  if (canvas && startGameBtn && gameOverlay) {
    const ctx = canvas.getContext('2d');
    let isGameRunning = false;
    let frame = 0, score = 0;
    
    // Day Night Cycle vars
    let timeCycle = 0; 
    
    // Audio Contexts
    const oceanAudio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/10/audio_51cbfaebef.mp3?filename=ocean-waves-112906.mp3");
    oceanAudio.loop = true; oceanAudio.volume = 0.3;
    const chatterAudio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=people-talking-39074.mp3");
    chatterAudio.loop = true; chatterAudio.volume = 0.2;

    // Load User Sprite (Spritesheet)
    const runnerSprite = new Image();
    runnerSprite.src = 'projects/runner.png.png';
    let spriteLoaded = false;
    runnerSprite.onload = () => { spriteLoaded = true; };

    // Game Entities (3 Lanes: 230=Top, 250=Mid, 270=Bot)
    const lanes = [230, 250, 270];
    const dino = { x: 50, lane: 1, y: 250, w: 30, h: 50 }; // y is visual, lane is logical
    let pedestrians = [];
    let cars = [];
    
    function resetGame() {
      dino.lane = 1;
      pedestrians = []; cars = [];
      frame = 0; score = 0; timeCycle = 0;
      isGameRunning = true;
      gameOverlay.style.display = 'none';
      oceanAudio.play().catch(e=>console.log(e));
      chatterAudio.play().catch(e=>console.log(e));
      requestAnimationFrame(gameLoop);
    }

    startGameBtn.addEventListener('click', resetGame);
    
    // Lane Controls (Up/Down)
    window.addEventListener('keydown', (e) => {
      if(!isGameRunning) return;
      if(e.code === 'ArrowUp' || e.code === 'KeyW') { e.preventDefault(); dino.lane = Math.max(0, dino.lane - 1); }
      if(e.code === 'ArrowDown' || e.code === 'KeyS') { e.preventDefault(); dino.lane = Math.min(2, dino.lane + 1); }
    });

    // Helper: color lerp
    function lerpColor(c1, c2, t) {
      return `rgb(${Math.round(c1[0] + (c2[0]-c1[0])*t)}, ${Math.round(c1[1] + (c2[1]-c1[1])*t)}, ${Math.round(c1[2] + (c2[2]-c1[2])*t)})`;
    }

    function gameLoop() {
      if(!isGameRunning) return;
      
      // Time cycle math
      timeCycle += 0.0005; 
      let t = (Math.sin(timeCycle * Math.PI * 2) + 1) / 2; // 0 to 1 to 0
      
      // Sky Color
      let skyColor = lerpColor([135,206,235], [10,10,40], t);
      ctx.fillStyle = skyColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height); 
      
      // Draw Ocean Parallax (Back layer)
      ctx.fillStyle = lerpColor([0,105,148], [5,20,50], t);
      let waveOffset = (frame * 1) % 40;
      for(let x = -waveOffset; x < canvas.width; x += 40) {
         ctx.fillRect(x, 100, 40, canvas.height - 100);
         // Wave highlights
         ctx.fillStyle = 'rgba(255,255,255,0.2)';
         ctx.fillRect(x + 10, 105 + Math.sin(x)*5, 10, 2);
         ctx.fillStyle = lerpColor([0,105,148], [5,20,50], t);
      }

      // Draw Road Parallax (Mid layer)
      ctx.fillStyle = '#444';
      ctx.fillRect(0, 160, canvas.width, 60);
      // Road markings
      ctx.fillStyle = '#ffcc00';
      let roadOffset = (frame * 3) % 60;
      for(let x = -roadOffset; x < canvas.width; x += 60) {
         ctx.fillRect(x, 190, 30, 4);
      }

      // Traffic Cars (zoom past in background)
      if(frame % 150 === 0) {
         cars.push({ x: canvas.width, y: 175, speed: Math.random()*2 + 4, color: ['#fff','#f00','#000'][Math.floor(Math.random()*3)] });
      }
      for(let i=0; i<cars.length; i++) {
        let c = cars[i]; c.x -= c.speed;
        ctx.fillStyle = c.color; ctx.fillRect(c.x, c.y, 50, 20); 
        ctx.fillStyle = '#ff0000'; ctx.fillRect(c.x+45, c.y+5, 5, 5); 
      }
      if(cars.length && cars[0].x < -100) cars.shift(); 

      // Draw Sidewalk Parallax (Foreground)
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 220, canvas.width, 80);
      ctx.fillStyle = '#666';
      let walkOffset = (frame * 6) % 40;
      for(let x = -walkOffset; x < canvas.width; x += 40) {
         ctx.fillRect(x, 220, 2, 80); // concrete cracks
      }

      // Smooth Lane Transition for Player
      let targetY = lanes[dino.lane];
      dino.y += (targetY - dino.y) * 0.2;
      
      // Draw Player (Spritesheet Slicing)
      if (spriteLoaded) {
         // Assume 4 frames horizontally
         let numFrames = 4;
         let frameW = runnerSprite.width / numFrames;
         let frameH = runnerSprite.height;
         let aniFrame = Math.floor(frame / 6) % numFrames; // change frame every 6 ticks
         
         ctx.drawImage(runnerSprite, aniFrame * frameW, 0, frameW, frameH, dino.x, dino.y - dino.h, dino.w, dino.h);
      } else {
         ctx.fillStyle = '#111';
         ctx.fillRect(dino.x, dino.y - dino.h, dino.w, dino.h);
      }

      // Pedestrians (Obstacles)
      let gameSpeed = 6 + (score * 0.005); 
      if (frame % (Math.max(40, 100 - Math.floor(score/10))) === 0 && frame > 0) {
        let pLane = Math.floor(Math.random() * 3);
        let emojis = ["🚶", "🏃‍♂️", "🚴", "🐕"];
        pedestrians.push({ x: canvas.width, lane: pLane, y: lanes[pLane], speed: Math.random()*2, w: 20, h: 40, emoji: emojis[Math.floor(Math.random()*emojis.length)] });
      }
      
      for(let i=0; i<pedestrians.length; i++) {
        let p = pedestrians[i];
        p.x -= (gameSpeed + p.speed); 
        
        ctx.font = '30px sans-serif';
        ctx.fillText(p.emoji, p.x, p.y - 10);

        // Collision detection (Z-axis / Lane matching)
        if (dino.lane === p.lane) {
           if (dino.x < p.x + p.w && dino.x + dino.w > p.x) {
             isGameRunning = false;
             oceanAudio.pause(); chatterAudio.pause();
             gameOverlay.style.display = 'flex';
             startGameBtn.innerHTML = "Oof, crashed! Restart Run";
           }
        }
      }
      if(pedestrians.length && pedestrians[0].x < -100) pedestrians.shift();

      // UI
      score++;
      if(scoreUI) scoreUI.innerText = "Distance: " + Math.floor(score/10) + "m";

      frame++;
      if(isGameRunning) requestAnimationFrame(gameLoop);
    }
  }

  // --- Hobby 3: Royal Flight Map GSAP Cinematic ---
  if (document.getElementById('airplanePathBase') && document.getElementById('airplane')) {
     
     const airplane = document.getElementById('airplane');
     const flightSvg = document.querySelector('.flight-svg');
     const altitudeHud = document.getElementById('altitudeHud');
     const passportStamp = document.getElementById('passportStamp');
     const overlay = document.getElementById('trueHomeOverlay');
     const backBtn = document.getElementById('backToOriginBtn');
     
     const flightAudio = new Audio("https://cdn.pixabay.com/download/audio/2022/10/26/audio_970d4fc18d.mp3?filename=airplane-fly-by-01-122996.mp3");
     
     // To translate the SVG underneath the stationary airplane:
     // We animate a dummy proxy object's progress over the ScrollTrigger, 
     // then use MotionPathPlugin to extract coordinates and physically move the SVG Map.
     let pathProxy = { p: 0 };

     gsap.to(pathProxy, {
       p: 1, // 0 to 1 over scroll
       scrollTrigger: {
         trigger: "#flightPathContainer",
         start: "top top",    
         end: "bottom bottom",   
         scrub: true,            
         scroller: ".pro-scroll-container",
         onUpdate: (self) => {
            let prog = self.progress;

            // Loop back to Origin logic
            // If progress > 0.8 (After Kerala), the path forces back to home (p=0 coordinates)
            let actualPathProg = prog;
            if(prog > 0.8) {
               // Map remaining scroll 0.8 -> 1.0 to go backwards 1.0 -> 0.0
               let over = (prog - 0.8) / 0.2; // 0.0 to 1.0
               actualPathProg = 1.0 - over; // flies backwards to origin
               
               // Cinematic Trigger
               if (over >= 0.99) {
                  airplane.classList.add('zoomed-eye');
                  setTimeout(() => { overlay.classList.add('active'); }, 800);
               } else {
                  airplane.classList.remove('zoomed-eye');
                  overlay.classList.remove('active');
               }
            }

            // Extract exact pixel coordinates from SVG path
            let pt = MotionPathPlugin.getPositionOnPath("#airplanePathBase", actualPathProg, true);
            
            // Translate the massive Map wrapping SVG in reverse!
            // Map offsets so plane remains visually center
            let mapWidth = flightSvg.viewBox.baseVal.width;
            let mapHeight = flightSvg.viewBox.baseVal.height;
            // The canvas is 500x1000 scaled via CSS. 
            // We use simple percentage translation roughly based on progress
            gsap.set(flightSvg, { 
               x: -pt.x + (window.innerWidth / 3), 
               y: -pt.y + (window.innerHeight / 2) 
            });

            // Adjust airplane rotation based on motion delta
            let rotation = MotionPathPlugin.getRotationOnPath("#airplanePathBase", actualPathProg, true);
            gsap.set(airplane, { rotation: rotation });

            // Altitude HUD update
            if(altitudeHud) altitudeHud.innerText = `Cruising Altitude: ${Math.floor(prog * 35000)}ft`;

            // Audio Logic based on scroll velocity 
            if(Math.abs(self.getVelocity()) > 50) {
               flightAudio.play().catch(e=>e);
               flightAudio.volume = Math.min(1, Math.abs(self.getVelocity()) / 1000);
            }
         }
       },
       ease: "none"
     });

     if (backBtn) {
        backBtn.addEventListener('click', () => {
           overlay.classList.remove('active');
           airplane.classList.remove('zoomed-eye');
           // the user would need to scroll immediately to clear the 0.99 threshold 
        });
     }
     
     // Travel Modal Node Clicks
     const mapNodes = document.querySelectorAll('.map-node');
     const modals = document.querySelectorAll('.t-modal');

     mapNodes.forEach(node => {
       node.addEventListener('click', (e) => {
         modals.forEach(m => m.classList.remove('active'));
         passportStamp.classList.remove('stamped');
         
         const dest = node.getAttribute('data-dest');
         const modal = document.getElementById('tModal' + dest.charAt(0).toUpperCase() + dest.slice(1));
         
         if (modal) {
            const containerRect = document.getElementById('flightPathContainer').getBoundingClientRect();
            const nodeRect = node.getBoundingClientRect();
            modal.style.left = (nodeRect.left - containerRect.left + 30) + 'px';
            modal.style.top = (nodeRect.top - containerRect.top - 20) + 'px';
            modal.classList.add('active');
            
            passportStamp.style.left = (nodeRect.left - containerRect.left - 100) + 'px';
            passportStamp.style.top = (nodeRect.top - containerRect.top - 50) + 'px';
            setTimeout(() => { passportStamp.classList.add('stamped'); }, 100);
         }
       });
     });
     
     document.getElementById('flightPathContainer').addEventListener('click', (e) => {
       if(!e.target.closest('.map-node') && !e.target.closest('.t-modal')) {
         modals.forEach(m => m.classList.remove('active'));
         passportStamp.classList.remove('stamped');
       }
     });
  }

});
