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

// GRID SECTION ////////////////////////////////////////////////////////////////////////////////////
const dropdownToggle = document.getElementById("dropdownToggle");
const dropdownList = document.getElementById("dropdownList");
const dropdownSelected = document.getElementById("dropdownSelected");
const dropdownItems = document.querySelectorAll(".dropdown__item");
const dropdown = document.getElementById("dropdown");

function createProductGridCard(product) {
  const card = document.createElement("div");
  card.classList.add("product-grid__card");
  card.innerHTML = `
      <span class="product-grid__id">ID: ${String(product.id).padStart(
        2,
        "0"
      )}</span>
      <img src="${product.image}" alt="Product ${
    product.id
  }" class="product-grid__image"/>
    `;
  return card;
}

dropdownToggle.addEventListener("click", () => {
  const expanded = dropdownToggle.getAttribute("aria-expanded") === "true";
  dropdownToggle.setAttribute("aria-expanded", String(!expanded));
  dropdownList.classList.toggle("hidden");
});

dropdownItems.forEach((item) => {
  item.addEventListener("click", () => {
    dropdownSelected.textContent = item.textContent;

    dropdownItems.forEach((el) => el.classList.remove("selected"));
    item.classList.add("selected");

    dropdownToggle.setAttribute("aria-expanded", "false");
    dropdownList.classList.add("hidden");
  });
});

document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target)) {
    dropdownList.classList.add("hidden");
    dropdownToggle.setAttribute("aria-expanded", "false");
  }
});

///////Banner ///////////////////////////////////////////////////////////////////////////////////////
let currentGridPage = 1;
let currentGridPageSize = 14;
let isLoading = false;
let totalGridPages = Infinity;
let bannerInserted = false;

const gridContainer = document.getElementById("productGridContainer");
const selectBtn = document.querySelector(".dropdown__toggle");
const options = document.querySelectorAll(".dropdown__item");

async function fetchAndAppendProducts(page, pageSize) {
  if (isLoading || page > totalGridPages) return;
  isLoading = true;

  try {
    const res = await fetch(
      `https://brandstestowy.smallhost.pl/api/random?pageNumber=${page}&pageSize=${pageSize}`
    );
    const data = await res.json();
    totalGridPages = data.totalPages;

    data.data.forEach((product, index) => {
      if (!bannerInserted && index === 5) {
        const banner = createBanner();
        gridContainer.appendChild(banner);
        bannerInserted = true;
      }

      const card = createProductGridCard(product);
      card.addEventListener("click", () =>
        openProductPopup({ id: product.id, image: product.image })
      );

      gridContainer.appendChild(card);
    });

    currentGridPage++;
  } catch (err) {
    console.error("Error loading products:", err);
  } finally {
    isLoading = false;
  }
}

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const fullHeight = document.documentElement.scrollHeight;

  if (scrollY + viewportHeight >= fullHeight * 0.95) {
    fetchAndAppendProducts(currentGridPage, currentGridPageSize);
  }
});

options.forEach((option) => {
  option.addEventListener("click", () => {
    const value = Number(option.textContent);
    if (value !== currentGridPageSize) {
      currentGridPageSize = value;
      currentGridPage = 1;
      totalGridPages = Infinity;
    }

    selectBtn.querySelector("span").textContent = value;
    document.querySelector(".dropdown__list").classList.add("hidden");
    selectBtn.setAttribute("aria-expanded", "false");
  });
});

function createBanner() {
  const banner = document.createElement("div");
  banner.classList.add("banner");
  banner.innerHTML = `
    <div class="banner__content">
    <div class="banner__content-header>
    <p class="banner__label">FORMA’SINT.</p>
    <h2 class="banner__text heading">You’ll look and feel like the champion.</h2>
    </div>
    <button class="btn banner__btn">
        Check this out
        <img src="assets/icons/ARROW2.svg" alt="" class="banner__icon" />
    </button>
    </div>
    `;
  return banner;
}

fetchAndAppendProducts(currentGridPage, currentGridPageSize);

// POPUP /////////////////////////////////////////////////////////////////////////////////////////

const overlay = document.getElementById("productOverlay");
const popup = document.getElementById("productPopup");
const popupImage = document.getElementById("popupProductImage");
const popupId = document.getElementById("popupProductId");
const popupClose = document.getElementById("popupClose");

function openProductPopup({ id, image }) {
  popupImage.src = image;
  popupImage.alt = `Product ${id}`;
  popupId.textContent = `ID: ${id}`;
  overlay.classList.add("is-visible");
  popup.classList.add("is-visible");
}

function closeProductPopup() {
  overlay.classList.remove("is-visible");
  popup.classList.remove("is-visible");
}

overlay.addEventListener("click", closeProductPopup);
popupClose.addEventListener("click", closeProductPopup);
