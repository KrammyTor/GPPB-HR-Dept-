// Enhanced Forms JS - Search, Filter, Downloads, Analytics
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const searchInput = document.getElementById('formSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const formsGrid = document.getElementById('formsGrid');
    const formCards = document.querySelectorAll('.form-card');
    const noResults = document.querySelector('.no-results');
    
    let downloadCounts = JSON.parse(localStorage.getItem('formDownloads')) || {};
    let currentSearch = '';
    let currentFilter = 'all';

    // Search functionality
    searchInput.addEventListener('input', debounce((e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        filterForms();
    }, 300));

    // Filter tabs
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            filterForms();
        });
    });

    // Download buttons
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleDownload(e, btn.dataset.form));
    });

    function filterForms() {
        let visibleCount = 0;
        
        formCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const keywords = card.dataset.keywords.toLowerCase();
            const category = card.dataset.category;
            
            const matchesSearch = !currentSearch || 
                title.includes(currentSearch) || 
                keywords.includes(currentSearch);
            
            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            
            if (matchesSearch && matchesFilter) {
                card.classList.remove('hidden');
                visibleCount++;
                setTimeout(() => card.style.opacity = '1', 50);
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Show/hide no results
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        searchInput.style.borderColor = visibleCount === 0 ? '#ef4444' : '';
    }

    function handleDownload(e, formType) {
        e.preventDefault();
        showModal(formType);
    }

    function showModal(formType) {
        const modal = document.querySelector('.download-modal') || createModal();
        const formCard = document.querySelector(`[data-form="${formType}"]`);
        const formName = formCard.querySelector('h3').textContent;
        
        const formInfo = document.getElementById('form-info');
        const countdownEl = document.getElementById('countdown');
        const dlCountEl = document.querySelector('.stat-number');
        
        downloadCounts[formType] = (downloadCounts[formType] || 0) + 1;
        localStorage.setItem('formDownloads', JSON.stringify(downloadCounts));
        dlCountEl.textContent = downloadCounts[formType];
        
        formInfo.innerHTML = `<strong>${formName}</strong><br>Starting in <span id="countdown">${countdown}</span> seconds...`;
        
        modal.style.display = 'flex';
        
        let timeLeft = 3;
        const countdownInterval = setInterval(() => {
            timeLeft--;
            countdownEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                startDownload(formType, formName);
            }
        }, 1000);
    }

    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'download-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>🎉 Download Ready</h3>
                <div id="form-info"></div>
                <div class="download-stats">
                    <div class="stat-item">
                        <div class="stat-number" data-total="0">0</div>
                        <div>This Form</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" data-total="0">0</div>
                        <div>Total Forms</div>
                    </div>
                </div>
                <button class="cancel-btn">Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Cancel button
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
        
        return modal;
    }

    function startDownload(formType, formName) {
        const date = new Date().toLocaleString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        
        const content = `${formName.toUpperCase()}

Generated: ${date}

GPPB-TSO HR FORM
====================

Instructions:
1. Fill out completely
2. Get supervisor approval where required  
3. Submit via email (hr@gov.ph) or HR dropbox
4. Digital signatures accepted

Thank you for using GPPB-TSO HR Portal!

====================
Form ID: ${formType}-${Date.now()}
`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GPPB-HR-${formName.replace(/ /g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(formName);
        document.querySelector('.download-modal')?.style.setProperty('display', 'none');
    }

    function showToast(formName) {
        const toast = document.createElement('div');
        toast.className = 'download-toast';
        toast.textContent = `Downloaded: ${formName}`;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // Debounce utility
    function debounce(fn, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }

    // Initialize stats
    const totalDownloads = Object.values(downloadCounts).reduce((sum, count) => sum + count, 0);
    document.querySelector('[data-total="total"]')?.querySelector('.stat-number').textContent = totalDownloads;
    
    // Animate stats on load
    const stats = document.querySelectorAll('.stat-number[data-total]');
    stats.forEach(stat => {
        stat.style.opacity = '1';
    });
});

