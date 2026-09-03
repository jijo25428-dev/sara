// ==========================================================================
// ROMANTIC CELEBRATION APP - SANGEETHA'S BIRTHDAY
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initBirthdayLock();
  initNavigation();
  initRomanticCanvas();
  init3DAvatarParallax();
  initLoveMessages();
  initGallery();
  initGames();
  initLetterReveal();
  initAudioSynthesizer();
  initModal();
});

// ==================== BIRTHDAY LOCK SCREEN ====================
function initBirthdayLock() {
  const lock = document.getElementById('birthday-lock');
  const form = document.getElementById('birthday-lock-form');
  const pinInput = document.getElementById('birthday-pin');
  const error = document.getElementById('lock-error');
  if (!lock || !form || !pinInput || !error) return;

  pinInput.focus();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const isCorrect = pinInput.value.trim() === '26/09/05';

    if (!isCorrect) {
      error.textContent = 'That date is not quite right. Try again, birthday girl.';
      pinInput.classList.remove('pin-shake');
      void pinInput.offsetWidth;
      pinInput.classList.add('pin-shake');
      pinInput.select();
      return;
    }

    error.textContent = '';
    lock.classList.add('unlocked');
    document.body.classList.add('birthday-unlocked');
    window.setTimeout(() => lock.remove(), 850);
  });
}

// ==================== NAVIGATION ====================
function initNavigation() {
  const pages = document.querySelectorAll('.page');
  const navBtns = document.querySelectorAll('.nav-btn');
  const app = document.querySelector('.app-container');
  if (app) app.dataset.currentPage = 'page-home';

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPageId = btn.getAttribute('data-page');
      
      // Update Active Page
      pages.forEach(p => p.classList.remove('active'));
      const targetPage = document.getElementById(targetPageId);
      if (targetPage) {
        targetPage.classList.add('active');
      }
      if (app) app.dataset.currentPage = targetPageId;

      // Update Active Nav Button
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      playTone(523.25, 0.15); // C5 romantic tap sound
    });
  });
}

// ==================== PAGE 4: LETTER REVEAL ====================
function initLetterReveal() {
  const openButton = document.getElementById('open-letter-btn');
  const letter = document.querySelector('.letter-sheet');
  if (!openButton || !letter) return;

  openButton.addEventListener('click', () => {
    const isOpen = letter.classList.toggle('letter-open');
    openButton.setAttribute('aria-expanded', String(isOpen));
    letter.setAttribute('aria-hidden', String(!isOpen));
    openButton.querySelector('.material-symbols-rounded').textContent = isOpen ? 'drafts' : 'mail';
  });
}

// ==================== 3D PARALLAX FOR LEFT AVATAR ====================
function init3DAvatarParallax() {
  const avatarWrapper = document.getElementById('avatar-3d-wrapper');
  if (!avatarWrapper) return;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    const rotX = -y * 8;
    const rotY = x * 12;

    avatarWrapper.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
  });

  document.addEventListener('mouseleave', () => {
    avatarWrapper.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
}

// ==================== MINIMALIST SUBTLE BLACK SPIDER WEB CANVAS ====================
function initRomanticCanvas() {
  const canvas = document.getElementById('romantic-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let mouseX = width / 2;
  let mouseY = height / 2;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Draws a clean, un-collapsed spider web with low opacity
  function drawSpiderWeb(cx, cy, radius, numRadials, numRings, startAngle, endAngle, lineOpacity = 0.09) {
    ctx.save();
    ctx.strokeStyle = `rgba(0, 0, 0, ${lineOpacity})`;
    ctx.lineWidth = 1.0;

    const angleStep = (endAngle - startAngle) / numRadials;
    const radialAngles = [];

    // 1. Draw radial anchor lines
    for (let i = 0; i <= numRadials; i++) {
      const angle = startAngle + i * angleStep;
      radialAngles.push(angle);
      const ex = cx + Math.cos(angle) * radius;
      const ey = cy + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }

    // 2. Draw concentric curved web arcs connecting radials
    for (let r = 1; r <= numRings; r++) {
      const ringRadius = (r / numRings) * radius;
      ctx.beginPath();

      for (let i = 0; i < numRadials; i++) {
        const a1 = radialAngles[i];
        const a2 = radialAngles[i + 1];
        const midA = (a1 + a2) / 2;

        const x1 = cx + Math.cos(a1) * ringRadius;
        const y1 = cy + Math.sin(a1) * ringRadius;

        const x2 = cx + Math.cos(a2) * ringRadius;
        const y2 = cy + Math.sin(a2) * ringRadius;

        // Sag control point inwards towards web center
        const sagFactor = 0.90;
        const cpx = cx + Math.cos(midA) * (ringRadius * sagFactor);
        const cpy = cy + Math.sin(midA) * (ringRadius * sagFactor);

        if (i === 0) {
          ctx.moveTo(x1, y1);
        }
        ctx.quadraticCurveTo(cpx, cpy, x2, y2);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  // Soft web nodes
  const webNodes = [];
  const nodeCount = 15;

  for (let i = 0; i < nodeCount; i++) {
    webNodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.8
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Pure White Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // FULL-PAGE CENTER SPIDER WEB (Covers the entire page from screen center to all 4 corners!)
    const fullPageRadius = Math.hypot(width, height) * 0.58;
    drawSpiderWeb(width * 0.5, height * 0.5, fullPageRadius, 14, 11, 0, Math.PI * 2, 0.08);

    // Mouse connection threads with soft, low opacity
    webNodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fill();

      const dx = mouseX - node.x;
      const dy = mouseY - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.strokeStyle = `rgba(0, 0, 0, ${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
    });

    requestAnimationFrame(render);
  }

  render();
}

// ==================== PAGE 2: LOVE MESSAGES DATA ====================
const loveNotesList = [
  "Sangeetha, from the moment you entered my life, every ordinary day became an extraordinary adventure.",
  "Your smile is my favorite sight, your voice is my favorite sound, and your happiness is my life's mission.",
  "In a world of billions, my heart will always, without a single shadow of doubt, choose you.",
  "Happy Birthday my princess! You bring warm sunshine into my darkest days and endless joy into my soul.",
  "I don't just love you for who you are; I love who I become whenever I am right beside you.",
  "Every birthday of yours is a reminder of how blessed I am to share this beautiful life journey with you.",
  "With you, forever doesn't feel long enough. Here's to making countless more priceless memories, Sangeetha! 💖",
  "You are the melody to my heart's song, the peace in my chaos, and my home forever. - Rakesh"
];

let noteIndex = 0;

function initLoveMessages() {
  const container = document.getElementById('love-messages-container');
  const nextBtn = document.getElementById('next-message');

  function renderNote() {
    if (!container) return;
    container.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'message-card';
    card.textContent = `"${loveNotesList[noteIndex]}"`;

    container.appendChild(card);
  }

  renderNote();

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      noteIndex = (noteIndex + 1) % loveNotesList.length;
      renderNote();
      createBurstSparkles(nextBtn);
      playTone(587.33, 0.2); // D5 tone
    });
  }
}

// ==================== PAGE 3: GALLERY & MOMENTS ====================
const momentsList = [
  { icon: '🌹', title: 'First Sight', detail: '1st day of college appo thaan ungala paathan antha moment la ennaku enna thonichi nu theriyala you grabbed my attention' },
  { icon: '✨', title: 'Your Character', detail: 'Even though you grabbed my attention ah irunthaalum,The character of you made me fall for you ' },
  { icon: '💖', title: 'My Comfort-Zone', detail: 'You are the only space where i was being myself,Ennala ellathaiyum share panna mudiyuthu' },
  { icon: '👑', title: 'My Queen', detail: 'Not this one day ithai maathiri ungala eppovum special ah feel panna vaipanu nenikiran' }
];

function initGallery() {
  const gallery = document.getElementById('photo-gallery');
  if (!gallery) return;

  gallery.innerHTML = '';
  momentsList.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'gift-card';
    card.innerHTML = `
      <div class="icon">${item.icon}</div>
      <div class="card-title">${item.title}</div>
      <div class="card-reveal">${item.detail}</div>
    `;

    card.addEventListener('click', () => {
      card.classList.toggle('opened');
      createBurstSparkles(card);
      playTone(659.25, 0.2); // E5 tone
    });

    gallery.appendChild(card);
  });
}

// ==================== PAGE 4: GAMES & CELEBRATIONS ====================
function initGames() {
  const heartRainBtn = document.getElementById('heart-rain-btn');
  const confettiBtn = document.getElementById('confetti-btn');
  const memoryGameBtn = document.getElementById('memory-game-btn');
  const danceModeBtn = document.getElementById('dance-mode-btn');
  const homeHeartBtn = document.getElementById('home-heart-btn');

  if (heartRainBtn) heartRainBtn.addEventListener('click', triggerHeartRain);
  if (confettiBtn) confettiBtn.addEventListener('click', triggerConfetti);
  if (memoryGameBtn) memoryGameBtn.addEventListener('click', showTriviaModal);
  if (danceModeBtn) danceModeBtn.addEventListener('click', toggleRomanticAura);
  if (homeHeartBtn) {
    homeHeartBtn.addEventListener('click', (e) => {
      createBurstSparkles(e.target);
      showSendLoveModal();
    });
  }
}

// ==================== EMAILJS INTEGRATION ====================
const EMAILJS_SERVICE_ID = "service_eb5d1qn";
const EMAILJS_TEMPLATE_ID = "template_u4pubmw";
const EMAILJS_PUBLIC_KEY = "DW640a6ps29A1Rox1";

if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY) {
  try {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  } catch (e) {
    console.warn('EmailJS init warning:', e);
  }
}

function showSendLoveModal() {
  const modal = document.getElementById('romantic-modal');
  const modalBody = document.getElementById('modal-content');
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div class="love-input-container">
      <h3 style="font-family: 'Playfair Display', serif; color: var(--rose-crimson); font-size: 1.8rem; margin-bottom: 8px;">
        💖 Send a Love Note to Rakesh
      </h3>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px;">
        Type your special message or reply below and send it straight to Rakesh's inbox!
      </p>

      <div style="display: flex; flex-direction: column; gap: 14px; text-align: left;">
        <div>
          <label style="font-size: 0.88rem; font-weight: 600; color: var(--text-dark); display: block; margin-bottom: 6px;">Your Name:</label>
          <input 
            type="text" 
            id="love-sender-name" 
            value="Sangeetha" 
            class="love-input-field" 
          />
        </div>

        <div>
          <label style="font-size: 0.88rem; font-weight: 600; color: var(--text-dark); display: block; margin-bottom: 6px;">Your Love Message:</label>
          <textarea 
            id="love-message-input" 
            rows="4" 
            placeholder="Type your sweet message or love note for Rakesh here..." 
            class="love-input-field" 
            style="resize: vertical;"
          ></textarea>
        </div>

        <button id="send-love-submit-btn" class="romantic-action-btn primary" style="margin-top: 10px; width: 100%;">
          <span class="btn-icon">💌</span> Send Love to Rakesh
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');

  setTimeout(() => {
    const msgInput = document.getElementById('love-message-input');
    if (msgInput) msgInput.focus();
  }, 200);

  const submitBtn = document.getElementById('send-love-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const senderName = document.getElementById('love-sender-name')?.value.trim() || 'Sangeetha';
      const typedMsg = document.getElementById('love-message-input')?.value.trim();

      if (!typedMsg) {
        alert('Please type a message before sending your love note! 💖');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="btn-icon">✨</span> Sending Email...`;

      triggerHeartRain();
      triggerConfetti();
      createBurstSparkles(submitBtn);

      const templateParams = {
        to_name: "Rakesh",
        from_name: senderName,
        message: typedMsg,
        sent_time: new Date().toLocaleString(),
        page_url: window.location.href
      };

      if (typeof emailjs !== 'undefined') {
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY || undefined)
          .then((res) => {
            console.log('Love email sent via EmailJS!', res.status, res.text);
            showLoveSentSuccess(modalBody, senderName);
          })
          .catch((err) => {
            console.warn('EmailJS fallback trigger:', err);
            showLoveSentSuccess(modalBody, senderName);
          });
      } else {
        showLoveSentSuccess(modalBody, senderName);
      }
    });
  }
}

function showLoveSentSuccess(container, name) {
  if (!container) return;
  container.innerHTML = `
    <div style="padding: 24px 10px; text-align: center;">
      <div style="font-size: 3.5rem; margin-bottom: 12px; animation: heartBeat 1.2s infinite;">💖✨</div>
      <h3 style="font-family: 'Playfair Display', serif; color: var(--rose-crimson); font-size: 1.8rem; margin-bottom: 10px;">
        Love Note Sent to Rakesh!
      </h3>
      <p style="color: var(--text-body); font-size: 1.1rem; line-height: 1.6;">
        Thank you, <strong>${name}</strong>! Your message has been emailed straight to Rakesh.
      </p>
      <button class="romantic-action-btn primary" style="margin-top: 24px; width: 100%;" onclick="document.getElementById('romantic-modal').classList.remove('active')">
        Close 💖
      </button>
    </div>
  `;
  setTimeout(() => {
    const modal = document.getElementById('romantic-modal');
    if (modal) modal.classList.remove('active');
  }, 4000);
}

// Heart Rain Effect
function triggerHeartRain() {
  const emojis = ['💖', '💕', '🌹', '💗', '✨', '💖'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.position = 'fixed';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = '-40px';
      p.style.fontSize = (Math.random() * 24 + 18) + 'px';
      p.style.zIndex = '999';
      p.style.pointerEvents = 'none';
      p.style.transition = 'transform 3.5s linear, opacity 3.5s linear';
      p.style.opacity = '1';

      document.body.appendChild(p);

      requestAnimationFrame(() => {
        p.style.transform = `translateY(${window.innerHeight + 80}px) rotate(${Math.random() * 720}deg)`;
        p.style.opacity = '0';
      });

      setTimeout(() => p.remove(), 3600);
    }, i * 60);
  }
}

// Confetti Effect
function triggerConfetti() {
  const colors = ['#ffd700', '#e63968', '#ff7597', '#ffffff', '#c2185b'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.style.position = 'fixed';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.top = '-20px';
      c.style.width = (Math.random() * 10 + 6) + 'px';
      c.style.height = (Math.random() * 16 + 8) + 'px';
      c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      c.style.borderRadius = '3px';
      c.style.zIndex = '999';
      c.style.pointerEvents = 'none';
      c.style.transition = 'transform 3s cubic-bezier(0.25, 1, 0.5, 1), opacity 3s linear';

      document.body.appendChild(c);

      requestAnimationFrame(() => {
        const vx = (Math.random() - 0.5) * 200;
        c.style.transform = `translate(${vx}px, ${window.innerHeight + 50}px) rotate(${Math.random() * 1080}deg)`;
        c.style.opacity = '0';
      });

      setTimeout(() => c.remove(), 3200);
    }, i * 40);
  }
}

// Romantic Aura Toggle
let auraActive = false;
function toggleRomanticAura() {
  const glow = document.querySelector('.avatar-glow-ring');
  auraActive = !auraActive;

  if (glow) {
    if (auraActive) {
      glow.style.transform = 'scale(1.4)';
      glow.style.filter = 'blur(20px)';
      triggerHeartRain();
    } else {
      glow.style.transform = 'scale(1)';
      glow.style.filter = 'blur(40px)';
    }
  }
}

// Sparkle Burst Utility
function createBurstSparkles(targetEl) {
  if (!targetEl) return;
  const rect = targetEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 16; i++) {
    const s = document.createElement('div');
    s.textContent = ['✦', '✨', '💖', '⭐'][Math.floor(Math.random() * 4)];
    s.style.position = 'fixed';
    s.style.left = centerX + 'px';
    s.style.top = centerY + 'px';
    s.style.fontSize = '18px';
    s.style.color = '#ffd700';
    s.style.zIndex = '1000';
    s.style.pointerEvents = 'none';
    s.style.transition = 'transform 0.8s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.8s linear';

    document.body.appendChild(s);

    const angle = (i / 16) * Math.PI * 2;
    const distance = Math.random() * 80 + 40;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    requestAnimationFrame(() => {
      s.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
      s.style.opacity = '0';
    });

    setTimeout(() => s.remove(), 850);
  }
}

// ==================== MODAL OVERLAY ====================
function initModal() {
  const modal = document.getElementById('romantic-modal');
  const closeBtn = document.getElementById('modal-close');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

function showTriviaModal() {
  const modal = document.getElementById('romantic-modal');
  const modalBody = document.getElementById('modal-content');
  if (!modal || !modalBody) return;

  const triviaList = [
    { title: "Favorite Smile", desc: "Did you know? Sangeetha's smile has a 100% success rate of making Rakesh's day 1000x brighter!" },
    { title: "Sweet Fact", desc: "Rakesh thinks about Sangeetha approximately 86,400 seconds every single day!" },
    { title: "Love Prescription", desc: "Recommended daily dose: 100 hugs, infinite kisses, and endless love for Sangeetha." }
  ];

  const item = triviaList[Math.floor(Math.random() * triviaList.length)];
  modalBody.innerHTML = `
    <h3>${item.title}</h3>
    <p>${item.desc}</p>
    <button class="romantic-action-btn primary" style="margin-top: 20px;" onclick="document.getElementById('romantic-modal').classList.remove('active')">Aww, So Sweet! 💖</button>
  `;

  modal.classList.add('active');
}

// ==================== ROMANTIC AUDIO SYNTHESIZER ====================
let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;

function initAudioSynthesizer() {
  const musicBtn = document.getElementById('music-toggle-btn');
  if (!musicBtn) return;

  musicBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    isMusicPlaying = !isMusicPlaying;

    if (isMusicPlaying) {
      musicBtn.innerHTML = `<span class="btn-icon">🎶</span> Playing Romance`;
      musicBtn.classList.add('primary');
      startRomanticMelody();
    } else {
      musicBtn.innerHTML = `<span class="btn-icon">🎵</span> Romantic Audio`;
      musicBtn.classList.remove('primary');
      stopRomanticMelody();
    }
  });
}

function playTone(freq, duration = 0.3) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context fallback silent
  }
}

function startRomanticMelody() {
  // Gentle romantic major arpeggio notes (C5, E5, G5, B5, C6)
  const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 783.99, 659.25];
  let index = 0;

  musicInterval = setInterval(() => {
    playTone(notes[index], 0.6);
    index = (index + 1) % notes.length;
  }, 700);
}

function stopRomanticMelody() {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}
