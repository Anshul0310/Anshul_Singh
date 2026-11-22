'use strict';

/* ============================================================
   ANSHUL SINGH — Portfolio 2026
   script.js — Batman Edition
   Flying bats · Bat signal · Gotham effects
   ============================================================ */

// ============================================================
//  BAT FACTORY  (must be defined before preloader IIFE runs)
// ============================================================
function mkBat(W, H) {
    const edge  = Math.floor(Math.random() * 4);
    let x, y;
    if (edge === 0) { x = Math.random() * W; y = -30; }
    else if (edge === 1) { x = W + 30; y = Math.random() * H; }
    else if (edge === 2) { x = Math.random() * W; y = H + 30; }
    else                 { x = -30; y = Math.random() * H; }

    const tx = W * (.3 + Math.random() * .4);
    const ty = H * (.3 + Math.random() * .4);
    const a  = Math.atan2(ty - y, tx - x);
    const sp = Math.random() * .9 + .35;

    return {
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        size:      Math.random() * 11 + 5,
        alpha:     Math.random() * .38 + .12,
        wing:      Math.random() * Math.PI * 2,
        waveAmp:   Math.random() * 14 + 5,
        waveFreq:  Math.random() * .028 + .01,
        t:         Math.random() * 200,
        angle:     a,
    };
}

function moveBat(b, W, H) {
    b.t++;
    b.wing += .14;
    const perp = Math.sin(b.t * b.waveFreq) * b.waveAmp * .05;
    b.x += b.vx + perp * Math.cos(b.angle + Math.PI / 2);
    b.y += b.vy + perp * Math.sin(b.angle + Math.PI / 2);
    if (b.x < -70 || b.x > W + 70 || b.y < -70 || b.y > H + 70) {
        Object.assign(b, mkBat(W, H));
    }
}

function paintBat(ctx, b, alphaMult) {
    const { x, y, size: s, alpha, angle, wing } = b;
    const flap = Math.sin(wing) * .38;

    ctx.save();
    ctx.globalAlpha  = alpha * (alphaMult || 1);
    ctx.fillStyle    = '#ffd700';
    ctx.shadowColor  = 'rgba(255,215,0,.55)';
    ctx.shadowBlur   = 6;
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
        -s * .38, -s * (.62 + flap),
        -s * 1.35, -s * (.2  + flap),
        -s * 1.75,  s * (.28 - flap)
    );
    ctx.bezierCurveTo(
        -s * 1.25,  s * (.52 - flap),
        -s * .65,   s * .18,
        -s * .12,   s * .32
    );
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
        s * .38, -s * (.62 + flap),
        s * 1.35, -s * (.2  + flap),
        s * 1.75,  s * (.28 - flap)
    );
    ctx.bezierCurveTo(
        s * 1.25,  s * (.52 - flap),
        s * .65,   s * .18,
        s * .12,   s * .32
    );
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, s * .08, s * .16, s * .36, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-s * .09, -s * .18);
    ctx.lineTo(-s * .30, -s * .68);
    ctx.lineTo( s * .04, -s * .20);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo( s * .09, -s * .18);
    ctx.lineTo( s * .30, -s * .68);
    ctx.lineTo(-s * .04, -s * .20);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

// ============================================================
//  BOOTSTRAP — CSS handles preloader; just init everything
// ============================================================
function initAll() {
    initCursor();
    initNav();
    initScrollReveal();
    initCounters();
    initTilt();
    initHeroBats();
    initActiveNav();
    initSmoothScroll();
    // safe lucide call — CDN might be slow
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Script is at bottom of <body> so DOM is ready — call directly
initAll();

// ============================================================
//  CUSTOM CURSOR
// ============================================================
function initCursor() {
    const cur = document.getElementById('cursor');
    const fol = document.getElementById('cursor-follower');
    if (!cur || !fol) return;

    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    });

    (function anim() {
        fx += (mx - fx) * .12;
        fy += (my - fy) * .12;
        fol.style.left = fx + 'px'; fol.style.top = fy + 'px';
        requestAnimationFrame(anim);
    })();

    document.querySelectorAll('a, button, [data-tilt], .stat-card, .skill-block').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

// ============================================================
//  NAV — adaptive dark (hero) → light (content)
// ============================================================
function initNav() {
    const nav    = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    const menu   = document.getElementById('mobile-menu');
    const close  = document.getElementById('mobile-close');
    const hero   = document.getElementById('hero');

    function onScroll() {
        const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
        nav.classList.toggle('scrolled-light', heroBottom < 80);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toggle.addEventListener('click', () => menu.classList.add('open'));
    close.addEventListener('click',  () => menu.classList.remove('open'));
    document.querySelectorAll('.mob-link').forEach(l =>
        l.addEventListener('click', () => menu.classList.remove('open'))
    );
}

// ============================================================
//  SCROLL REVEAL
// ============================================================
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-right');
    // Mark elements as pre-hidden so off-screen ones animate in on scroll
    els.forEach(el => el.classList.add('pre-hidden'));
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const idx   = Array.from(entry.target.parentElement.children).indexOf(entry.target);
            const delay = idx * 80;
            setTimeout(() => {
                entry.target.classList.remove('pre-hidden');
                entry.target.classList.add('visible');
            }, delay);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
    els.forEach(el => obs.observe(el));
}

// ============================================================
//  COUNTERS
// ============================================================
function initCounters() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el  = entry.target;
            const end = parseInt(el.dataset.count, 10);
            let cur   = 0;
            const inc = end / (1200 / 16);
            const t   = setInterval(() => {
                cur += inc;
                if (cur >= end) { cur = end; clearInterval(t); }
                el.textContent = Math.floor(cur);
            }, 16);
            obs.unobserve(el);
        });
    }, { threshold: .5 });
    document.querySelectorAll('.stat-num[data-count]').forEach(n => obs.observe(n));
}

// ============================================================
//  TILT  (3-D card effect)
// ============================================================
function initTilt() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const rx = ((e.clientY - r.top  - r.height / 2) / r.height) * -6;
            const ry = ((e.clientX - r.left - r.width  / 2) / r.width ) *  6;
            card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform .5s cubic-bezier(.25,.46,.45,.94)';
            card.style.transform  = 'none';
            setTimeout(() => { card.style.transition = ''; }, 500);
        });
    });
}

// ============================================================
//  HERO BAT CANVAS
// ============================================================
function initHeroBats() {
    const canvas = document.getElementById('bat-canvas');
    const hero   = document.getElementById('hero');
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const bats = Array.from({ length: 22 }, () => mkBat(canvas.width, canvas.height));

    // Subtle golden particle dust
    const dust = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + .4,
        a: Math.random() * .35 + .05,
        vy: Math.random() * -.4 - .1,
        vx: (Math.random() - .5) * .25,
        life: Math.random() * 200,
    }));

    function updateDust() {
        dust.forEach(d => {
            d.x  += d.vx;
            d.y  += d.vy;
            d.life--;
            if (d.y < -10 || d.life <= 0) {
                d.x    = Math.random() * canvas.width;
                d.y    = canvas.height + 10;
                d.life = 150 + Math.random() * 100;
            }
        });
    }

    function drawDust() {
        dust.forEach(d => {
            ctx.save();
            ctx.globalAlpha = d.a;
            ctx.fillStyle   = '#ffd700';
            ctx.shadowColor = 'rgba(255,215,0,.5)';
            ctx.shadowBlur  = 6;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    (function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateDust();
        drawDust();
        bats.forEach(b => { moveBat(b, canvas.width, canvas.height); paintBat(ctx, b, 1); });
        requestAnimationFrame(loop);
    })();
}

// ============================================================
//  ACTIVE NAV LINK
// ============================================================
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');
    const obs      = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(l => l.classList.remove('active'));
            const a = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (a) a.classList.add('active');
        });
    }, { threshold: .42 });
    sections.forEach(s => obs.observe(s));
}

// ============================================================
//  SMOOTH SCROLL
// ============================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - 72,
                behavior: 'smooth'
            });
        });
    });
}
