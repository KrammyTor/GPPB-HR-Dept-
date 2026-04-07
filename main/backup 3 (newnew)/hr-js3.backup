// ================= GLOBAL DATA =================
let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
let isAdmin = false;
let currentReplyIndex = -1;

// ================= DOM READY =================
document.addEventListener('DOMContentLoaded', function() {
    // Logo home button
    const logoHome = document.getElementById('logo-home');
    const body = document.body;
    
    logoHome?.addEventListener('click', () => {
        // Hide all sections
        document.querySelectorAll('#home, #hr-resources, #supp-section, #placeholder-section, #recruitment, #learning-development, #rewards-recognition, .card-grid, #downloadable-forms, #discussion-board, .content-placeholder').forEach(section => section.style.display = 'none');
        // Remove active class from sidebar links
        document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
        // Mark home link as active
        document.querySelector('.sidebar a[href="#home"]')?.classList.add('active');
        // Show home
        showHome();
        // Hide page indicator
        const indicator = document.getElementById('page-indicator');
        if (indicator) indicator.style.display = 'none';
        // Close sidebar if open
        body.classList.remove('sidebar-open');
        // Scroll to top
        window.scrollTo(0, 0);
    });
    
    // Sidebar toggle
    const hamburger = document.querySelector('.hamburger');
    
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        body.classList.toggle('sidebar-open');
    });

    // Overlay click close
    document.addEventListener('click', (e) => {
        if (body.classList.contains('sidebar-open') && !document.querySelector('.sidebar').contains(e.target) && !hamburger.contains(e.target)) {
            body.classList.remove('sidebar-open');
        }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && body.classList.contains('sidebar-open')) {
            body.classList.remove('sidebar-open');
        }
    });

    // Show home by default
    showHome();
    
    // Hide page indicator on home page
    const indicator = document.getElementById('page-indicator');
    if (indicator) indicator.style.display = 'none';

    // Parallax effect
    let ticking = false;
    function updateParallax() {
        const parallaxBg = document.querySelector('.parallax-bg');
        if (parallaxBg) {
            const rect = document.querySelector('.parallax-section').getBoundingClientRect();
            const scrollY = window.scrollY;
            const yPos = -(scrollY * 0.5) + (rect.top * 0.5);
            parallaxBg.style.backgroundImage = `url(${parallaxBg.dataset.img})`;
            parallaxBg.style.transform = `translateY(${yPos}px)`;
        }
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // Floating icons
    const icons = document.querySelectorAll('.floating-icon');
    const emojis = ['👋', '📊', '💼', '📈'];
    icons.forEach((icon, index) => {
        icon.textContent = emojis[index % emojis.length];
    });

    // Particles canvas
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = window.innerHeight - 160;
        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 1,
                color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`
            });
        }
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // Hero slider
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    function showSlide(index) {
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }
    dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);

    // Card hover
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-10px) scale(1.02)');
        card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0) scale(1)');
    });

    // Sidebar nav
    document.querySelectorAll('.sidebar a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Update active link in sidebar
            document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            body.classList.remove('sidebar-open');
            document.querySelectorAll('#home, #hr-resources, #supp-section, #placeholder-section, #recruitment, #learning-development, #rewards-recognition, .card-grid, #downloadable-forms, #discussion-board, .content-placeholder').forEach(section => section.style.display = 'none');
            
            // Update page indicator
            const indicator = document.getElementById('page-indicator');
            if (targetId === 'home') {
                if (indicator) indicator.style.display = 'none';
            } else {
                const pageTitles = {
                    'discussion-board': 'DISCUSSION BOARD',
                    'recruitment': 'RECRUITMENT',
                    'downloadable-forms': 'DOWNLOADABLE FILES',
                    'learning-development': 'LEARNING & DEVELOPMENT',
                    'rewards-recognition': 'REWARDS & RECOGNITION'
                };
                if (indicator && pageTitles[targetId]) {
                    indicator.textContent = pageTitles[targetId];
                    indicator.style.display = 'block';
                }
            }
            
            if (targetId === 'home') {
                showHome();
            } else {
                const target = document.getElementById(targetId);
                if (target) {
                    target.style.display = 'block';
                    if (targetId === 'discussion-board') showDiscussionBoard();
                }
            }
        });
    });

    // Download handler
    document.getElementById('download-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active link in sidebar
        document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
        document.getElementById('download-link').classList.add('active');
        
        document.querySelectorAll('.content-placeholder, .hero-section, .card-grid').forEach(s => s.style.display = 'none');
        document.getElementById('downloadable-forms').style.display = 'block';
        // Update page indicator
        const indicator = document.getElementById('page-indicator');
        if (indicator) {
            indicator.textContent = 'DOWNLOADABLE FILES';
            indicator.style.display = 'block';
        }
    });

    // Image stack rotation
    const stackSlides = document.querySelectorAll('.stack-slide');
    let currentStack = 0;
    setInterval(() => {
        stackSlides.forEach(s => s.classList.remove('active'));
        currentStack = (currentStack + 1) % stackSlides.length;
        stackSlides[currentStack].classList.add('active');
    }, 4000);

    // Clock
    function updateClock() {
        const now = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
        document.getElementById('time').textContent = new Date(now).toLocaleTimeString('en-PH', {hour12: false});
        document.getElementById('date').textContent = new Date(now).toLocaleDateString('en-PH');
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ================= ADMIN =================
    isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const adminBtn = document.getElementById('admin-login-btn');
    const adminModal = document.getElementById('admin-modal');
    const adminForm = document.getElementById('admin-form');
    const errorDiv = document.getElementById('admin-error');

    function updateBtnState() {
        adminBtn.textContent = isAdmin ? 'Logout' : 'Login as admin';
        adminBtn.classList.toggle('btn-secondary', !isAdmin);
        adminBtn.classList.toggle('btn-danger', isAdmin);
        document.body.classList.toggle('admin-mode', isAdmin);
    }
    updateBtnState();

    function showModal() {
        adminModal.style.display = 'flex';
        errorDiv.style.display = 'none';
        adminForm.reset();
    }

    function hideModal() {
        adminModal.style.display = 'none';
    }

    adminBtn.addEventListener('click', () => {
        if (isAdmin) {
            isAdmin = false;
            sessionStorage.setItem('isAdmin', 'false');
            updateBtnState();
            renderFeedbacks();
            showSuccessModal('Admin logged out successfully.');
        } else {
            showModal();
        }
    });

    // ✅ FIXED ADMIN LOGIN
    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('admin-username').value.trim();
        const password = document.getElementById('admin-password').value.trim();

        errorDiv.style.display = 'none';

        if (!username || !password) {
            errorDiv.textContent = 'Please enter both username and password.';
            errorDiv.style.display = 'block';
            return;
        }

        if (username === 'admin' && password === '123') {
            isAdmin = true;
            sessionStorage.setItem('isAdmin', 'true');
            updateBtnState();
            renderFeedbacks();
            hideModal();
            showSuccessModal('Admin logged in successfully!');
        } else {
            errorDiv.textContent = 'Invalid username or password.';
            errorDiv.style.display = 'block';
        }
    });

    document.querySelector('#admin-modal .close')?.addEventListener('click', hideModal);
    adminModal?.addEventListener('click', (e) => {
        if (e.target === adminModal) hideModal();
    });

    // Reply modal
    const replyModal = document.getElementById('reply-modal');
    const replyForm = document.getElementById('reply-form');

    function hideReplyModal() {
        replyModal.style.display = 'none';
        replyModal.classList.remove('active');
        currentReplyIndex = -1;
    }

    replyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const reply = document.getElementById('reply-text').value.trim();
        if (currentReplyIndex >= 0) {
            feedbacks[currentReplyIndex].reply = reply;
            localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
            renderFeedbacks();
            hideReplyModal();
        }
    });

    document.querySelector('#reply-modal .close')?.addEventListener('click', hideReplyModal);
    replyModal?.addEventListener('click', (e) => {
        if (e.target === replyModal) hideReplyModal();
    });

    // Success modal function
    function showSuccessModal(message, title = 'Success') {
        const modal = document.getElementById('success-modal');
        const titleEl = document.getElementById('success-title');
        const msgEl = document.getElementById('success-message');
        titleEl.textContent = title;
        msgEl.textContent = message;
        modal.style.display = 'flex';
        // Auto hide after 3 seconds
        setTimeout(() => {
            modal.style.display = 'none';
        }, 3000);
    }

    // Close success modal
    document.getElementById('success-modal')?.querySelector('.close').addEventListener('click', () => {
        document.getElementById('success-modal').style.display = 'none';
    });
    document.getElementById('success-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'success-modal') {
            e.target.style.display = 'none';
        }
    });

    // Feedback form
    document.getElementById('feedback-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const feedback = {
            id: Date.now(),
            name: document.getElementById('first-name').value.trim() + ' ' + document.getElementById('last-name').value.trim(),
            department: document.getElementById('department').value.trim(),
            email: document.getElementById('email').value.trim(),
            feedback: document.getElementById('feedback-text').value.trim(),
            status: 'Not Viewed',
            date: new Date().toLocaleString()
        };
        if (feedback.name && feedback.department && feedback.email && feedback.feedback) {
            feedbacks.unshift(feedback);
            localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
            e.target.reset();
            renderFeedbacks();
            showSuccessModal('Feedback has been sent successfully!');
        }
    });
});

// ================= FUNCTIONS =================

// Category tab switching
let currentTab = 'high-priority';

function showCategoryTab(tabId) {
    currentTab = tabId;
    document.querySelectorAll('.category-grid').forEach(grid => grid.style.display = 'none');
    document.querySelectorAll('.discussion-tab').forEach(tab => tab.classList.remove('tab-active'));
    const activeGrid = document.getElementById(`category-${tabId}`);
    const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeGrid) activeGrid.style.display = 'grid';
    if (activeTab) activeTab.classList.add('tab-active');
}

function showHome() {

    document.querySelectorAll('.content-placeholder, .card-grid, #downloadable-forms, #discussion-board').forEach(s => s.style.display = 'none');
    ['home', 'supp-section', 'placeholder-section', 'hr-resources'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'block';
    });
}

function showDiscussionBoard() {
    if (isAdmin) {
        let hasUpdate = false;
        feedbacks.forEach(fb => {
            if (fb.status === 'Not Viewed') {
                fb.status = 'Viewed';
                hasUpdate = true;
            }
        });
        if (hasUpdate) {
            localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        }
    }
    
    // Add tab click listeners if tabs exist
    document.querySelectorAll('.discussion-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            showCategoryTab(tab.dataset.tab);
        });
    });
    
    renderFeedbacks();
}

// Global functions for onclick
window.updateStatus = updateStatus;

window.replyFeedback = replyFeedback;
window.deleteFeedback = deleteFeedback;
window.showCategoryTab = showCategoryTab;


function renderFeedbacks() {

    // Show first tab by default
    showCategoryTab('high-priority');

    // Group feedbacks by category
    const categories = {
        'high-priority': [],
        'pending': [],
        'not-viewed': [],
        'resolved': []
    };

    feedbacks.forEach((fb, index) => {
        const status = fb.status.toLowerCase();

        if (status === 'high priority') {
            categories['high-priority'].push({ fb, index });
        } 
        else if (status === 'pending') {
            categories['pending'].push({ fb, index });
        } 
        else if (status === 'resolved') {
            categories['resolved'].push({ fb, index });
        } 
        else {
            categories['not-viewed'].push({ fb, index });
        }
    });

    // Render each category
    Object.keys(categories).forEach(catKey => {
        const container = document.getElementById(`category-${catKey}`);
        if (!container) return;

        container.innerHTML = '';

        categories[catKey].forEach(({ fb, index }) => {

            const card = document.createElement('div');
            card.className = 'feedback-card';

            const statusClass = `status-badge status-${fb.status.toLowerCase().replace(/ /g, '-')}`;

            const adminActions = isAdmin ? `
                <div class="feedback-actions">
                    <select onchange="updateStatus(${index}, this.value)">
                        <option value="High Priority" ${fb.status === 'High Priority' ? 'selected' : ''}>High Priority</option>
                        <option value="Pending" ${fb.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Not Viewed" ${fb.status === 'Not Viewed' ? 'selected' : ''}>Not Viewed</option>
                        <option value="Resolved" ${fb.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                    </select>
                    <button onclick="replyFeedback(${index})" class="btn btn-primary btn-sm">Reply</button>
                    <button onclick="deleteFeedback(${index})" class="btn btn-danger btn-sm">Delete</button>
                </div>
            ` : '';

            card.innerHTML = `
                <div class="feedback-header">
                    <div>
                        <div class="feedback-name">${fb.name}</div>
                        <div class="feedback-meta">${fb.department} | ${fb.email} | ${fb.date}</div>
                    </div>
                </div>
                <div class="feedback-content">${fb.feedback}</div>
                ${fb.reply ? `<div class="feedback-reply"><strong>Admin Reply:</strong> ${fb.reply}</div>` : ''}
                <div class="feedback-footer">
                    <span class="${statusClass}">${fb.status}</span>
                    ${adminActions}
                </div>
            `;

            container.appendChild(card);
        });
    });
}

function updateStatus(index, status) {
    feedbacks[index].status = status;
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    renderFeedbacks();
}

function replyFeedback(index) {
    currentReplyIndex = index;
    const current = feedbacks[index];
    document.getElementById('reply-text').value = current.reply || '';
    document.getElementById('reply-modal').style.display = 'flex';
    document.getElementById('reply-modal').classList.add('active');
}

function deleteFeedback(index) {
    if (confirm('Are you sure you want to delete this feedback suggestion?')) {
        feedbacks.splice(index, 1);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        renderFeedbacks();
    }
}