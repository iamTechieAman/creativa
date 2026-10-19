/**
 * Dynamic Font Loader for Creativa Typography Engine
 * Dynamically streams and injects authentic fonts via Google Fonts and FontFace API
 */

const loadedFonts = new Set([
  'Inter', 'Roboto', 'Poppins', 'Montserrat', 'Playfair Display', 
  'Oswald', 'Bebas Neue', 'Pacifico', 'Dancing Script', 'Lobster', 'Bangers'
]);

/**
 * Normalizes a font name for Google Fonts URL format
 */
function getGoogleFontUrl(fontFamily) {
  const cleanName = fontFamily.replace(/\s+/g, '+');
  return `https://fonts.googleapis.com/css2?family=${cleanName}:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,400;1,700&display=swap`;
}

/**
 * Dynamically loads any font into the document and waits for browser font readiness
 * @param {string} fontFamily - The font family name (e.g. "League Spartan", "Cinzel")
 * @returns {Promise<boolean>}
 */
export async function loadGoogleFont(fontFamily) {
  if (!fontFamily || fontFamily === 'sans-serif' || fontFamily === 'serif' || fontFamily === 'monospace') {
    return true;
  }

  // Check if already in memory
  if (loadedFonts.has(fontFamily)) {
    return true;
  }

  const linkId = `creativa-font-${fontFamily.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;

  // If link element already exists in DOM
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = getGoogleFontUrl(fontFamily);
    document.head.appendChild(link);
  }

  try {
    // Wait for document.fonts to report the font is loaded
    if (document.fonts && document.fonts.load) {
      await document.fonts.load(`16px "${fontFamily}"`);
    }
    loadedFonts.add(fontFamily);
    return true;
  } catch (err) {
    console.warn(`Font load note for "${fontFamily}":`, err);
    loadedFonts.add(fontFamily);
    return true;
  }
}

/**
 * Preloads popular Creativa signature typography
 */
export function preloadSignatureCreativaFonts() {
  const topCreativaFonts = [
    'Inter', 'League Spartan', 'Cinzel', 'Caveat', 'Great Vibes', 
    'Satisfy', 'Sacramento', 'Lora', 'Merriweather', 'DM Sans', 
    'Outfit', 'Plus Jakarta Sans', 'Anton', 'Archivo Black', 'Shrikhand'
  ];

  topCreativaFonts.forEach(font => {
    loadGoogleFont(font).catch(() => {});
  });
}

export const preloadSignatureCanvaFonts = preloadSignatureCreativaFonts;
