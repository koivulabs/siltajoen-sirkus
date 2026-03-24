
export const getAsset = (path: string, images: any) => {
  if (!path) return null;
  const filename = path.split('/').pop();
  const assetKey = `/src/assets/kuvia/${filename}`;
  const asset = images[assetKey];
  if (!asset) return null;
  // Jos eager: true, palautetaan .default tai itse objekti
  return asset.default || asset;
};
