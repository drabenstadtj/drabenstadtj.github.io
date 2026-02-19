const navbar = document.getElementById("navbar");
const navbarLinks = document.querySelector(".navbar-links");
const spacer = document.getElementById("navbar-spacer");

const SHOW_THRESHOLD = 50;
const hasHero = !!document.getElementById("hero-landing");

let navbarHidden = hasHero && window.scrollY < SHOW_THRESHOLD;

function updateSpacer() {
  const h = navbarHidden ? 0 : navbar.offsetHeight;
  spacer.style.height = h + "px";
  document.documentElement.style.setProperty("--navbar-h", h + "px");
}

if (navbarHidden) {
  navbar.style.transform = "translateY(-100%)";
}

updateSpacer();

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;

    // Hide navbar only while inside hero
    if (hasHero && y < SHOW_THRESHOLD) {
      if (!navbarHidden) {
        navbarHidden = true;
        navbar.style.transform = "translateY(-100%)";
        updateSpacer();
      }
      return;
    }

    // Once past hero, always show full navbar
    if (navbarHidden) {
      navbarHidden = false;
      navbar.style.transform = "translateY(0)";
      updateSpacer();
    }

    // Always ensure links are visible
    if (navbarLinks.classList.contains("hidden")) {
      navbarLinks.classList.remove("hidden");
    }
  },
  { passive: true },
);

window.addEventListener("resize", updateSpacer);
