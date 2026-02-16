/* ═══════════════════════════════════════════════════════════════
   RELISH FOODS — main.js
   Supabase integration, animations, video controls, data flow
   ═══════════════════════════════════════════════════════════════ */

// ─── SUPABASE CONFIG ───
const SUPABASE_URL = 'https://kkstktmvkyswpkwtccst.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrc3RrdG12a3lzd3Brd3RjY3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjI0NjEsImV4cCI6MjA4Njc5ODQ2MX0.OkS9I_AiVTZkageWIyvnJzaEuGr982e7u3imQDIEPt8';

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

// ─── DATA FLOW ANIMATION ───
function initDataFlowAnimation() {
    const steps = [
        { id: 0, name: 'Raw Material Intake', form: 'Form 1', type: 'prod', color: '#3B82F6' },
        { id: 1, name: 'Intake QC Check', form: 'QC Form 1', type: 'qc', color: '#10B981' },
        { id: 2, name: 'Pre-Processing', form: 'Form 2', type: 'prod', color: '#3B82F6' },
        { id: 3, name: 'Pre-Process QC Check', form: 'QC Form 2', type: 'qc', color: '#10B981' },
        { id: 4, name: 'Processing', form: 'Form 3', type: 'prod', color: '#F59E0B' },
        { id: 5, name: 'Processing QC Check', form: 'QC Form 3', type: 'qc', color: '#10B981' },
        { id: 6, name: 'Freezing & Packing', form: 'Form 4', type: 'prod', color: '#3B82F6' },
        { id: 7, name: 'Final QC Check', form: 'QC Form 4', type: 'qc', color: '#10B981' },
        { id: 8, name: 'Product Out', form: null, type: 'ship', color: '#8B5CF6' }
    ];

    let activeStep = 0;
    const prodSteps = [0, 2, 4, 6];
    const qcSteps = [1, 3, 5, 7];

    // Get all DOM elements
    const prodCards = document.querySelectorAll('.df-prod-step');
    const qcCards = document.querySelectorAll('.df-qc-step');
    const pipelineNodes = document.querySelectorAll('.df-node-circle');
    const particle = document.getElementById('dfParticle');

    function updateAnimation() {
        const step = steps[activeStep];

        // Clear all active states
        prodCards.forEach(c => { c.classList.remove('active-prod', 'data-sent'); });
        qcCards.forEach(c => { c.classList.remove('active-qc', 'data-sent'); });

        // Activate the correct stream card
        const prodIdx = prodSteps.indexOf(activeStep);
        const qcIdx = qcSteps.indexOf(activeStep);

        if (prodIdx !== -1 && prodCards[prodIdx]) {
            prodCards[prodIdx].classList.add('active-prod');
            // Show "Data Sent" badge briefly
            setTimeout(() => {
                prodCards[prodIdx].classList.add('data-sent');
            }, 1500);
        }

        if (qcIdx !== -1 && qcCards[qcIdx]) {
            qcCards[qcIdx].classList.add('active-qc');
            setTimeout(() => {
                qcCards[qcIdx].classList.add('data-sent');
            }, 1500);
        }

        // Update pipeline nodes
        pipelineNodes.forEach((node, i) => {
            node.classList.remove('active');
            if (i === activeStep) {
                node.classList.add('active');
                node.style.backgroundColor = steps[i].color;
            } else if (i < activeStep) {
                node.style.backgroundColor = steps[i].color;
                node.style.opacity = '0.6';
            } else {
                node.style.backgroundColor = '#e2e8f0';
                node.style.opacity = '1';
            }
        });

        // Move particle
        if (particle && pipelineNodes[activeStep]) {
            const container = document.querySelector('.df-pipeline-steps');
            const containerRect = container.getBoundingClientRect();
            const nodeRect = pipelineNodes[activeStep].getBoundingClientRect();
            const leftPct = ((nodeRect.left - containerRect.left + nodeRect.width / 2 - 6) / containerRect.width) * 100;
            particle.style.left = leftPct + '%';
        }

        // Advance
        activeStep = (activeStep + 1) % steps.length;
    }

    // Only run if the section exists
    if (prodCards.length > 0) {
        updateAnimation();
        setInterval(updateAnimation, 3000);
    }
}

// ─── CONTACT FORM (SUPABASE) ───
async function handleContactSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const statusEl = document.getElementById('formStatus');

    const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        company: form.company.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim(),
        created_at: new Date().toISOString()
    };

    btn.disabled = true;
    btn.textContent = 'Sending...';
    statusEl.className = 'form-status';
    statusEl.style.display = 'none';

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_inquiries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(payload)
        });

        if (res.ok || res.status === 201) {
            statusEl.className = 'form-status success';
            statusEl.textContent = '✓ Thank you! Your inquiry has been submitted. We\'ll get back to you soon.';
            statusEl.style.display = 'block';
            form.reset();
        } else {
            throw new Error(`Server responded with ${res.status}`);
        }
    } catch (err) {
        console.error('Form submission error:', err);
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
    initDataFlowAnimation();

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});
