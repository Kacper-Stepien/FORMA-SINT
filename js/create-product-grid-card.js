export function createProductGridCard({ id, image }) {
  const card = document.createElement("div");
  card.classList.add("product-grid__card");
  card.innerHTML = `
    <span class="product-grid__id">ID: ${String(id).padStart(2, "0")}</span>
    <img
      src="${image}"
      alt="Product ${id}"
      class="product-grid__image"
    />
  `;
  return card;
}
