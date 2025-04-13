export function createBanner(label, text, buttonText, imageSrc) {
  const banner = document.createElement("div");
  banner.classList.add("banner");
  banner.innerHTML = `
        <div class="banner__content">
            <div class="banner__heading">
            <p class="banner__label">${label}</p>
            <h2 class="banner__text heading">${text}</h2>
            </div>
          <button class="btn banner__btn">
            ${buttonText}
            <img src="${imageSrc}" alt="" class="banner__icon" />
          </button>
        </div>
      `;
  return banner;
}
