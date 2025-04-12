const menuToggle = document.getElementById("menuToggle");
const menuClose = document.getElementById("menuClose");
const mobileMenu = document.getElementById("mobileMenu");
const menuOverlay = document.getElementById("menuOverlay");
const mobileLinks = document.querySelectorAll(".mobile-menu__nav a");

function openMenu() {
  mobileMenu.classList.add("is-open");
  menuOverlay.classList.add("is-visible");
  menuToggle.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  mobileMenu.classList.remove("is-open");
  menuOverlay.classList.remove("is-visible");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
menuOverlay.addEventListener("click", closeMenu);

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1060) {
    closeMenu();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
    closeMenu();
  }
});
