/* ═══════════════════════════════════════════════════════════════
   RELISH FOODS — main.js
   Supabase integration, animations, video controls, data flow
   ═══════════════════════════════════════════════════════════════ */

// ─── EMAILJS CONFIG ───
// Sign up at https://www.emailjs.com and replace these with your real IDs
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';   // EmailJS → Account → Public Key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';   // EmailJS → Email Services → Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // EmailJS → Email Templates → Template ID

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
    initDataFlowAnimation();

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});
