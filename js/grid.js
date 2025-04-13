import { createProductGridCard } from "./create-product-grid-card.js";
import { fetchProducts } from "./fetch-products.js";
import { createBanner } from "./create-banner.js";
import { openProductPopup } from "./product-popup.js";
import Loader from "./Loader.js";

export default function initGrid() {
  let currentPage = 1;
  let pageSize = 14;
  let totalPages = Infinity;
  let bannerInserted = false;

  const gridContainer = document.getElementById("productGridContainer");
  const loader = new Loader("product-grid__loader", "product-grid__error");

  async function loadAndAppendProducts() {
    if (loader.isLoading() || currentPage > totalPages) return;

    loader.showLoader();

    try {
      const {
        data,
        totalPages: apiTotalPages,
        currentPage: apiCurrentPage,
      } = await fetchProducts(currentPage, pageSize);

      console.log("Fetched products:", data);
      totalPages = apiTotalPages;
      currentPage = apiCurrentPage;

      data.forEach((product, index) => {
        if (!bannerInserted && index === 5) {
          const banner = createBanner(
            "FORMA’SINT.",
            "You’ll look and feel like the champion.",
            "Check this out",
            "assets/icons/ARROW2.svg"
          );
          gridContainer.appendChild(banner);
          bannerInserted = true;
        }

        const card = createProductGridCard(product);
        card.addEventListener("click", () =>
          openProductPopup({ id: product.id, image: product.image })
        );
        gridContainer.appendChild(card);
      });
      loader.hideError();
      currentPage++;
    } catch (err) {
      console.error("Error loading products:", err);
      loader.showError("Failed to load products. Please try again later.");
    } finally {
      loader.hideLoader();
    }
  }

  loadAndAppendProducts();

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    if (scrollY + viewportHeight >= fullHeight * 0.95) {
      loadAndAppendProducts();
    }
  });

  return {
    setPageSize: (value) => {
      if (!Number.isInteger(value) || value <= 0) return;
      if (value !== pageSize) {
        pageSize = value;
        currentPage = 1;
        totalPages = Infinity;
      }
    },
  };
}
