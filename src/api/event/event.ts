export async function fetchEventData() {
  const response = await fetch('/api/news');
  console.log('Event data fetched:', response);
  return response.json();
}
