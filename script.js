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
  // HOBBIES INTERACTION LOGIC
  // ==========================================

  // Hobby 1: Photography Camera Click
  const shutterBtn = document.getElementById('shutterBtn');
  const cameraFlash = document.getElementById('cameraFlash');
  const polaroidRender = document.getElementById('polaroidRender');
  
  if (shutterBtn && cameraFlash && polaroidRender) {
    shutterBtn.addEventListener('click', () => {
      // Flash effect
      cameraFlash.classList.add('flash-active');
      setTimeout(() => {
        cameraFlash.classList.remove('flash-active');
        // Drop polaroid
        polaroidRender.classList.add('dropped');
      }, 100);
    });
  }

  // Hobby 2: Running Dino Game
  const canvas = document.getElementById('dinoCanvas');
  const startGameBtn = document.getElementById('startGameBtn');
  const gameOverlay = document.getElementById('gameOverlay');
  
  if (canvas && startGameBtn && gameOverlay) {
    const ctx = canvas.getContext('2d');
    let isGameRunning = false;
    let frame = 0;
    
    // Game Entities
    const dino = { x: 50, y: 150, w: 20, h: 40, vy: 0, gravity: 0.6, jumpPower: -10, grounded: true };
    let obstacles = [];
    let problemTypes = ["🍔 Junk Food", "📚 Exams", "📱 Doomscrolling"];
    
    function resetGame() {
      dino.y = 150;
      dino.vy = 0;
      obstacles = [];
      frame = 0;
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

    function gameLoop() {
      if(!isGameRunning) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Physics applied to player
      dino.vy += dino.gravity;
      dino.y += dino.vy;
      if (dino.y >= 150) {
        dino.y = 150;
        dino.grounded = true;
      }
      
      // Draw Player (Avatar)
      ctx.fillStyle = '#333';
      ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
      ctx.fillStyle = '#007acc';
      ctx.fillRect(dino.x + 10, dino.y + 5, 5, 5); // Simple eye

      // Ground Line
      ctx.strokeStyle = '#bbb';
      ctx.beginPath(); ctx.moveTo(0, 190); ctx.lineTo(canvas.width, 190); ctx.stroke();

      // Obstacle Logic
      if (frame % 90 === 0 && frame > 0) {
        let type = problemTypes[Math.floor(Math.random() * problemTypes.length)];
        obstacles.push({ x: canvas.width, y: 165, w: 80, h: 25, text: type, passed: false });
      }
      
      for(let i=0; i<obstacles.length; i++) {
        let obs = obstacles[i];
        obs.x -= 4; // Move left
        
        ctx.fillStyle = '#ff5f56';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.fillStyle = '#fff';
        ctx.font = '10px sans-serif';
        ctx.fillText(obs.text, obs.x + 5, obs.y + 16);

        // Collision detection
        if (dino.x < obs.x + obs.w && dino.x + dino.w > obs.x &&
            dino.y < obs.y + obs.h && dino.y + dino.h > obs.y) {
          // Game Over hit
          isGameRunning = false;
          gameOverlay.style.display = 'flex';
          startGameBtn.innerHTML = "Oof! Restart Run";
        }
      }
      
      // Cleanup passed obstacles
      if(obstacles.length && obstacles[0].x < -100) obstacles.shift();

      frame++;
      if(isGameRunning) requestAnimationFrame(gameLoop);
    }
  }

  // Hobby 3: Travelling SVG GSAP
  if (document.getElementById('airplanePath') && document.getElementById('airplane')) {
     gsap.to("#airplane", {
       scrollTrigger: {
         trigger: "#flightPathContainer",
         start: "top 60%",    // start animation when container reaches 60% of viewport
         end: "bottom 80%",   // end animation near the bottom
         scrub: 1,            // bind directly to scroll
         scroller: ".pro-scroll-container"
       },
       motionPath: {
         path: "#airplanePath",
         align: "#airplanePath",
         alignOrigin: [0.5, 0.5],
         autoRotate: 90
       },
       ease: "none"
     });
     
     // Interactions for Map Nodes
     const mapNodes = document.querySelectorAll('.map-node');
     const mapTooltip = document.getElementById('mapTooltip');
     const flightContainer = document.getElementById('flightPathContainer');

     if (mapTooltip && flightContainer) {
       mapNodes.forEach(node => {
         node.addEventListener('mouseenter', (e) => {
           const info = node.getAttribute('data-info');
           mapTooltip.textContent = info;
           mapTooltip.classList.add('visible');
           
           // Position tooltip relative to container
           const containerRect = flightContainer.getBoundingClientRect();
           const nodeRect = node.getBoundingClientRect();
           mapTooltip.style.left = (nodeRect.left - containerRect.left + 20) + 'px';
           mapTooltip.style.top = (nodeRect.top - containerRect.top - 10) + 'px';
         });
         node.addEventListener('mouseleave', () => {
           mapTooltip.classList.remove('visible');
         });
       });
     }
  }

});
