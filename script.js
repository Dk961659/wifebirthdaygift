/* =========================================================
   0. Gate intro: doors open into the hero, letters fall in
   ========================================================= */
(function initGate(){
  const gate = document.getElementById('gate');
  const gateBtn = document.getElementById('gateBtn');
  const heroInner = document.querySelector('.hero__inner');
  const nameEl = document.getElementById('wifeName');

  // Lock scroll until the gate opens
  document.documentElement.classList.add('lock-scroll');

  // Split the hero name into per-letter spans for the fall-in animation
  const letters = nameEl.textContent.split('');
  nameEl.innerHTML = '';
  letters.forEach((ch, i) => {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.animationDelay = `${300 + i * 60}ms`;
    nameEl.appendChild(span);
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function spawnPetals(){
    if (reduceMotion) return;
    const count = window.innerWidth < 600 ? 18 : 32;
    const colors = ['#C9A227', '#E8B4BC', '#6C4F77', '#F5EFE6'];
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('span');
      petal.className = 'gate-petal';
      const size = 6 + Math.random() * 8;
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.background = colors[Math.floor(Math.random() * colors.length)];
      petal.style.setProperty('--fall-distance', (40 + Math.random() * 35) + 'vh');
      petal.style.animationDuration = (1.1 + Math.random() * 0.9) + 's';
      petal.style.animationDelay = (Math.random() * 0.5) + 's';
      document.body.appendChild(petal);
      setTimeout(() => petal.remove(), 2600);
    }
  }

  function openGate(){
    gate.classList.add('is-open');
    spawnPetals();
    document.documentElement.classList.remove('lock-scroll');
    heroInner.classList.add('is-visible');
    setTimeout(() => { gate.style.display = 'none'; }, 950);
    gateBtn.removeEventListener('click', openGate);
  }

  gateBtn.addEventListener('click', openGate);

  // Keep it accessible: Enter/Space already work on a <button> by default.
})();

/* =========================================================
   1. Twinkling night sky behind the hero
   ========================================================= */
(function initSky(){
  const canvas = document.getElementById('sky');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let shootingStar = null;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize(){
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
  }

  function buildStars(){
    const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.3 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1
    }));
  }

  function maybeSpawnShootingStar(){
    if (!shootingStar && Math.random() < 0.004) {
      shootingStar = {
        x: Math.random() * window.innerWidth * 0.6,
        y: Math.random() * window.innerHeight * 0.3,
        vx: 6 + Math.random() * 3,
        vy: 3 + Math.random() * 2,
        life: 1
      };
    }
  }

  let t = 0;
  function draw(){
    t += 0.016;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    stars.forEach(s => {
      const twinkle = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,239,230,${0.25 + twinkle * 0.6})`;
      ctx.fill();
    });

    maybeSpawnShootingStar();
    if (shootingStar) {
      const s = shootingStar;
      ctx.strokeStyle = `rgba(201,162,39,${s.life})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * 6, s.y - s.vy * 6);
      ctx.stroke();
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.02;
      if (s.life <= 0 || s.x > window.innerWidth || s.y > window.innerHeight) {
        shootingStar = null;
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    draw();
  }
})();

/* =========================================================
   2. Scroll cue jumps to gallery
   ========================================================= */
document.getElementById('scrollCue').addEventListener('click', () => {
  document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
});

/* =========================================================
   3. Gallery: reveal-on-scroll + lightbox
   ========================================================= */
(function initGallery(){
  const items = document.querySelectorAll('.gallery__item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((item, i) => {
    item.style.animationDelay = `${(i % 4) * 90}ms`;
    observer.observe(item);
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');

  function openLightbox(src, alt){
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
  }

  function closeLightbox(){
    lightbox.classList.remove('is-open');
    lightboxImg.src = '';
  }

  items.forEach(item => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('click', () => {
      const full = item.getAttribute('data-full');
      const img = item.querySelector('img');
      openLightbox(full, img.alt);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

/* =========================================================
   4. Story slider — train-style sliding cards with arrows
   ========================================================= */
(function initSlider(){
  const track = document.getElementById('sliderTrack');
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const dotsWrap = document.getElementById('sliderDots');
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function render(){
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  }

  function goTo(i){
    index = (i + slides.length) % slides.length;
    render();
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  document.addEventListener('keydown', (e) => {
    const section = document.getElementById('storySlider');
    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  // basic swipe support
  let touchStartX = null;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? index + 1 : index - 1);
    touchStartX = null;
  });

  render();
})();

/* =========================================================
   5. Fireworks celebration + animated headline
   ========================================================= */
(function initFireworks(){
  const canvas = document.getElementById('fireworks');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('celebrate');
  const titleEl = document.getElementById('celebrateTitle');
  const btn = document.getElementById('celebrateBtn');
  const colors = ['#C9A227', '#E8B4BC', '#6C4F77', '#F5EFE6', '#FF8C69'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  let running = false;
  let rafId = null;

  function resize(){
    canvas.width = section.clientWidth * dpr;
    canvas.height = section.clientHeight * dpr;
    canvas.style.width = section.clientWidth + 'px';
    canvas.style.height = section.clientHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnBurst(x, y){
    const count = 46;
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 1.5 + Math.random() * 2.6;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.012 + Math.random() * 0.012,
        color,
        size: 2 + Math.random() * 1.6
      });
    }
  }

  function launchRocket(){
    const w = section.clientWidth;
    const h = section.clientHeight;
    const targetX = w * (0.2 + Math.random() * 0.6);
    const targetY = h * (0.2 + Math.random() * 0.35);
    spawnBurst(targetX, targetY);
  }

  function tick(){
    ctx.fillStyle = 'rgba(27,21,51,0.18)';
    ctx.fillRect(0, 0, section.clientWidth, section.clientHeight);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;
      p.life -= p.decay;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    particles = particles.filter(p => p.life > 0);

    if (Math.random() < 0.02) launchRocket();

    rafId = requestAnimationFrame(tick);
  }

  function startShow(burstNow){
    resize();
    if (burstNow) {
      launchRocket();
      launchRocket();
      setTimeout(launchRocket, 220);
    }
    if (!running) {
      running = true;
      tick();
    }
  }

  function animateTitle(){
    const text = 'Happy Birthday, Srishti!';
    titleEl.setAttribute('aria-label', text);
    titleEl.innerHTML = '';
    text.split('').forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = `${i * 35}ms`;
      titleEl.appendChild(span);
    });
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateTitle();
        startShow(true);
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  window.addEventListener('resize', resize);
  if (!reduceMotion) {
    sectionObserver.observe(section);
  } else {
    animateTitle();
  }

  btn.addEventListener('click', () => {
    const w = section.clientWidth;
    const h = section.clientHeight;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnBurst(w * (0.25 + Math.random() * 0.5), h * (0.2 + Math.random() * 0.3)), i * 180);
    }
    if (!running) startShow(false);
  });
})();

/* =========================================================
   6. Cake: click to blow out the candle + confetti
   ========================================================= */
(function initCake(){
  const cakeBtn = document.getElementById('cakeBtn');
  const finaleMsg = document.getElementById('finaleMsg');
  const confettiLayer = document.getElementById('confettiLayer');
  const colors = ['#C9A227', '#E8B4BC', '#6C4F77', '#F5EFE6'];
  let blown = false;

  function burstConfetti(){
    const pieces = 80;
    for (let i = 0; i < pieces; i++) {
      const el = document.createElement('span');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDuration = (2.5 + Math.random() * 2) + 's';
      el.style.animationDelay = (Math.random() * 0.4) + 's';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      confettiLayer.appendChild(el);
      setTimeout(() => el.remove(), 5200);
    }
  }

  cakeBtn.addEventListener('click', () => {
    if (blown) return;
    blown = true;
    cakeBtn.classList.add('is-blown');
    finaleMsg.classList.add('is-shown');
    burstConfetti();
  });
})();
