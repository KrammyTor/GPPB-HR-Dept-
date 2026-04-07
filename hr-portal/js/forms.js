document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.download-btn');
    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Ready to Download</h3>
            <p id="form-info"><span id="form-name"></span> - Starting in <span id="countdown">2</span> seconds...</p>
            <p>Downloads this session: <span id="download-count">0</span></p>
        </div>
    `;
    document.body.appendChild(modal);

    let downloadCounts = JSON.parse(localStorage.getItem('formDownloads')) || {};
    let countdownInterval;
    let currentFormType;


    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const formCard = this.closest('.form-card');
            currentFormType = formCard.dataset.form;
            const formName = formCard.querySelector('h3').textContent;
            const countEl = document.getElementById('form-name');
            const countdownEl = document.getElementById('countdown');
            const dlCountEl = document.getElementById('download-count');
            countEl.textContent = formName;
            let count = downloadCounts[currentFormType] || 0;
            dlCountEl.textContent = count;
            modal.style.display = 'block';

            let downloadTimeout;
            // ==========
            // COUNTDOWN
            // ==========
            let timeLeft = 2;
            countdownEl.textContent = timeLeft;
            countdownInterval = setInterval(() => {
                timeLeft--;
                countdownEl.textContent = timeLeft;
                if (timeLeft < 0) {
                    clearInterval(countdownInterval);
                    clearTimeout(downloadTimeout);
                }
            }, 1000);

            // ==========================
            // AUTO DOWNLOAD (2 SECS)
            // ==========================
            downloadTimeout = setTimeout(() => {
                downloadForm(currentFormType);
                modal.style.display = 'none';
            }, 2000);
        });
    });


    function downloadForm(formType) {
        const formCard = document.querySelector(`[data-form="${formType}"]`);
        const formName = formCard.querySelector('h3').textContent;
        downloadCounts[formType] = (downloadCounts[formType] || 0) + 1;
        localStorage.setItem('formDownloads', JSON.stringify(downloadCounts));

        const date = new Date().toLocaleString();
        const content = `${formName}

        Generated: ${date}

        This is your downloadable PDF form.
        Print, fill out, and submit to HR.

        Thank you!`;

        const blob = new Blob([content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formName.toLowerCase().replace(/ /g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // ==============================
        // SHOW TOAST
        // ==============================
        const toast = document.createElement('div');
        toast.textContent = 'Download started!';
        toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#4facfe;color:white;padding:1rem 1.5rem;border-radius:8px;z-index:1001;animation:slideIn 0.5s;font-weight:bold;box-shadow:0 4px 12px rgba(79,172,254,0.3);';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // ==============================
    // CLOSE MODAL ON OUTSIDE CLICK
    // ==============================
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            clearInterval(countdownInterval);
            modal.style.display = 'none';
        }
    });

    // ====================
    // ADDITIONAL STYLES
    // ====================
    const style = document.createElement('style');
    style.textContent = `
        #form-info {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});
