// ==========================================
// UNIVERSE 1: DEVELOPER IDE ENGINE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // MATRIX LOADING SCREEN (No Password)
  // ==========================================
  const matrixLoader = document.getElementById('matrix-loader');
  const loaderCanvas = document.getElementById('loaderMatrixCanvas');
  const loaderBody = document.getElementById('loaderBody');
  const loaderGranted = document.getElementById('loaderGranted');

  if (matrixLoader && loaderCanvas) {
    // -- Full-screen Matrix rain on loader canvas --
    const lctx = loaderCanvas.getContext('2d');
    loaderCanvas.width = window.innerWidth;
    loaderCanvas.height = window.innerHeight;

    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:<>?ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ01'.split('');
    const fontSize = 15;
    const columns = Math.floor(loaderCanvas.width / fontSize);
    const drops = Array(columns).fill(1);

    function drawMatrix() {
      lctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      lctx.fillRect(0, 0, loaderCanvas.width, loaderCanvas.height);
      lctx.font = `${fontSize}px 'JetBrains Mono', 'Fira Code', monospace`;
      for (let i = 0; i < drops.length; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        // Brighter leading character
        if (Math.random() > 0.9) {
          lctx.fillStyle = '#ffffff';
        } else {
          const green = Math.floor(150 + Math.random() * 105);
          lctx.fillStyle = `rgb(0, ${green}, 0)`;
        }
        lctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > loaderCanvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    const matrixRafId = { id: null };
    function runMatrix() { matrixRafId.id = requestAnimationFrame(runMatrix); drawMatrix(); }
    runMatrix();

    // -- Boot sequence lines typed into the terminal box --
    const bootLines = [
      { text: '$ ./portfolio --init',            delay: 0,    color: '#7ee787' },
      { text: 'Booting kernel v2.0.0...',         delay: 350,  color: '#58a6ff' },
      { text: 'Loading filesystem modules...',    delay: 750,  color: '#58a6ff' },
      { text: 'Mounting /dev/portfolio...',       delay: 1100, color: '#58a6ff' },
      { text: 'Decrypting portfolio assets...',   delay: 1500, color: '#f0883e' },
      { text: 'Verifying identity...',            delay: 1950, color: '#f0883e' },
      { text: 'Resolving dependencies...',        delay: 2350, color: '#58a6ff' },
      { text: 'Initializing UI subsystems...',    delay: 2750, color: '#58a6ff' },
      { text: 'Loading user profile: kshetra',   delay: 3100, color: '#7ee787' },
      { text: 'All systems nominal.',             delay: 3500, color: '#7ee787' },
    ];

    bootLines.forEach(({ text, delay, color }) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'loader-line';
        line.style.color = color;
        line.textContent = text;
        loaderBody.appendChild(line);
        loaderBody.scrollTop = loaderBody.scrollHeight;
      }, delay);
    });

    // -- "ACCESS GRANTED" flash after boot lines --
    setTimeout(() => {
      loaderGranted.classList.remove('hidden');
      loaderGranted.classList.add('show');
    }, 4000);

    // -- Fade out loader and enter the IDE --
    setTimeout(() => {
      matrixLoader.classList.add('fade-out');
      cancelAnimationFrame(matrixRafId.id);
      setTimeout(() => {
        matrixLoader.style.display = 'none';
        startTypingEffect();
        logToConsole('System boot complete. Portfolio loaded.', 'info');
      }, 700);
    }, 5200);
  } else {
    startTypingEffect();
  }

  // Live Console Subsystem
  const consoleBody = document.getElementById('consoleBody');
  function logToConsole(message, type = 'info') {
    if (!consoleBody) return;
    const line = document.createElement('div');
    line.className = 'log-line';
    const time = new Date().toLocaleTimeString('en-US', {hour12:false});
    line.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-${type}">${message}</span>`;
    consoleBody.appendChild(line);
    consoleBody.scrollTop = consoleBody.scrollHeight;
  }

  // IDE Tabs & File Navigation
  const fileItems = document.querySelectorAll('.file-item');
  const tabs = document.querySelectorAll('.tab');
  const fileViews = document.querySelectorAll('.file-view');
  const currentFileName = document.getElementById('currentFileName');

  function openFile(tabId) {
    fileItems.forEach(i => i.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    fileViews.forEach(v => v.classList.remove('active'));

    const item = document.querySelector(`.file-item[data-tab="${tabId}"]`);
    const tab = document.querySelector(`.tab[data-tab="${tabId}"]`);
    const view = document.getElementById(tabId);

    if (item) item.classList.add('active');
    if (tab) tab.classList.add('active');
    if (view) {
      view.classList.add('active');
      logToConsole(`Opened ${tabId} in editor viewport.`, 'info');
      if (currentFileName) currentFileName.textContent = tab ? tab.textContent.replace('×', '').trim() : tabId;
    } else {
      const panic = document.getElementById('kernel-panic');
      if (panic) panic.classList.add('active');
      logToConsole(`File descriptor for ${tabId} not found. Kernel Panic.`, 'error');
    }
  }

  fileItems.forEach(item => { item.addEventListener('click', () => openFile(item.getAttribute('data-tab'))); });
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      if (e.target.classList.contains('close-tab')) {
        logToConsole(`Closed ${tab.getAttribute('data-tab')}`, 'info');
        tab.style.display = 'none';
        return;
      }
      openFile(tab.getAttribute('data-tab'));
    });
  });

  // Folder toggles
  document.querySelectorAll('.folder-title').forEach(ft => {
    ft.addEventListener('click', () => {
      ft.parentElement.classList.toggle('open');
      const chev = ft.querySelector('.chevron');
      chev.textContent = ft.parentElement.classList.contains('open') ? '˅' : '>';
    });
  });

  // Command Palette
  const cmdPalette = document.getElementById('cmd-palette');
  const cmdInput = document.getElementById('cmdInput');
  const cmdOptions = document.getElementById('cmdOptions');
  let selectedCmdIndex = 0;

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      cmdPalette.showModal();
      cmdInput.focus();
    }
    if (e.key === 'Escape' && cmdPalette.open) cmdPalette.close();
  });

  if (cmdInput && cmdOptions) {
    const items = Array.from(cmdOptions.querySelectorAll('li'));
    function updatePaletteSelection() { items.forEach((item, i) => item.classList.toggle('selected', i === selectedCmdIndex)); }

    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); selectedCmdIndex = (selectedCmdIndex + 1) % items.length; updatePaletteSelection(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); selectedCmdIndex = (selectedCmdIndex - 1 + items.length) % items.length; updatePaletteSelection(); }
      else if (e.key === 'Enter') items[selectedCmdIndex].click();
    });

    items.forEach((item, i) => {
      item.addEventListener('mouseenter', () => { selectedCmdIndex = i; updatePaletteSelection(); });
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        if (action === 'nav') openFile(item.getAttribute('data-target').replace('#', ''));
        else if (action === 'theme') setTheme(item.getAttribute('data-theme'));
        else if (action === 'matrix') toggleMatrix();
        else if (action === 'sudo') toggleSudo();
        else if (action === 'portal') toggleUniverse();
        cmdPalette.close(); cmdInput.value = '';
      });
    });
    updatePaletteSelection();
  }

  // Typing Effect
  function startTypingEffect() {
    const el = document.getElementById('typeWriterTarget');
    if (!el) return;
    const text = el.getAttribute('data-text');
    el.textContent = '';
    let i = 0;
    function typeChar() {
      if (i < text.length) {
        el.textContent += text.charAt(i); i++;
        setTimeout(typeChar, 45 + Math.random() * 30);
      }
    }
    setTimeout(typeChar, 500);
  }

  // Status Bar & Tooltips
  const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');
  const tooltipEl = document.getElementById('fileTooltip');
  tooltipTriggers.forEach(t => {
    t.addEventListener('mousemove', (e) => {
      if (!tooltipEl) return;
      tooltipEl.textContent = t.getAttribute('data-tooltip');
      tooltipEl.style.opacity = '1';
      tooltipEl.style.left = (e.clientX + 10) + 'px'; tooltipEl.style.top = (e.clientY + 10) + 'px';
    });
    t.addEventListener('mouseleave', () => { if (tooltipEl) tooltipEl.style.opacity = '0'; });
  });

  setInterval(() => {
    const pC = document.getElementById('pingCounter');
    if (pC) pC.textContent = Math.floor(10 + Math.random() * 40);
  }, 2000);

  // Themes
  function setTheme(theme) {
    document.body.classList.remove('theme-terminal', 'theme-cyberpunk', 'theme-synthwave');
    document.body.classList.add(theme);
    logToConsole(`Theme switched to ${theme}`, 'info');
  }

  // Matrix and Sudo
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let matrixInterval = null;
  function toggleMatrix() {
    document.body.classList.toggle('matrix-active');
    if (document.body.classList.contains('matrix-active') && !matrixInterval && canvas) {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      const letters = '01'.split(''); const columns = canvas.width / 14; const drops = [];
      for(let x = 0; x < columns; x++) drops[x] = 1;
      matrixInterval = setInterval(() => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0'; ctx.font = '14px monospace';
        for(let i = 0; i < drops.length; i++) {
          ctx.fillText(letters[Math.floor(Math.random() * letters.length)], i * 14, drops[i] * 14);
          if (drops[i] * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
      }, 33);
    }
  }

  function toggleSudo() {
    const isSudo = document.body.classList.toggle('sudo-mode');
    const restricted = document.getElementById('restricted-project');
    if (restricted) restricted.style.display = isSudo ? 'block' : 'none';
  }

  // Populate line numbers
  document.querySelectorAll('.line-numbers').forEach(ln => { let h = ''; for(let i=1; i<=50; i++) h += i + '<br>'; ln.innerHTML = h; });
  const runProjectsBtn = document.getElementById('runProjectsBtn');
  if (runProjectsBtn) runProjectsBtn.addEventListener('click', () => { setTimeout(() => openFile('projects'), 300); });
  if (document.getElementById('rebootBtn')) document.getElementById('rebootBtn').addEventListener('click', () => openFile('readme'));

  const styleBtn = document.getElementById('styleBtn');
  if (styleBtn) {
    const themes = ['theme-terminal', 'theme-cyberpunk', 'theme-synthwave'];
    let currentThemeIndex = 0;
    styleBtn.addEventListener('click', () => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      setTheme(themes[currentThemeIndex]);
    });
  }

  // ==========================================
  // INTERACTIVE REPL LOGIC
  // ==========================================
  const replInput = document.getElementById('replInput');
  const replHistory = document.getElementById('replHistory');
  
  if (replInput && replHistory) {
    replInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = replInput.value.trim().toLowerCase();
        if (!cmd) return;
        
        // Echo command
        const line = document.createElement('div');
        line.className = 'repl-line';
        line.innerHTML = `<span class="user-prompt">➜  ~</span> <span class="syntax-command">${cmd}</span>`;
        replHistory.appendChild(line);
        
        // Output response
        const out = document.createElement('p');
        out.className = 'repl-output';
        
        if (cmd === 'help') {
          out.innerHTML = 'Available commands:<br>- <span class="syntax-keyword">help</span>: Show this message<br>- <span class="syntax-keyword">clear</span>: Clear terminal<br>- <span class="syntax-keyword">whoami</span>: Print effective user ID<br>- <span class="syntax-keyword">projects</span>: Open projects view<br>- <span class="syntax-keyword">frontpage</span> / <span class="syntax-keyword">startx</span>: Launch professional web UI';
        } else if (cmd === 'clear') {
          replHistory.innerHTML = '';
          out.innerHTML = '';
        } else if (cmd === 'whoami') {
          out.innerHTML = 'kshetradnya<br>developer, student, creator';
        } else if (cmd === 'contact') {
          out.innerHTML = 'Loading contact interface...';
          setTimeout(() => openFile('contact'), 300);
        } else if (cmd === 'projects') {
          out.innerHTML = 'Executing ./run_projects.sh...';
          setTimeout(() => openFile('projects'), 400);
        } else if (cmd === 'frontpage' || cmd === 'startx') {
          out.innerHTML = 'Initializing Frontpage Window Manager...';
          setTimeout(toggleFrontpageMode, 600);
        } else {
          out.innerHTML = `zsh: command not found: ${cmd}`;
        }
        
        if (out.innerHTML) replHistory.appendChild(out);
        replInput.value = '';
        replInput.scrollIntoView();
      }
    });
  }

  // ==========================================
  // FRONTPAGE MODE LOGIC & SECRET BUTTON
  // ==========================================
  const versionBtn = document.getElementById('versionSecretBtn');
  const fpContainer = document.getElementById('frontpageContainer');
  const fpExitBtn = document.getElementById('fpExitBtn');
  let clickCount = 0;
  let clickTimer = null;
  
  function toggleFrontpageMode() {
    const isFp = document.body.classList.toggle('mode-frontpage');
    if (isFp) {
      logToConsole('Loading Frontpage Display Server...', 'warn');
      fpContainer.classList.remove('hidden');
    } else {
      fpContainer.classList.add('hidden');
      logToConsole('Returned to IDE terminal.', 'info');
    }
  }

  if (versionBtn) {
    versionBtn.addEventListener('click', () => {
      clickCount++;
      if (clickCount >= 3) {
        clickCount = 0;
        toggleFrontpageMode();
      }
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clickCount = 0; }, 1000);
    });
  }

  if (fpExitBtn) {
    fpExitBtn.addEventListener('click', () => {
      document.body.classList.remove('mode-frontpage');
      fpContainer.classList.add('hidden');
      logToConsole('Exited Frontpage Display.', 'info');
    });
  }

  // ==========================================
  // UNIVERSE 2: LIFESTYLE / CLEAN UI LOGIC
  // ==========================================

  const portalBtnIDE = document.getElementById('portalBtnIDE');
  const portalBtnClean = document.getElementById('portalBtnClean');
  const signatureLayer = document.getElementById('signature-transition');
  const cleanUIContainer = document.getElementById('cleanUIContainer');
  const sigText = document.querySelector('.signature-text');
  const drawLine = document.querySelector('.draw-line');
  const dynamicIsland = document.getElementById('dynamicIsland');

  function toggleUniverse() {
    const isLifestyle = document.body.classList.toggle('mode-lifestyle');
    
    if (isLifestyle) {
      logToConsole('Loading alternate universe profile...', 'warn');
      // 1. Hide IDE visually
      document.body.style.backgroundColor = '#f7f9fa';
      
      // 2. Play Signature Animation
      signatureLayer.classList.remove('hidden');
      drawLine.style.animation = 'none'; // reset
      void drawLine.offsetWidth; // trigger reflow
      drawLine.style.animation = 'stravaDraw 1.5s ease forwards';
      
      setTimeout(() => { sigText.classList.add('reveal'); }, 800);

      // 3. Fade into Clean UI
      setTimeout(() => {
        signatureLayer.classList.add('hidden');
        cleanUIContainer.classList.remove('hidden');
        sigText.classList.remove('reveal');
        
        // Dynamic Island toast
        setTimeout(() => {
          dynamicIsland.classList.add('show');
          setTimeout(() => { dynamicIsland.classList.remove('show'); }, 3000);
        }, 500);

      }, 2500);

    } else {
      // Revert back to IDE
      cleanUIContainer.classList.add('hidden');
      document.body.style.backgroundColor = ''; // revert to CSS var
      logToConsole('Returned to Terminal Mode.', 'info');
    }
  }

  if (portalBtnIDE) portalBtnIDE.addEventListener('click', toggleUniverse);
  if (portalBtnClean) portalBtnClean.addEventListener('click', toggleUniverse);


  // Clean UI Navigation (Hobbies <-> Merits) & Goal Replay Matrix
  const cleanNavPills = document.querySelectorAll('.nav-pill[data-target]');
  const cleanPages = document.querySelectorAll('.clean-page');
  const replayWrapper = document.getElementById('goalReplayContainer');

  cleanNavPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      cleanNavPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const targetId = pill.getAttribute('data-target');

      cleanPages.forEach(p => p.classList.remove('active'));
      const activePage = document.getElementById(targetId);
      activePage.classList.add('active');

      // Trigger "Goal Replay" animation if switching to merits
      if (targetId === 'merits-page' && replayWrapper) {
        replayWrapper.classList.remove('replay-animating');
        void replayWrapper.offsetWidth; // Reflow
        replayWrapper.classList.add('replay-animating');
      }
    });
  });

  // Magnetic Button Math
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });

  // Heatmap generation for Strava card
  const heatmapGrid = document.getElementById('runningHeatmap');
  if (heatmapGrid) {
    for (let i = 0; i < 60; i++) {
      const box = document.createElement('div');
      box.className = 'heat-box';
      if (Math.random() > 0.4) {
        box.setAttribute('data-act', Math.floor(Math.random() * 3) + 1);
      } else {
        box.setAttribute('data-act', 0);
      }
      heatmapGrid.appendChild(box);
    }
  }

  // Scroll Reveal Mechanics (Apple-style storytelling)
  const reveals = document.querySelectorAll('.scroll-reveal, .soft-fade');
  const statTickers = document.querySelectorAll('.stat-ticker');

  const cleanObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Ticker Logic
        if (entry.target.classList.contains('stat-ticker') || entry.target.querySelector('.stat-ticker')) {
          const tickObj = entry.target.classList.contains('stat-ticker') ? entry.target : entry.target.querySelector('.stat-ticker');
          if (!tickObj.classList.contains('counted')) {
            tickObj.classList.add('counted');
            const target = parseInt(tickObj.getAttribute('data-target') || '0', 10);
            let c = 0;
            const step = Math.ceil(target / 40);
            const interval = setInterval(() => {
              c += step;
              if (c >= target) { c = target; clearInterval(interval); }
              tickObj.textContent = c;
            }, 30);
          }
        }
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => cleanObserver.observe(el));
  statTickers.forEach(el => cleanObserver.observe(el));

  // Custom Cursor for Clean UI
  const spotCursor = document.getElementById('spotlightCursor');
  document.addEventListener('mousemove', (e) => {
    // Only show custom context when in lifestyle mode
    if (document.body.classList.contains('mode-lifestyle') && spotCursor) {
      spotCursor.style.opacity = '1';
      spotCursor.style.left = e.clientX + 'px';
      spotCursor.style.top = e.clientY + 'px';
    } else if (spotCursor) {
      spotCursor.style.opacity = '0';
    }
  });

  document.addEventListener('mouseleave', () => {
    if (spotCursor) spotCursor.style.opacity = '0';
  });

  // Merit Background Hover & Detail Overlay
  const timelineNodes = document.querySelectorAll('.timeline-node');
  const defaultLifestyleBg = '#f7f9fa';
  const meritColors = ['#e0f2fe', '#dcfce7', '#fef3c7', '#f3e8ff', '#f1f5f9'];
  
  const meritDetailOverlay = document.getElementById('meritDetailOverlay');
  const closeMeritBtn = document.getElementById('closeMeritBtn');
  const meritDetailYear = document.getElementById('meritDetailYear');
  const meritDetailTitle = document.getElementById('meritDetailTitle');
  const meritDetailBody = document.getElementById('meritDetailBody');
  
  timelineNodes.forEach((node, index) => {
    node.addEventListener('mouseenter', () => {
      if (document.body.classList.contains('mode-lifestyle')) {
        document.body.style.backgroundColor = meritColors[index % meritColors.length];
        node.style.transform = 'translateY(-5px)';
        node.style.transition = 'transform 0.3s ease';
      }
    });
    node.addEventListener('mouseleave', () => {
      if (document.body.classList.contains('mode-lifestyle')) {
        document.body.style.backgroundColor = defaultLifestyleBg;
        node.style.transform = 'translateY(0)';
      }
    });

    node.addEventListener('click', () => {
      if (meritDetailOverlay) {
        const year = node.getAttribute('data-year');
        const h3 = node.querySelector('h3') ? node.querySelector('h3').innerText : 'Milestone';
        const p = node.querySelector('p') ? node.querySelector('p').innerText : '';
        
        meritDetailYear.textContent = year;
        meritDetailTitle.textContent = h3;
        meritDetailBody.textContent = p;
        
        meritDetailOverlay.classList.remove('hidden');
        void meritDetailOverlay.offsetWidth; // Reflow
        meritDetailOverlay.classList.add('active');
      }
    });
  });

  if (closeMeritBtn) {
    closeMeritBtn.addEventListener('click', () => {
      meritDetailOverlay.classList.remove('active');
      setTimeout(() => {
        meritDetailOverlay.classList.add('hidden');
      }, 400);
    });
  }

  // ==========================================
  // FRONTPAGE TO LIFESTYLE NAVIGATION
  // ==========================================
  const jumpToLifestyleLinks = document.querySelectorAll('.nav-to-univ2');
  jumpToLifestyleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPageId = link.getAttribute('data-target');
      
      // Exit Frontpage Mode
      document.body.classList.remove('mode-frontpage');
      if (fpContainer) fpContainer.classList.add('hidden');
      
      // Enter Lifestyle Mode
      document.body.classList.add('mode-lifestyle');
      document.body.style.backgroundColor = '#f7f9fa';
      if (cleanUIContainer) cleanUIContainer.classList.remove('hidden');
      
      // Programmatically click the right pill in lifestyle mode
      const pillToClick = document.querySelector(`.nav-pill[data-target="${targetPageId}"]`);
      if (pillToClick) pillToClick.click();
      
      logToConsole(`Jumped from Professional to Lifestyle Profile: ${targetPageId}`, 'info');
    });
  });

  // Default theme initialized in CSS, but just to ensure log fires
  logToConsole('Portfolio Systems Initialized.', 'info');
});
