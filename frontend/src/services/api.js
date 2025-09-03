export async function fetchData(endpoint) {
  const response = await fetch(endpoint);
  return await response.json();
}