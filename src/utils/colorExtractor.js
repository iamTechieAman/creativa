/**
 * Extracts dominant color palette from an image using canvas pixel quantization
 */
export const extractPaletteFromImage = (imageElement, maxColors = 5) => {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = Math.min(imageElement.naturalWidth || imageElement.width || 200, 150);
      const height = Math.min(imageElement.naturalHeight || imageElement.height || 200, 150);
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(imageElement, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height).data;
      const colorCounts = {};

      for (let i = 0; i < imageData.length; i += 16) { // sample every 4th pixel
        const r = Math.round(imageData[i] / 24) * 24;
        const g = Math.round(imageData[i + 1] / 24) * 24;
        const b = Math.round(imageData[i + 2] / 24) * 24;
        const a = imageData[i + 3];

        if (a > 128) { // ignore transparent pixels
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }
      }

      const sortedColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxColors)
        .map(entry => entry[0]);

      if (sortedColors.length === 0) {
        resolve(['#7D2AE8', '#00C4CC', '#f59e0b', '#ec4899', '#10b981']);
      } else {
        resolve(sortedColors);
      }
    } catch (err) {
      console.warn('Color extraction fallback:', err);
      resolve(['#7D2AE8', '#00C4CC', '#f59e0b', '#ec4899', '#10b981']);
    }
  });
};
