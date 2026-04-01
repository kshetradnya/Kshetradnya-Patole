// ==========================================
// UNIVERSE 1: DEVELOPER IDE ENGINE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Feature 1: Password Logic
  const passwordInput = document.getElementById('passwordInput');
  const loginFeedback = document.getElementById('loginFeedback');
  const terminalLogin = document.getElementById('terminal-login');
  
  if (passwordInput && terminalLogin && document.body.classList.contains('access-locked')) {
    passwordInput.focus();
    passwordInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const val = passwordInput.value.toLowerCase().trim();
        if (val === 'vibecoding') {
          loginFeedback.style.color = 'var(--accent, #3fb950)';
          loginFeedback.textContent = "Access granted. Initiating IDE...";
          setTimeout(() => {
            document.body.classList.remove('access-locked');
            terminalLogin.classList.add('hidden');
            logToConsole('System login successful. IDE loaded.', 'info');
            startTypingEffect();
          }, 800);
        } else {
          loginFeedback.style.color = 'var(--error, #f85149)';
          loginFeedback.textContent = `Sorry, try again. (${val} is incorrect)`;
          passwordInput.value = '';
          logToConsole('Failed login attempt detected.', 'error');
        }
      }
    });

    const bootLines = ["Starting kernel...", "Mounting root filesystem...", "Loading user profile 'kshetra'...", "Warning: Portfolio V2 encryption detected."];
    const bootEl = document.getElementById('bootSequence');
    let delay = 0;
    bootLines.forEach((line) => {
      setTimeout(() => {
        const p = document.createElement('div');
        p.textContent = line;
        bootEl.appendChild(p);
      }, delay);
      delay += 400;
    });
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

  // Default theme initialized in CSS, but just to ensure log fires
  logToConsole('Portfolio Systems Initialized.', 'info');
});
