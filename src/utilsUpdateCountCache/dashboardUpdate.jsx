export default function UpdateCount(key, operation, amount = 1) {
  const cachedCount = sessionStorage.getItem(key);
  if (cachedCount === null) return;
  const currentCount = Number(cachedCount);
  if (!Number.isFinite(currentCount)) return;
  let newCount = currentCount;
  if (operation === "add") {
    newCount += amount;
  } else if (operation === "delete") {
    newCount = Math.max(0, newCount - amount);
  } else {
    return;
  }
  sessionStorage.setItem(key, String(newCount));
}
