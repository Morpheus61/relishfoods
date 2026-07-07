/* ═══════════════════════════════════════════════════════════════
   RELISH FOODS — main.js
   Supabase integration, animations, video controls, data flow
   ═══════════════════════════════════════════════════════════════ */

// ─── EMAILJS CONFIG ───
// Sign up at https://www.emailjs.com and replace these with your real IDs
const EMAILJS_PUBLIC_KEY = 'OdnfVkQKFqhR39hC1';
const EMAILJS_SERVICE_ID = 'service_lkvwje9';
const EMAILJS_TEMPLATE_ID = 'template_om5u735';

// Initialise EmailJS with public key + private key (required when "Use Private Key" is enabled)
emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
    blockHeadless: true,             // Block headless browsers (anti-spam)
    limitRate: {
        id: 'relish-contact-form',
        throttle: 10000              // Max 1 email per 10 seconds
    }
});

// ─── NAVBAR SCROLL EFFECT ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── REVEAL ON SCROLL ───
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ─── MOBILE NAV ───
function toggleMobileNav() {
    document.getElementById('mobileNav').classList.toggle('open');
}

// Expose to global scope for inline onclick
window.toggleMobileNav = toggleMobileNav;

// ─── PRODUCT PORTFOLIO VIDEO PLAYER ───
function initVideoPlayer() {
    const video = document.getElementById('portfolioVideo');
    const playBtn = document.getElementById('videoPlayBtn');
    const progressBar = document.getElementById('videoProgressBar');
    const progressTrack = document.getElementById('videoProgress');
    const timeDisplay = document.getElementById('videoTime');

    if (!video || !playBtn) return;

    playBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playBtn.textContent = '⏸';
        } else {
            video.pause();
            playBtn.textContent = '▶';
        }
    });

    video.addEventListener('timeupdate', () => {
        const pct = (video.currentTime / video.duration) * 100;
        progressBar.style.width = pct + '%';

        const cur = formatTime(video.currentTime);
        const dur = formatTime(video.duration);
        timeDisplay.textContent = `${cur} / ${dur}`;
    });

    video.addEventListener('ended', () => {
        playBtn.textContent = '▶';
    });

    progressTrack.addEventListener('click', (e) => {
        const rect = progressTrack.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        video.currentTime = pct * video.duration;
    });
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// ─── PROCESS RING ANIMATION + DATA FLOW BOARD (prototype v2) ───
// Delta-time driven ring: one full loop ≈ 33 s regardless of refresh rate.
// All Phase 2 a11y fixes applied: tabindex, role, aria-pressed, Enter/Space,
// prefers-reduced-motion check, smoothT resume sync on user interaction.

const stages = [
    { name: 'Hatchery',   tag: 'SEED',   desc: 'Broodstock spawned, larvae reared to seed size in controlled tanks.' },
    { name: 'Grow-Out',   tag: '18 MO',  desc: 'Seed transferred to Panavally backwaters for natural growth cycles.' },
    { name: 'Harvest',    tag: 'MANUAL', desc: 'Selective hand-harvest by size, minimising undersized bycatch.' },
    { name: 'Depuration', tag: '48 HR',  desc: 'Purification tanks flush sediment and pathogens before processing.' },
    { name: 'Processing', tag: 'IQF',    desc: 'Shucking, grading and individually quick-frozen within hours of intake.' },
    { name: 'QC & Pack',  tag: 'LOT-ID', desc: 'Lot-coded, moisture-checked, vacuum-sealed for cold chain export.' },
    { name: 'Export',     tag: 'REEFER', desc: 'Reefer container shipped; seed stock and recovered shell return to Hatchery.' },
];

const checkpoints = [
    { name: 'Intake Weight',  prodMeta: 'Scale sync · 214.6 kg',      qcMeta: 'Tare re-check · variance 0.2%' },
    { name: 'Sediment Scan',  prodMeta: 'Depuration tank 03',          qcMeta: 'Turbidity below threshold' },
    { name: 'IQF Temp Log',   prodMeta: 'Core temp −18.4°C',           qcMeta: 'Cold-chain photo verified' },
    { name: 'Lot Seal & Pack',prodMeta: 'Lot RH-SAMPLE-001-A',         qcMeta: 'Vacuum integrity passed' },
];

function initProcessRing() {
    const nodesGroup = document.getElementById('nodesGroup');
    const stageList  = document.getElementById('stageList');
    if (!nodesGroup || !stageList) return;

    const stageTitle    = document.getElementById('stageTitle');
    const stageIndex    = document.getElementById('stageIndex');
    const stageLoopNote = document.getElementById('stageLoopNote');
    const progressArc   = document.getElementById('progressArc');
    const pulseDot      = document.getElementById('pulseDot');

    const cx = 200, cy = 200, r = 160, N = stages.length;
    const angleFor = i => (-90 + (360 / N) * i) * Math.PI / 180;

    // Build SVG nodes + stage list rows
    stages.forEach((s, i) => {
        const a = angleFor(i);
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'node');
        g.setAttribute('data-i', i);
        g.setAttribute('tabindex', '0');
        g.setAttribute('role', 'button');
        g.setAttribute('aria-pressed', 'false');
        g.setAttribute('aria-label', `Stage ${i + 1} of ${N}: ${s.name}`);
        g.innerHTML = `<circle class="node-bg" cx="${x}" cy="${y}" r="22"></circle><text x="${x}" y="${y + 3}">${String(i + 1).padStart(2, '0')}</text>`;
        nodesGroup.appendChild(g);

        const row = document.createElement('div');
        row.className = 'stage-row';
        row.setAttribute('data-i', i);
        row.setAttribute('tabindex', '0');
        row.setAttribute('role', 'button');
        row.setAttribute('aria-pressed', 'false');
        row.setAttribute('aria-label', `Stage ${i + 1}: ${s.name} — ${s.desc}`);
        row.innerHTML = `<div class="num mono">${String(i + 1).padStart(2, '0')}</div><div class="txt"><div class="name">${s.name}</div><div class="desc">${s.desc}</div></div><div class="tag mono">${s.tag}</div>`;
        stageList.appendChild(row);
    });

    function polarArcPath(toFrac) {
        const startA = angleFor(0);
        const endA   = -90 * Math.PI / 180 + (360 / N) * toFrac * Math.PI / 180;
        const large  = (toFrac * (360 / N)) > 180 ? 1 : 0;
        const sx = cx + r * Math.cos(startA), sy = cy + r * Math.sin(startA);
        const ex = cx + r * Math.cos(endA),   ey = cy + r * Math.sin(endA);
        return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let active = 0, smoothT = 0, autoplay = !prefersReduced.matches, resumeTimer = null, lastTs = null;

    prefersReduced.addEventListener('change', () => {
        clearTimeout(resumeTimer);
        autoplay = !prefersReduced.matches;
    });

    function setActive(i, { fromUser = false } = {}) {
        active = i;
        if (fromUser) {
            smoothT = i; // sync so autoplay resumes from selected node
            autoplay = false;
            clearTimeout(resumeTimer);
            if (!prefersReduced.matches) {
                resumeTimer = setTimeout(() => { autoplay = true; }, 6000);
            }
        }

        document.querySelectorAll('.node').forEach(n => {
            const on = +n.dataset.i === i;
            n.classList.toggle('active', on);
            n.setAttribute('aria-pressed', String(on));
        });
        document.querySelectorAll('.stage-row').forEach(n => {
            const on = +n.dataset.i === i;
            n.classList.toggle('active', on);
            n.setAttribute('aria-pressed', String(on));
        });

        stageTitle.style.opacity = 0;
        setTimeout(() => {
            stageTitle.textContent  = stages[i].name;
            stageIndex.textContent  = String(i + 1).padStart(2, '0');
            stageLoopNote.textContent = i === N - 1
                ? 'Seed stock & recovered shell return to Hatchery'
                : `Feeds forward into ${stages[(i + 1) % N].name}`;
            stageTitle.style.opacity = 1;
        }, 150);

        progressArc.setAttribute('d', polarArcPath(i));
        const a = angleFor(i);
        pulseDot.setAttribute('cx', cx + r * Math.cos(a));
        pulseDot.setAttribute('cy', cy + r * Math.sin(a));
    }

    document.querySelectorAll('.node, .stage-row').forEach(el => {
        el.addEventListener('click', () => setActive(+el.dataset.i, { fromUser: true }));
        el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActive(+el.dataset.i, { fromUser: true });
            }
        });
    });

    setActive(0);

    // Reduced motion: render static state, no rAF loop animation
    if (prefersReduced.matches) return;

    const LOOP_SECONDS = 33;
    function animateRing(ts) {
        if (lastTs === null) lastTs = ts;
        const dt = Math.min(ts - lastTs, 100);
        lastTs = ts;
        if (autoplay) {
            smoothT += (dt / 1000) * (N / LOOP_SECONDS);
            if (smoothT >= N) smoothT = 0;
            const i = Math.floor(smoothT) % N;
            if (i !== active) setActive(i);
            const a = -90 * Math.PI / 180 + (360 / N) * smoothT * Math.PI / 180;
            pulseDot.setAttribute('cx', cx + r * Math.cos(a));
            pulseDot.setAttribute('cy', cy + r * Math.sin(a));
            progressArc.setAttribute('d', polarArcPath(smoothT));
        }
        requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);
}

function initFlowBoard() {
    const flowGrid = document.getElementById('flowGrid');
    const replayBtn = document.getElementById('replayBtn');
    if (!flowGrid || !replayBtn) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    function buildFlowBoard() {
        flowGrid.innerHTML = '';
        const prodCol = document.createElement('div');
        prodCol.className = 'flow-col';
        prodCol.innerHTML = `<div class="flow-col-head prod"><span class="dot"></span><span class="lbl mono">Production</span></div>`;

        const qcCol = document.createElement('div');
        qcCol.className = 'flow-col';
        qcCol.innerHTML = `<div class="flow-col-head qc"><span class="dot"></span><span class="lbl mono">Quality Control</span></div>`;

        checkpoints.forEach((c, i) => {
            const p = document.createElement('div');
            p.className = 'flow-stage';
            p.id = `prod-${i}`;
            p.innerHTML = `<div class="row1"><div class="stage-name">${c.name}</div><div class="status mono" id="prod-status-${i}">pending</div></div><div class="stage-meta mono">${c.prodMeta}</div>`;
            prodCol.appendChild(p);

            const q = document.createElement('div');
            q.className = 'flow-stage qc-side';
            q.id = `qc-${i}`;
            q.innerHTML = `<div class="row1"><div class="stage-name">${c.name}</div><div class="status mono" id="qc-status-${i}">pending</div></div><div class="stage-meta mono">${c.qcMeta}</div>`;
            qcCol.appendChild(q);
        });

        flowGrid.appendChild(prodCol);
        flowGrid.appendChild(qcCol);

        const sync = document.createElement('div');
        sync.className = 'sync-strip';
        sync.innerHTML = `<span class="gate-label mono">GATE SYNC</span><div class="gate-bar"><div class="fill" id="gateFill"></div></div><span class="gate-strike mono" id="gateStrike">0 / 4</span>`;
        flowGrid.appendChild(sync);
    }

    buildFlowBoard();

    let flowTimers = [];
    function clearFlowTimers() { flowTimers.forEach(t => clearTimeout(t)); flowTimers = []; }

    function runFlowSequence() {
        clearFlowTimers();
        checkpoints.forEach((_, i) => {
            ['prod', 'qc'].forEach(side => {
                const el = document.getElementById(`${side}-${i}`);
                if (el) el.classList.remove('entering', 'locked');
                const st = document.getElementById(`${side}-status-${i}`);
                if (st) { st.textContent = 'pending'; st.className = 'status mono'; }
            });
        });
        const gateFill   = document.getElementById('gateFill');
        const gateStrike = document.getElementById('gateStrike');
        gateFill.style.right = '100%';
        gateStrike.textContent = '0 / 4';
        gateStrike.classList.remove('locked');

        // Reduced motion: show completed state instantly, no timed sequence
        if (prefersReduced.matches) {
            checkpoints.forEach((_, i) => {
                document.getElementById(`prod-${i}`).classList.add('entering', 'locked');
                document.getElementById(`qc-${i}`).classList.add('entering', 'locked');
                const ps = document.getElementById(`prod-status-${i}`);
                ps.textContent = 'confirmed'; ps.classList.add('ok');
                const qs = document.getElementById(`qc-status-${i}`);
                qs.textContent = 'confirmed'; qs.classList.add('ok', 'shell');
            });
            gateFill.style.right = '0%';
            gateStrike.textContent = `${checkpoints.length} / ${checkpoints.length}`;
            gateStrike.classList.add('locked');
            return;
        }

        let delay = 300;
        const gap = 1500;
        checkpoints.forEach((_, i) => {
            flowTimers.push(setTimeout(() => { document.getElementById(`prod-${i}`).classList.add('entering'); }, delay));
            flowTimers.push(setTimeout(() => { document.getElementById(`qc-${i}`).classList.add('entering'); }, delay + 220));
            flowTimers.push(setTimeout(() => {
                const el = document.getElementById(`prod-status-${i}`);
                el.textContent = 'confirmed'; el.classList.add('ok');
            }, delay + 650));
            flowTimers.push(setTimeout(() => {
                const el = document.getElementById(`qc-status-${i}`);
                el.textContent = 'confirmed'; el.classList.add('ok', 'shell');
            }, delay + 980));
            flowTimers.push(setTimeout(() => {
                document.getElementById(`prod-${i}`).classList.add('locked');
                document.getElementById(`qc-${i}`).classList.add('locked');
                const pct = ((i + 1) / checkpoints.length) * 100;
                gateFill.style.right = (100 - pct) + '%';
                gateStrike.textContent = `${i + 1} / ${checkpoints.length}`;
                if (i === checkpoints.length - 1) gateStrike.classList.add('locked');
            }, delay + 1150));
            delay += gap;
        });
    }

    runFlowSequence();
    replayBtn.addEventListener('click', runFlowSequence);

    // Re-run when section scrolls into view
    let hasRunOnce = true;
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting && !hasRunOnce) { runFlowSequence(); hasRunOnce = true; }
            if (!e.isIntersecting) hasRunOnce = false;
        });
    }, { threshold: 0.4 });
    const flowSection = document.getElementById('dataflow');
    if (flowSection) io.observe(flowSection);
}

// ─── PRODUCT VIDEO LAZY LOAD ───
// Sets data-src → src only when video is near the viewport.
// Companion to preload="none" on #portfolioVideo.
function initVideoLazyLoad() {
    const video = document.getElementById('portfolioVideo');
    if (!video || !('IntersectionObserver' in window)) {
        // Fallback: load immediately if observer unsupported
        if (video) {
            video.querySelectorAll('source[data-src]').forEach(s => { s.src = s.dataset.src; });
            video.load();
        }
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.querySelectorAll('source[data-src]').forEach(s => { s.src = s.dataset.src; });
                video.load();
                observer.disconnect();
            }
        });
    }, { rootMargin: '200px 0px' }); // start loading 200 px before entering view
    observer.observe(video);
}

// ─── CONTACT FORM (EMAILJS) ───
async function handleContactSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const statusEl = document.getElementById('formStatus');

    btn.disabled = true;
    btn.textContent = 'Sending...';
    statusEl.className = 'form-status';
    statusEl.style.display = 'none';

    // These template parameter names must match your EmailJS template variables
    const templateParams = {
        from_name: form.name.value.trim(),
        from_email: form.email.value.trim(),
        company: form.company.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim()
    };

    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);

        statusEl.className = 'form-status success';
        statusEl.textContent = '✓ Thank you! Your inquiry has been sent. We\'ll get back to you soon.';
        statusEl.style.display = 'block';
        form.reset();
    } catch (err) {
        console.error('EmailJS error:', err);
        statusEl.className = 'form-status error';
        statusEl.textContent = '⚠ Something went wrong. Please try emailing us directly at motty@relishfoods.co';
        statusEl.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Send Inquiry →';
    }
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
    initVideoPlayer();
    initVideoLazyLoad();
    initProcessRing();
    initFlowBoard();

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});
