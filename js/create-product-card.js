export function createProductCard({ image, title, price, badgeType }) {
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
