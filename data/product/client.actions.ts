export async function getProducts(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to update product");
  }
  return await response.json();
}
