// ===== NOTHING PHONE (2) — 3D SCROLL ANIMATION ENGINE =====

(function () {
  'use strict';

  // ===== LENIS SMOOTH SCROLLING =====
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // ===== PRELOADER =====
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('preloader').classList.add('hidden');
    }, 2200);
  });

  // ===== CUSTOM CURSOR =====
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateCursor() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements
  document.querySelectorAll('a, button, .perf-card, .spec-chip, .glyph-feature, .camera-sample').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
  });

  // ===== PARTICLES =====
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedY = -(Math.random() * 0.3 + 0.05);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.life = Math.random() * 300 + 100;
      this.age = 0;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.age++;
      if (this.age > this.life || this.y < -10) this.reset();
    }
    draw() {
      const alpha = this.opacity * (1 - this.age / this.life);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(215, 25, 33, ${alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ===== SCROLL ANIMATION ENGINE =====
  const phoneWrapper = document.getElementById('phone-wrapper');
  const phoneGlow = document.getElementById('phone-glow');
  const phoneShadow = document.getElementById('phone-shadow');
  const phoneScreen = document.getElementById('phone-screen');
  const glyphContainer = document.getElementById('glyph-container');
  const scrollProgress = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');

  const glyphElements = {
    ring: document.getElementById('glyph-camera-ring'),
    stripTop: document.getElementById('glyph-strip-top'),
    arc: document.getElementById('glyph-arc'),
    excl: document.getElementById('glyph-exclamation'),
    stripBottom: document.getElementById('glyph-strip-bottom'),
    usb: document.getElementById('glyph-usb')
  };

  // Phone 3D keyframes: [scrollPercent, rotateX, rotateY, rotateZ, scale, translateX, translateY]
  const keyframes = [
    { t: 0.00, rx: 15, ry: -30, rz: 5, s: 0.35, tx: 0, ty: 30, glow: 0, glyphOn: false },
    { t: 0.04, rx: 5, ry: -15, rz: 2, s: 0.65, tx: 0, ty: 0, glow: 0.2, glyphOn: false },
    { t: 0.08, rx: 0, ry: 0, rz: 0, s: 1, tx: 0, ty: 0, glow: 0.4, glyphOn: false },
    // Design section — phone rotates to show angles
    { t: 0.14, rx: -5, ry: 25, rz: -3, s: 0.95, tx: 200, ty: 0, glow: 0.3, glyphOn: false },
    { t: 0.20, rx: -8, ry: 40, rz: -2, s: 0.9, tx: 220, ty: 0, glow: 0.2, glyphOn: false },
    // Glyph section — phone flips to back
    { t: 0.26, rx: 0, ry: 120, rz: 0, s: 0.95, tx: -200, ty: 0, glow: 0.5, glyphOn: false },
    { t: 0.30, rx: 0, ry: 180, rz: 0, s: 1, tx: -200, ty: 0, glow: 0.8, glyphOn: true },
    { t: 0.38, rx: 0, ry: 180, rz: 0, s: 1, tx: -200, ty: 0, glow: 0.8, glyphOn: true },
    // Display section — flip back to front
    { t: 0.44, rx: 0, ry: 360, rz: 0, s: 1.05, tx: 200, ty: 0, glow: 0.6, glyphOn: false },
    { t: 0.50, rx: 0, ry: 360, rz: 0, s: 1.1, tx: 200, ty: 0, glow: 0.5, glyphOn: false },
    // Camera section — tilt to show camera
    { t: 0.56, rx: -15, ry: 390, rz: 5, s: 0.9, tx: -180, ty: -20, glow: 0.3, glyphOn: false },
    { t: 0.64, rx: -10, ry: 400, rz: 3, s: 0.85, tx: -180, ty: 0, glow: 0.2, glyphOn: false },
    // Performance section — phone smaller, centered
    { t: 0.72, rx: 5, ry: 380, rz: -2, s: 0.5, tx: 0, ty: -30, glow: 0.1, glyphOn: false },
    { t: 0.78, rx: 5, ry: 370, rz: -2, s: 0.45, tx: 0, ty: -40, glow: 0.1, glyphOn: false },
    // CTA section — phone settles
    { t: 0.85, rx: -5, ry: 360, rz: 0, s: 0.9, tx: 0, ty: 0, glow: 0.6, glyphOn: false },
    { t: 1.00, rx: 0, ry: 355, rz: 0, s: 0.85, tx: 0, ty: 0, glow: 0.4, glyphOn: false },
  ];

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function getInterpolated(progress) {
    let i = 0;
    for (let k = 0; k < keyframes.length - 1; k++) {
      if (progress >= keyframes[k].t && progress <= keyframes[k + 1].t) {
        i = k; break;
      }
      if (k === keyframes.length - 2) i = k;
    }

    const kf1 = keyframes[i];
    const kf2 = keyframes[Math.min(i + 1, keyframes.length - 1)];
    const range = kf2.t - kf1.t || 1;
    const t = Math.max(0, Math.min(1, (progress - kf1.t) / range));

    // Ease in-out
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    // Responsive horizontal translation
    const txMultiplier = window.innerWidth < 768 ? 0 : (window.innerWidth < 1024 ? 0.5 : 1);

    return {
      rx: lerp(kf1.rx, kf2.rx, eased),
      ry: lerp(kf1.ry, kf2.ry, eased),
      rz: lerp(kf1.rz, kf2.rz, eased),
      s: lerp(kf1.s, kf2.s, eased),
      tx: lerp(kf1.tx, kf2.tx, eased) * txMultiplier,
      ty: lerp(kf1.ty, kf2.ty, eased),
      glow: lerp(kf1.glow, kf2.glow, eased),
      glyphOn: t > 0.5 ? kf2.glyphOn : kf1.glyphOn
    };
  }

  let currentScroll = 0;
  let targetScroll = 0;
  let ticking = false;

  function getScrollProgress() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    return window.scrollY / (scrollHeight || 1);
  }

  // Glyph LED animation
  let glyphAnimated = false;
  function animateGlyphs(on) {
    const els = Object.values(glyphElements);
    if (on && !glyphAnimated) {
      glyphAnimated = true;
      glyphContainer.classList.add('active');
      els.forEach((el, i) => {
        setTimeout(() => el.classList.add('lit'), i * 150);
      });
    } else if (!on && glyphAnimated) {
      glyphAnimated = false;
      glyphContainer.classList.remove('active');
      els.forEach(el => el.classList.remove('lit'));
    }
  }

  function updatePhone() {
    const progress = getScrollProgress();
    currentScroll += (progress - currentScroll) * 0.08;

    const state = getInterpolated(currentScroll);

    phoneWrapper.style.transform =
      `translateX(${state.tx}px) translateY(${state.ty}px) ` +
      `rotateX(${state.rx}deg) rotateY(${state.ry}deg) rotateZ(${state.rz}deg) ` +
      `scale(${state.s})`;

    phoneGlow.style.opacity = state.glow;

    // Shadow based on height
    const shadowScale = 0.5 + state.s * 0.5;
    phoneShadow.style.transform = `translateX(-50%) scaleX(${shadowScale})`;
    phoneShadow.style.opacity = Math.max(0.1, 0.4 - Math.abs(state.rx) * 0.01);

    // Glyph
    animateGlyphs(state.glyphOn);

    // Screen brightness effect
    const screenBrightness = currentScroll > 0.44 && currentScroll < 0.55 ? 1.2 : 1;
    phoneScreen.style.filter = `brightness(${screenBrightness})`;

    // Scroll progress bar
    scrollProgress.style.width = (progress * 100) + '%';

    // Navbar
    if (progress > 0.03) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    requestAnimationFrame(updatePhone);
  }
  updatePhone();

  // ===== INTERSECTION OBSERVER — Content Reveals =====
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -10% 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.content-block').forEach(block => observer.observe(block));

  // ===== COUNTER ANIMATION =====
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.counter');
        counters.forEach(counter => {
          if (counter.dataset.done) return;
          counter.dataset.done = '1';
          const target = parseFloat(counter.dataset.target);
          const isFloat = target % 1 !== 0;
          const duration = 1500;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            counter.textContent = isFloat ? current.toFixed(1) : Math.round(current);
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.display-specs').forEach(el => counterObserver.observe(el));

  // ===== COLOR OPTION TOGGLE =====
  document.querySelectorAll('.color-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ===== SMOOTH SCROLL FOR NAV LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      if (target) {
        lenis.scrollTo(target, { offset: -50 });
      }
    });
  });

  // ===== SCROLL HINT HIDE =====
  window.addEventListener('scroll', () => {
    const hint = document.getElementById('scroll-hint');
    if (hint && window.scrollY > 100) {
      hint.style.opacity = '0';
      hint.style.pointerEvents = 'none';
    }
  }, { passive: true });

})();
