export function randFloat() {
  return Math.random();
}

// Python/NumPy equivalent: np.random.randint(low, high)
// low inclusive, high exclusive
export function randInt(low, high) {
  return Math.floor(Math.random() * (high - low)) + low;
}