export async function getClients(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to update client");
  }
  return await response.json();
}
