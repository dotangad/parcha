/**
 * Returns a function that generates an incrementing sequence of numbers starting from 1.
 * Useful for building SQL queries with parameters.
 * @param start - The starting number of the sequence, defaults to 0
 */
export const inc = (start = 0) => {
  let n = start;
  return () => {
    n += 1;
    return n;
  }
}
