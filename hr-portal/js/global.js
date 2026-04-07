document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // NAV ACTIVE STATE
    // =========================
    const links = document.querySelectorAll(".nav-link");

    let currentPage = window.location.pathname.split("/").pop();
    if (!currentPage) currentPage = "index.html";

    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });

    // =========================
    // FLOATING ICONS (UNUSED FOR NOW)
    // =========================
    //const icons = document.querySelectorAll('.floating-icon');
    //const emojis = ['👋', '📊', '💼', '📈'];

    //icons.forEach((icon, index) => {
    //    icon.textContent = emojis[index % emojis.length];
    //});

    // =========================
    // PARTICLES CANVAS
    // =========================
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

    // =========================
    // HEADER LOAD
    // =========================
    const headerContainer = document.getElementById("site-header");

    if (headerContainer) {
        fetch("./components/header.html")
            .then(res => res.text())
            .then(html => {
                headerContainer.innerHTML = html;
            })
            .catch(err => console.error("Header failed to load:", err));
    }

    // =========================
    // FOOTER LOAD
    // =========================
    const footerContainer = document.getElementById("site-footer");

    if (footerContainer) {
        fetch("./components/footer.html")
            .then(res => res.text())
            .then(html => {
                footerContainer.innerHTML = html;
            })
            .catch(err => console.error("Footer failed to load:", err));
    }

    // =========================
    // SPLASH SCREEN (ONLY ON REFRESH)
    // =========================
    const splashScreen = document.querySelector('.splash-screen');

    if (splashScreen) {

        const navType = performance.getEntriesByType("navigation")[0]?.type;

        if (navType === "reload") {
            splashScreen.classList.remove('fade-out');
            document.body.classList.add('no-scroll');

            setTimeout(() => {
                splashScreen.classList.add('fade-out');
                document.body.classList.remove('no-scroll');
            }, 2500);

            splashScreen.addEventListener('click', () => {
                splashScreen.classList.add('fade-out');
                document.body.classList.remove('no-scroll');
            });

        } else {
            splashScreen.style.display = "none";
        }
    }

    // =========================
    // ACTIVE NAV (AFTER LOAD)
    // =========================
    setTimeout(() => {
        const links = document.querySelectorAll(".nav-link");

        let currentPage = window.location.pathname.split("/").pop();
        if (!currentPage) currentPage = "index.html";

        links.forEach(link => {
            if (link.getAttribute("href") === currentPage) {
                link.classList.add("active");
            }
        });
    }, 100);

    // =========================
    // TABS SYSTEM
    // =========================
    const tabs = document.querySelectorAll(".tab");
    const grids = document.querySelectorAll(".grid");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {

            tabs.forEach(t => t.classList.remove("active"));
            grids.forEach(g => g.classList.remove("active"));

            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).classList.add("active");
        });
    });

});