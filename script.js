import initMenu from "./js/menu.js";
import initSwiper from "./js/swiper.js";
import initDropdown from "./js/dropdown.js";
import initGrid from "./js/grid.js";

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initSwiper();
  const productsGrid = initGrid();
  initDropdown(productsGrid.setPageSize);
});
