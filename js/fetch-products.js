export async function fetchProducts(page = 1, size = 14) {
  const url = `https://brandstestowy.smallhost.pl/api/random?pageNumber=${page}&pageSize=${size}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }
    const { data, totalPages, currentPage } = await response.json();
    return { data, totalPages, currentPage };
  } catch (error) {
    throw new Error("Error fetching products: " + error.message);
  }
}
