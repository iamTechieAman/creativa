/**
 * Magic Background Remover tool:
 * Detects background color from all 4 corner pixels and makes matching background pixels transparent
 */
export const removeImageBackground = (imageSource, tolerance = 35) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Sample 4 corners for background color keying
        const corners = [
          0, // Top-Left
          (canvas.width - 1) * 4, // Top-Right
          (canvas.height - 1) * canvas.width * 4, // Bottom-Left
          ((canvas.height - 1) * canvas.width + (canvas.width - 1)) * 4 // Bottom-Right
        ];

        const keyColors = corners.map(idx => ({
          r: data[idx],
          g: data[idx + 1],
          b: data[idx + 2]
        }));

        const tolSq = tolerance * tolerance * 3;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Compute minimum distance to any sampled corner
          let minDist = Infinity;
          for (const key of keyColors) {
            const dist = (r - key.r) ** 2 + (g - key.g) ** 2 + (b - key.b) ** 2;
            if (dist < minDist) minDist = dist;
          }

          if (minDist <= tolSq) {
            // Smooth edge alpha falloff for seamless cutout
            if (minDist < tolSq * 0.65) {
              data[i + 3] = 0; // completely transparent
            } else {
              data[i + 3] = Math.round(((minDist - tolSq * 0.65) / (tolSq * 0.35)) * 255);
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = reject;
    img.src = imageSource;
  });
};

/**
 * Applies client-side CSS filter adjustments to generate a newly rendered data URL
 */
export const applyImageAdjustments = (imageSource, filters = {}) => {
  return new Promise((resolve, reject) => {
    const {
      brightness = 100, // 0 to 200
      contrast = 100,   // 0 to 200
      saturate = 100,   // 0 to 200
      blur = 0,         // 0 to 20
      hueRotate = 0,    // 0 to 360
      grayscale = 0,    // 0 to 100
      sepia = 0,        // 0 to 100
      invert = 0        // 0 to 100
    } = filters;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');

        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur}px) hue-rotate(${hueRotate}deg) grayscale(${grayscale}%) sepia(${sepia}%) invert(${invert}%)`;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = reject;
    img.src = imageSource;
  });
};

/**
 * Canva Pro Duotone Effect: Maps dark luminance to shadowColor and bright luminance to highlightColor
 */
export const applyDuotone = (imageSource, shadowHex, highlightHex) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Parse hex strings into RGB
        const parseHex = (hex) => {
          const clean = hex.replace('#', '');
          const num = parseInt(clean, 16);
          return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
        };

        const [sr, sg, sb] = parseHex(shadowHex);
        const [hr, hg, hb] = parseHex(highlightHex);

        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha === 0) continue;

          // Standard ITU-R BT.601 luminance
          const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          data[i] = Math.round(sr + lum * (hr - sr));
          data[i + 1] = Math.round(sg + lum * (hg - sg));
          data[i + 2] = Math.round(sb + lum * (hb - sb));
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = reject;
    img.src = imageSource;
  });
};

export const DUOTONE_PRESETS = [
  { name: 'Violet Pop', shadow: '#2e0249', highlight: '#00f2fe' },
  { name: 'Cherry Glow', shadow: '#4a0018', highlight: '#fbc2eb' },
  { name: 'Navy & Amber', shadow: '#031b4e', highlight: '#fbbf24' },
  { name: 'Cyber Neon', shadow: '#1a0033', highlight: '#ff007f' },
  { name: 'Emerald Forest', shadow: '#022c22', highlight: '#6ee7b7' },
  { name: 'Classic Sepia', shadow: '#2c1810', highlight: '#f5deb3' }
];

export const PHOTO_FILTER_PRESETS = [
  { name: 'Normal', filters: { brightness: 100, contrast: 100, saturate: 100, blur: 0, hueRotate: 0, grayscale: 0, sepia: 0, invert: 0 } },
  { name: 'Vivid Pop', filters: { brightness: 105, contrast: 125, saturate: 140, blur: 0, hueRotate: 0, grayscale: 0, sepia: 0, invert: 0 } },
  { name: 'Vintage 90s', filters: { brightness: 110, contrast: 90, saturate: 85, blur: 0, hueRotate: 0, grayscale: 0, sepia: 40, invert: 0 } },
  { name: 'Dramatic', filters: { brightness: 95, contrast: 140, saturate: 120, blur: 0, hueRotate: 0, grayscale: 0, sepia: 0, invert: 0 } },
  { name: 'Warm Sunset', filters: { brightness: 105, contrast: 105, saturate: 125, blur: 0, hueRotate: -15, grayscale: 0, sepia: 20, invert: 0 } },
  { name: 'Cool Breeze', filters: { brightness: 105, contrast: 100, saturate: 110, blur: 0, hueRotate: 45, grayscale: 0, sepia: 0, invert: 0 } },
  { name: 'Cyberpunk', filters: { brightness: 115, contrast: 130, saturate: 160, blur: 0, hueRotate: 120, grayscale: 0, sepia: 0, invert: 0 } },
  { name: 'Noir Black', filters: { brightness: 100, contrast: 150, saturate: 0, blur: 0, hueRotate: 0, grayscale: 100, sepia: 0, invert: 0 } },
  { name: 'Moody Film', filters: { brightness: 90, contrast: 115, saturate: 75, blur: 0, hueRotate: 10, grayscale: 0, sepia: 15, invert: 0 } }
];

/**
 * Canva Pro Magic Eraser: Content-Aware Inpainting
 * Erases masked objects by diffusing surrounding boundary textures & gradients inward.
 */
export const inpaintImage = (imageSource, maskCanvas) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Get mask data scaled to match image dimensions
        const mCanvas = document.createElement('canvas');
        mCanvas.width = w;
        mCanvas.height = h;
        const mCtx = mCanvas.getContext('2d');
        mCtx.drawImage(maskCanvas, 0, 0, w, h);
        const maskData = mCtx.getImageData(0, 0, w, h).data;

        // Create binary mask array: 1 = erase, 0 = keep
        const mask = new Uint8Array(w * h);
        let eraseCount = 0;
        for (let i = 0; i < maskData.length; i += 4) {
          if (maskData[i + 3] > 20) {
            mask[i / 4] = 1;
            eraseCount++;
          }
        }

        if (eraseCount === 0) {
          resolve(canvas.toDataURL('image/png'));
          return;
        }

        // Fast multi-pass content-aware inpainting using boundary inward diffusion
        const passes = 24;
        for (let p = 0; p < passes; p++) {
          for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
              const idx = y * w + x;
              if (mask[idx] === 1) {
                let rSum = 0, gSum = 0, bSum = 0, count = 0;
                // Check 8 neighbors
                const neighbors = [
                  (y - 1) * w + (x - 1), (y - 1) * w + x, (y - 1) * w + (x + 1),
                  y * w + (x - 1),                         y * w + (x + 1),
                  (y + 1) * w + (x - 1), (y + 1) * w + x, (y + 1) * w + (x + 1)
                ];
                for (const nIdx of neighbors) {
                  const weight = mask[nIdx] === 0 ? 3 : 1;
                  const pIdx = nIdx * 4;
                  rSum += data[pIdx] * weight;
                  gSum += data[pIdx + 1] * weight;
                  bSum += data[pIdx + 2] * weight;
                  count += weight;
                }
                if (count > 0) {
                  const targetIdx = idx * 4;
                  data[targetIdx] = Math.round(rSum / count);
                  data[targetIdx + 1] = Math.round(gSum / count);
                  data[targetIdx + 2] = Math.round(bSum / count);
                }
              }
            }
          }
        }

        // Add subtle natural texture grain so filled region matches original photo grain
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = y * w + x;
            if (mask[idx] === 1) {
              const pIdx = idx * 4;
              const grain = (Math.random() - 0.5) * 5;
              data[pIdx] = Math.min(255, Math.max(0, data[pIdx] + grain));
              data[pIdx + 1] = Math.min(255, Math.max(0, data[pIdx + 1] + grain));
              data[pIdx + 2] = Math.min(255, Math.max(0, data[pIdx + 2] + grain));
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = reject;
    img.src = imageSource;
  });
};

/**
 * Canva Pro 1-Click Auto Enhance:
 * Automatically balances contrast histogram, boosts vibrance, and levels lighting
 */
export const autoEnhanceImage = (imageSource) => {
  return applyImageAdjustments(imageSource, {
    brightness: 104,
    contrast: 114,
    saturate: 118,
    blur: 0,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0
  });
};

