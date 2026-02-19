const navbar = document.getElementById("navbar");
const navbarLinks = document.querySelector(".navbar-links");
const spacer = document.getElementById("navbar-spacer");

let lastY = window.scrollY;
let linksHidden = false;
let cooldown = false;

const SHOW_THRESHOLD = 50;

let navbarHidden = window.scrollY < SHOW_THRESHOLD;

function updateSpacer() {
  spacer.style.height = navbar.offsetHeight + "px";
}

if (navbarHidden) {
  navbar.style.transform = "translateY(-100%)";
}

updateSpacer();

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;

    if (y < SHOW_THRESHOLD) {
      if (!navbarHidden) {
        navbarHidden = true;
        navbar.style.transform = "translateY(-100%)";
        if (linksHidden) {
          linksHidden = false;
          navbarLinks.classList.remove("hidden");
        }
      }
      lastY = y;
      return;
    }

    // First time crossing the threshold: show both bars, hold off direction
    // logic until smooth scroll settles
    if (navbarHidden) {
      navbarHidden = false;
      navbar.style.transform = "translateY(0)";
      linksHidden = false;
      navbarLinks.classList.remove("hidden");
      lastY = y;
      cooldown = true;
      setTimeout(() => {
        cooldown = false;
        lastY = window.scrollY;
      }, 450);
      return;
    }

    // Normal scroll direction behavior
    if (cooldown) {
      lastY = y;
      return;
    }

    const dy = y - lastY;
    if (Math.abs(dy) < 6) return;

    const shouldHide = dy > 0;

    if (shouldHide !== linksHidden) {
      linksHidden = shouldHide;
      navbarLinks.classList.toggle("hidden", shouldHide);
      cooldown = true;
      setTimeout(() => {
        cooldown = false;
        lastY = window.scrollY;
      }, 350);
    }

    lastY = y;
  },
  { passive: true },
);

window.addEventListener("resize", updateSpacer);
