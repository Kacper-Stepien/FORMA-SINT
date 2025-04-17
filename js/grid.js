import { createProductGridCard } from "./create-product-grid-card.js";
import { fetchProducts } from "./fetch-products.js";
import { createBanner } from "./create-banner.js";
import { openProductPopup } from "./product-popup.js";
import Loader from "./Loader.js";

export default function initGrid() {
  let page = 1;
  let pageSize = 14;
  let totalPages = Infinity;
  let bannerInserted = false;
  const loadedProductIds = new Set();

  const gridContainer = document.getElementById("productGridContainer");
  const loader = new Loader("product-grid__loader", "product-grid__error");

  async function loadAndAppendProducts() {
    if (loader.isLoading() || page > totalPages) return;

    loader.showLoader();

    try {
      const { data, totalPages: fetchedTotalPages } = await fetchProducts(
        page,
        pageSize
      );

      // console.log("Fetched products:", data);
      // console.log("Total pages:", fetchedTotalPages);
      // console.log("Current page:", page);

      totalPages = fetchedTotalPages;

      data.forEach((product, index) => {
        if (loadedProductIds.has(product.id)) return;
        loadedProductIds.add(product.id);

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

      page++;
      loader.hideError();
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
    setPageSize: (newSize) => {
      if (!Number.isInteger(newSize) || newSize <= 0) return;

      if (newSize !== pageSize) {
        const estimatedTotalLoaded = (page - 1) * pageSize;

        pageSize = newSize;
        page = Math.floor(estimatedTotalLoaded / pageSize) + 1;
        totalPages = Infinity;

        loadAndAppendProducts();
      }
    },
  };
}
