/**
 * Generate a linearly spaced array of numbers
 * @param a start
 * @param b end
 * @param n number of points
 * @returns array of n points linearly spaced between a and b
 */
export default function linspace(a: number, b: number, n: number) {
  const step = (b - a) / n;
  const result = [];
  for (let i = 0; i <= n; i++) {
    result.push(a + step * i);
  }
  return result;
}
