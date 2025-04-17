import { createProductCard } from "./create-product-card.js";
import { getRandomBadge, getRandomPrice } from "./utils.js";
import { fetchProducts } from "./fetch-products.js";
import Loader from "./Loader.js";

export default function initSwiper() {
  let currentPage = 1;
  let totalPages = Infinity;

  const loader = new Loader(
    "product-featured__loader",
    "product-featured__error"
  );

  const swiper = new Swiper(".featured__swiper", {
    slidesPerView: 1.2,
    spaceBetween: 24,
    breakpoints: {
      768: { slidesPerView: 2.5 },
      1060: { slidesPerView: 4 },
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

  async function loadProducts(page = 1, size = 14) {
    if (page === 1) loader.showLoader();

    try {
      const {
        data,
        totalPages: apiTotalPages,
        currentPage: apiCurrentPage,
      } = await fetchProducts({ page, size });

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
      loader.hideError();
    } catch (error) {
      console.error("Error loading products:", error);
      loader.showError("Oops! Failed to load featured products.");
    } finally {
      loader.hideLoader();
    }
  }

  loadProducts(currentPage);

  swiper.on("reachEnd", async () => {
    if (currentPage >= totalPages) return;
    currentPage++;
    await loadProducts(currentPage);
  });
}
