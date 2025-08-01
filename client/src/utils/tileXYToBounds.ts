export const tileXYToBounds = (x: number, y: number, z: number) => {
  const n = 2 ** z;

  const lng1 = (x / n) * 360 - 180;
  const lng2 = ((x + 1) / n) * 360 - 180;

  const latRad1 = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
  const latRad2 = Math.atan(Math.sinh(Math.PI * (1 - (2 * (y + 1)) / n)));

  const lat1 = (latRad1 * 180) / Math.PI;
  const lat2 = (latRad2 * 180) / Math.PI;

  const southWest = [lat2, lng1];
  const northEast = [lat1, lng2];

  return [southWest, northEast];
};
