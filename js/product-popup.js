const overlay = document.getElementById("productOverlay");
const popup = document.getElementById("productPopup");
const popupImage = document.getElementById("popupProductImage");
const popupId = document.getElementById("popupProductId");
const popupClose = document.getElementById("popupClose");

export function openProductPopup({ id, image }) {
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

[overlay, popupClose].forEach((el) =>
  el.addEventListener("click", closeProductPopup)
);
