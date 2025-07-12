//Finds the first difference between 2 strings
export const findFirstDifference = (a: string, b: string): number => {
  const shortestLength = Math.min(a.length, b.length);
  let i = 0,
    firstDifferenceIndex = -1;
  while (i < shortestLength && firstDifferenceIndex === -1) {
    if (a[i] !== b[i]) {
      firstDifferenceIndex = i;
    }
    i++;
    // If index reaches the end without finding the difference, and one
    // of the texts is longer than the other, then the first difference
    // is the length of he shortest text
    if (
      i === shortestLength &&
      firstDifferenceIndex === -1 &&
      a.length !== b.length
    ) {
      firstDifferenceIndex = shortestLength;
    }
  }
  return firstDifferenceIndex;
};
