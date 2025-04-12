const menuToggle = document.getElementById("menuToggle");
const menuClose = document.getElementById("menuClose");
const mobileMenu = document.getElementById("mobileMenu");
const menuOverlay = document.getElementById("menuOverlay");
const mobileLinks = document.querySelectorAll(".mobile-menu__nav a");
const swiperWrapper = document.getElementById("swiper-wrapper");

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

// Swipper //////////////////////////////////////////////////////////////////////////////////
let currentPage = 1;
let totalPages = Infinity;
const swiper = new Swiper(".featured__swiper", {
  slidesPerView: 1,
  spaceBetween: 24,

  breakpoints: {
    768: {
      slidesPerView: 2.5,
    },
    1060: {
      slidesPerView: 4,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  scrollbar: {
    el: ".swiper-scrollbar",
    draggable: true,
  },
});

async function loadProducts(page = 1, size = 10) {
  try {
    const response = await fetch(
      `https://brandstestowy.smallhost.pl/api/random?pageNumber=${page}&pageSize=${size}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const {
      data,
      totalPages: apiTotalPages,
      currentPage: apiCurrentPage,
    } = await response.json();

    totalPages = apiTotalPages;
    currentPage = apiCurrentPage;

    data.forEach((product) => {
      const cardHTML = createProductCard({
        image: product.image,
        title: product.text,
        price: getRandomPrice(),
        badgeType: getRandomBadge(),
      });

      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");
      slide.innerHTML = cardHTML;
      swiper.appendSlide(slide);
    });
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function getRandomBadge() {
  const badges = [null, "bestseller", "limited"];
  return badges[Math.floor(Math.random() * badges.length)];
}

function getRandomPrice() {
  return (Math.random() * (400 - 200) + 200).toFixed(2);
}

function createProductCard({ image, title, price, badgeType }) {
  console.log("Creating product card...");
  console.log({ image, title, price, badgeType });
  const badgeText =
    badgeType === "bestseller"
      ? "BESTSELLER"
      : badgeType === "limited"
      ? "LIMITED EDITION"
      : "";

  const badgeClass = badgeType ? `badge badge--${badgeType}` : "";

  return `
      <div class="product-card">
        <div class="product-card__image-container">
          ${badgeText ? `<span class="${badgeClass}">${badgeText}</span>` : ""}
            <button class="product-card__favorite" aria-label="Toggle favorite">
            <img
                src="assets/icons/HEART.svg"
                alt="Favorite outline icon"
                class="icon-heart icon-heart--outline"
            />
            <img
                src="assets/icons/HEART_FILL.svg"
                alt="Favorite filled icon"
                class="icon-heart icon-heart--fill"
            />
            </button>
          <img src="${image}" alt="${title}" class="product-card__image" />
        </div>
        <div class="product-card__info">
          <p class="product-card__title body-large">${title}</p>
          <p class="product-card__price">€${price}</p>
        </div>
      </div>
    `;
}

loadProducts(currentPage);

swiper.on("reachEnd", async () => {
  if (currentPage >= totalPages) {
    return;
  }
  currentPage++;
  await loadProducts(currentPage);
});
