function ensureSplashScreen() {
    let splashScreen = document.querySelector(".splash-screen");

    if (splashScreen || !document.body) {
        return splashScreen;
    }

    splashScreen = document.createElement("div");
    splashScreen.className = "splash-screen";
    splashScreen.innerHTML = `
        <div class="splash-logo">
            <img src="../assets/gppb3.png" alt="HR Portal Logo">
        </div>
    `;

    document.body.prepend(splashScreen);

    return splashScreen;
}

function runSplashScreen() {
    const splashScreen = ensureSplashScreen();

    if (!splashScreen) {
        return;
    }

    const navType = performance.getEntriesByType("navigation")[0]?.type;
    const hasShownSplash = sessionStorage.getItem("hasShownSplash") === "true";
    const shouldShowSplash = navType === "reload" || !hasShownSplash;

    if (!shouldShowSplash) {
        splashScreen.style.display = "none";
        return;
    }

    const dismissSplash = () => {
        splashScreen.classList.add("fade-out");
        document.body.classList.remove("no-scroll");

        window.setTimeout(() => {
            splashScreen.style.display = "none";
        }, 800);
    };

    splashScreen.style.display = "flex";
    splashScreen.classList.remove("fade-out");
    document.body.classList.add("no-scroll");
    sessionStorage.setItem("hasShownSplash", "true");

    window.setTimeout(dismissSplash, 2500);
}

document.addEventListener("DOMContentLoaded", () => {
    runSplashScreen();

    function setActiveNavLinks() {
        const links = document.querySelectorAll(".nav-link");
        let currentPage = window.location.pathname.split("/").pop();
        if (!currentPage) currentPage = "index.html";

        links.forEach(link => {
            if (link.getAttribute("href") === currentPage) {
                link.classList.add("active");
            }
        });
    }

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
            .then(headerHtml => {
                headerContainer.innerHTML = headerHtml;
                setActiveNavLinks();

                const topHeader = headerContainer.querySelector(".top-header");
                const bottomNav = headerContainer.querySelector(".bottom-nav");
                const navToggle = headerContainer.querySelector(".nav-toggle");
                const navBackdrop = headerContainer.querySelector(".nav-backdrop");
                const navLinks = headerContainer.querySelectorAll(".nav-link");

                // Phone sidebar controls
                const closeMobileNav = () => {
                    document.body.classList.remove("nav-open");
                    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
                };

                const openMobileNav = () => {
                    document.body.classList.add("nav-open");
                    if (navToggle) navToggle.setAttribute("aria-expanded", "true");
                };

                if (navToggle) {
                    navToggle.addEventListener("click", () => {
                        if (document.body.classList.contains("nav-open")) {
                            closeMobileNav();
                        } else {
                            openMobileNav();
                        }
                    });
                }

                if (navBackdrop) {
                    navBackdrop.addEventListener("click", closeMobileNav);
                }

                navLinks.forEach(link => {
                    link.addEventListener("click", closeMobileNav);
                });

                // Desktop keeps top-fixed nav behavior; phones pin sidebar to top.
                const syncFixedNavPosition = () => {
                    if (!topHeader || !bottomNav) return;

                    if (window.innerWidth <= 768) {
                        headerContainer.style.paddingBottom = "0px";
                        bottomNav.style.top = "0px";
                        return;
                    }

                    const headerHeight = topHeader.offsetHeight;
                    const navHeight = bottomNav.offsetHeight;

                    // Keep content below the fixed nav.
                    headerContainer.style.paddingBottom = `${navHeight}px`;

                    // Nav sits right below visible header; reaches top once header is fully scrolled out.
                    const navTop = Math.max(headerHeight - window.scrollY, 0);
                    bottomNav.style.top = `${navTop}px`;
                };

                window.addEventListener("scroll", syncFixedNavPosition, { passive: true });
                window.addEventListener("resize", () => {
                    if (window.innerWidth > 768) {
                        closeMobileNav();
                    }
                    syncFixedNavPosition();
                });
                syncFixedNavPosition();
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
