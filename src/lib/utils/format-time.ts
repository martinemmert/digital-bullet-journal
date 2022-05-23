export function formatTime(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("de-de")} - ${date.toLocaleTimeString(
    "de-de"
  )}`;
}
