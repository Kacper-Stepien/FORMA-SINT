export default class Loader {
  constructor(loaderId, errorId) {
    this.loader = document.getElementById(loaderId);
    this.error = document.getElementById(errorId);
    this.loading = false;
  }

  showLoader() {
    this.loading = true;
    this.loader?.classList.remove("loader_hidden");
  }

  hideLoader() {
    this.loading = false;
    this.loader?.classList.add("loader_hidden");
  }

  isLoading() {
    return this.loading;
  }

  showError(message) {
    if (!this.error) return;
    this.error.textContent = message;
    this.error.classList.remove("error_hidden");
  }

  hideError() {
    this.error?.classList.add("error_hidden");
  }

  reset() {
    this.hideLoader();
    this.hideError();
  }
}
