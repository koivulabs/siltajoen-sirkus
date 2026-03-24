
export const getAsset = (path: string, images: Record<string, () => Promise<{ default: ImageMetadata }>>) => {
  if (!path) return null;
  const filename = path.split('/').pop();
  const assetKey = `/src/assets/kuvia/${filename}`;
  return images[assetKey] ? images[assetKey]() : null;
};
