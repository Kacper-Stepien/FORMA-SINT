export function getRandomBadge() {
  const badges = [null, "bestseller", "limited"];
  return badges[Math.floor(Math.random() * badges.length)];
}

export function getRandomPrice(min = 200, max = 400) {
  const price = Math.random() * (max - min) + min;
  return price.toFixed(2);
}
