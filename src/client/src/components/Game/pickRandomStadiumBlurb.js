/** Pick one stadium description variant (random per call). */
export const pickRandomStadiumBlurb = (locations, rng = Math.random) => {
  if (!Array.isArray(locations) || locations.length === 0) {
    return null;
  }
  if (locations.length === 1) {
    return locations[0];
  }
  const index = Math.floor(rng() * locations.length);
  return locations[index];
};
