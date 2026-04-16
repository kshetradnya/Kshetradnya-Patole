document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // UNIVERSE 1: THE PRO MODE (NOW DEFAULT)
  // ==========================================
  
  const ideUniverse = document.getElementById('ide-universe');
  const proUniverse = document.getElementById('pro-universe');
  const launchBtn = document.getElementById('launchIdeBtn');
  const exitIdeBtns = [document.getElementById('exitIdeBtn'), document.getElementById('exitIdeTopBtn')];

  // GSAP ScrollTrigger init
  gsap.registerPlugin(ScrollTrigger);
  
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

});
