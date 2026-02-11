const navbar = document.getElementById("navbar");
const navbarLinks = document.querySelector(".navbar-links");
const spacer = document.getElementById("navbar-spacer");

let lastY = window.scrollY;
let linksHidden = false;
let cooldown = false;

function updateSpacer() {
  spacer.style.height = navbar.offsetHeight + "px";
}

updateSpacer();

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;

    if (y <= 2) {
      if (linksHidden) {
        linksHidden = false;
        navbarLinks.classList.remove("hidden");
      }
      lastY = y;
      return;
    }

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
