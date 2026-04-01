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

    // Boot sequence animation
    const bootLines = [
      "Starting kernel...",
      "Mounting root filesystem...",
      "Loading user profile 'kshetra'...",
      "Warning: Portfolio V2 encryption detected."
    ];
    const bootEl = document.getElementById('bootSequence');
    let delay = 0;
    bootLines.forEach((line, i) => {
      setTimeout(() => {
        const p = document.createElement('div');
        p.textContent = line;
        bootEl.appendChild(p);
      }, delay);
      delay += 400;
    });
  } else {
    // If not locked, start typing immediately
    startTypingEffect();
  }

  // Feature 6: Live Console Subsystem
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

  // Setup IDE Tabs & Explorer Navigation (Feature 5 & 18)
  const fileItems = document.querySelectorAll('.file-item');
  const tabs = document.querySelectorAll('.tab');
  const fileViews = document.querySelectorAll('.file-view');
  const currentFileName = document.getElementById('currentFileName');

  function openFile(tabId) {
    // Update active state
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
      // Update breadcrumb
      if (currentFileName) {
        currentFileName.textContent = tab ? tab.textContent.replace('×', '').trim() : tabId;
      }
    } else {
      // 404 Route
      const panic = document.getElementById('kernel-panic');
      if (panic) panic.classList.add('active');
      logToConsole(`File descriptor for ${tabId} not found. Kernel Panic.`, 'error');
    }
  }

  fileItems.forEach(item => {
    item.addEventListener('click', () => {
      openFile(item.getAttribute('data-tab'));
    });
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      if (e.target.classList.contains('close-tab')) {
        // Mock close logic
        logToConsole(`Closed ${tab.getAttribute('data-tab')}`, 'info');
        tab.style.display = 'none';
        return;
      }
      openFile(tab.getAttribute('data-tab'));
    });
  });

  // Folder toggle
  document.querySelectorAll('.folder-title').forEach(ft => {
    ft.addEventListener('click', () => {
      ft.parentElement.classList.toggle('open');
      const chev = ft.querySelector('.chevron');
      chev.textContent = ft.parentElement.classList.contains('open') ? '˅' : '>';
    });
  });

  // Feature 4: Command Palette
  const cmdPalette = document.getElementById('cmd-palette');
  const cmdInput = document.getElementById('cmdInput');
  const cmdOptions = document.getElementById('cmdOptions');
  let selectedCmdIndex = 0;

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      cmdPalette.showModal();
      cmdInput.focus();
      logToConsole('Command palette opened.', 'info');
    }
    if (e.key === 'Escape' && cmdPalette.open) {
      cmdPalette.close();
    }
  });

  if (cmdInput && cmdOptions) {
    const items = Array.from(cmdOptions.querySelectorAll('li'));
    
    function updatePaletteSelection() {
      items.forEach((item, i) => {
        item.classList.toggle('selected', i === selectedCmdIndex);
      });
    }

    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedCmdIndex = (selectedCmdIndex + 1) % items.length;
        updatePaletteSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedCmdIndex = (selectedCmdIndex - 1 + items.length) % items.length;
        updatePaletteSelection();
      } else if (e.key === 'Enter') {
        items[selectedCmdIndex].click();
      }
    });

    items.forEach((item, i) => {
      item.addEventListener('mouseenter', () => {
        selectedCmdIndex = i;
        updatePaletteSelection();
      });
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        if (action === 'nav') {
          const target = item.getAttribute('data-target').replace('#', '');
          openFile(target);
        } else if (action === 'theme') {
          const theme = item.getAttribute('data-theme');
          setTheme(theme);
        } else if (action === 'matrix') {
          toggleMatrix();
        } else if (action === 'sudo') {
          toggleSudo();
        }
        cmdPalette.close();
        cmdInput.value = '';
      });
    });
    
    // Initial setup
    updatePaletteSelection();
  }

  // Feature 2: Typing Animation
  function startTypingEffect() {
    const el = document.getElementById('typeWriterTarget');
    if (!el) return;
    const text = el.getAttribute('data-text');
    el.textContent = '';
    let i = 0;
    function typeChar() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(typeChar, 45 + Math.random() * 30);
      } else {
        // Done
        logToConsole('Hero interface loaded and executed.', 'info');
      }
    }
    setTimeout(typeChar, 500);
  }

  // Theme Toggler
  const themeNames = {
    'theme-terminal': '{} Terminal Theme',
    'theme-cyberpunk': '<> Cyberpunk Override',
    'theme-synthwave': '() Synthwave Sunset'
  };
  function setTheme(theme) {
    document.body.classList.remove('theme-terminal', 'theme-cyberpunk', 'theme-synthwave');
    document.body.classList.add(theme);
    const indicator = document.getElementById('themeIndicator');
    if (indicator) indicator.textContent = themeNames[theme];
    logToConsole(`Theme switched to ${theme}`, 'info');
  }

  const styleBtn = document.getElementById('styleBtn');
  if (styleBtn) {
    styleBtn.addEventListener('click', () => {
      // Cycle theme just for the button
      const themes = Object.keys(themeNames);
      const current = themes.find(t => document.body.classList.contains(t)) || themes[0];
      const nextIdx = (themes.indexOf(current) + 1) % themes.length;
      setTheme(themes[nextIdx]);
    });
  }

  // Matrix Feature (21)
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let matrixInterval = null;
  
  function initMatrix() {
    if (!canvas || !ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~'.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    for(let x = 0; x < columns; x++) drops[x] = 1;

    matrixInterval = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';
      
      for(let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 33);
  }

  function toggleMatrix() {
    document.body.classList.toggle('matrix-active');
    if (document.body.classList.contains('matrix-active')) {
      if (!matrixInterval) initMatrix();
      logToConsole('Matrix background enabled.', 'info');
    } else {
      logToConsole('Matrix background disabled.', 'info');
    }
  }

  // Sudo Mode Feature (24)
  function toggleSudo() {
    const isSudo = document.body.classList.toggle('sudo-mode');
    if (isSudo) {
      logToConsole('SUDO MODE ENABLED. Privileges escalated.', 'warn');
      const restricted = document.getElementById('restricted-project');
      if (restricted) restricted.style.display = 'block';
    } else {
      logToConsole('SUDO MODE DISABLED. Privileges revoked.', 'info');
    }
  }

  // Feature 19: Tooltips
  const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');
  const tooltipEl = document.getElementById('fileTooltip');

  tooltipTriggers.forEach(t => {
    t.addEventListener('mousemove', (e) => {
      if (!tooltipEl) return;
      tooltipEl.textContent = t.getAttribute('data-tooltip');
      tooltipEl.style.opacity = '1';
      tooltipEl.style.left = (e.clientX + 10) + 'px';
      tooltipEl.style.top = (e.clientY + 10) + 'px';
    });
    t.addEventListener('mouseleave', () => {
      if (!tooltipEl) return;
      tooltipEl.style.opacity = '0';
    });
  });

  // Feature 10 & 22 & 29: Status Bar Updaters
  const pingCounter = document.getElementById('pingCounter');
  const cpuUsage = document.getElementById('cpuUsage');
  const ramUsage = document.getElementById('ramUsage');
  const uptimeCounter = document.getElementById('uptimeCounter');
  const cursorPos = document.getElementById('cursorPos');

  setInterval(() => {
    if (pingCounter) pingCounter.textContent = Math.floor(10 + Math.random() * 40);
    if (cpuUsage) cpuUsage.textContent = Math.floor(5 + Math.random() * 20);
    if (ramUsage) ramUsage.textContent = (3.5 + Math.random() * 1.5).toFixed(1);
  }, 2000);

  let seconds = 0;
  setInterval(() => {
    seconds++;
    if (uptimeCounter) {
      const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      uptimeCounter.textContent = `Uptime: ${h}:${m}:${s}`;
    }
  }, 1000);

  // Mouse move updates line/col
  const editorViewport = document.getElementById('editorViewport');
  if (editorViewport && cursorPos) {
    editorViewport.addEventListener('mousemove', (e) => {
      const rect = editorViewport.getBoundingClientRect();
      const y = Math.max(1, Math.floor((e.clientY - rect.top) / 22) + 1);
      const x = Math.max(1, Math.floor((e.clientX - rect.left) / 8) + 1);
      cursorPos.textContent = `Ln ${y}, Col ${x}`;
    });
  }

  // Populate Line Numbers (purely visual)
  document.querySelectorAll('.line-numbers').forEach(ln => {
    let html = '';
    for(let i=1; i<=50; i++) html += i + '<br>';
    ln.innerHTML = html;
  });

  // Event listners for action buttons
  const runProjectsBtn = document.getElementById('runProjectsBtn');
  if (runProjectsBtn) {
    runProjectsBtn.addEventListener('click', () => {
      logToConsole('Mock Executing run_projects.sh...', 'info');
      setTimeout(() => openFile('projects'), 300);
    });
  }
  
  const rebootBtn = document.getElementById('rebootBtn');
  if (rebootBtn) {
    rebootBtn.addEventListener('click', () => {
      logToConsole('System Reboot requested.', 'warn');
      openFile('readme');
    });
  }

  // Mock Github graph
  const squares = document.getElementById('contribSquares');
  if (squares) {
    for(let i=0; i<365; i++) {
      const sq = document.createElement('div');
      sq.className = 'square';
      // Random activity level 0-4
      let level = 0;
      if (Math.random() > 0.5) {
        level = Math.floor(Math.random() * 4) + 1;
      }
      if (level > 0) sq.setAttribute('data-level', level);
      squares.appendChild(sq);
    }
  }
  
  // Set default theme setup
  setTheme('theme-terminal');
});
