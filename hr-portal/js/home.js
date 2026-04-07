let index = 0;

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prev = document.querySelector(".hero-btn.prev");
const next = document.querySelector(".hero-btn.next");

// update UI
function updateSlider() {
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));

    slides[index].classList.add("active");
    dots[index].classList.add("active");
}

// go next slide
function showNext() {
    index = (index + 1) % slides.length;
    updateSlider();
}

// go previous slide
function showPrev() {
    index = (index - 1 + slides.length) % slides.length;
    updateSlider();
}

// DOT CLICK SUPPORT
dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
        index = i;
        updateSlider();
    });
});

// ARROWS (SAFE CHECK so it won't break if missing)
if (next) {
    next.addEventListener("click", showNext);
}

if (prev) {
    prev.addEventListener("click", showPrev);
}

// AUTO SLIDE
setInterval(showNext, 4000);

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

window.addEventListener('scroll', requestTick);
