export default function initDropdown(onSelect) {
  const dropdownToggle = document.querySelector(".dropdown__toggle");
  const dropdownList = document.querySelector(".dropdown__list");
  const dropdownSelected = dropdownToggle.querySelector("span");
  const dropdownItems = document.querySelectorAll(".dropdown__item");
  const dropdown = document.querySelector(".dropdown");

  dropdownToggle.addEventListener("click", () => {
    const expanded = dropdownToggle.getAttribute("aria-expanded") === "true";
    dropdownToggle.setAttribute("aria-expanded", String(!expanded));
    dropdownList.classList.toggle("hidden");
  });

  dropdownItems.forEach((item) => {
    item.addEventListener("click", () => {
      const value = Number(item.dataset.value);
      dropdownSelected.textContent = value;

      dropdownItems.forEach((el) => el.classList.remove("selected"));
      item.classList.add("selected");

      dropdownToggle.setAttribute("aria-expanded", "false");
      dropdownList.classList.add("hidden");

      if (typeof onSelect === "function") {
        onSelect(value);
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdownList.classList.add("hidden");
      dropdownToggle.setAttribute("aria-expanded", "false");
    }
  });
}
