/**
 * Canva & Creativa Background Presets
 * 48 Curated Solid Colors & 24 Multi-Stop Gradient Systems
 * Synchronized with Canva design canvas standard options
 */

export const SOLID_COLORS = [
  // 1. Grayscale & Modern Neutrals
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8',
  '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#000000',

  // 2. Warm Primaries: Reds, Corals & Terracotta
  '#fee2e2', '#fca5a5', '#ef4444', '#dc2626', '#b91c1c', '#7f1d1d',
  '#ffedd5', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c',

  // 3. Sunshine, Amber & Golden Glow
  '#fef3c7', '#fde68a', '#facc15', '#f59e0b', '#d97706', '#b45309',

  // 4. Botanical Greens, Sage & Emeralds
  '#f0fdf4', '#bbf7d0', '#86efac', '#22c55e', '#16a34a', '#15803d',
  '#064e3b', '#10b981', '#059669', '#047857', '#84cc16', '#65a30d',

  // 5. Ocean, Cyan & Aquamarine
  '#ecfeff', '#a5f3fc', '#06b6d4', '#0891b2', '#0e7490', '#14b8a6',
  '#f0f9ff', '#bae6fd', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1',

  // 6. Deep Royal Blues & Tech Indigos
  '#eff6ff', '#bfdbfe', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8',
  '#eef2ff', '#c7d2fe', '#818cf8', '#6366f1', '#4f46e5', '#3730a3',

  // 7. Signature Canva Purples, Violets & Amethysts
  '#f5f3ff', '#ddd6fe', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9',
  '#7D2AE8', '#581c87', '#fae8ff', '#f0abfc', '#d946ef', '#c026d3',

  // 8. Hot Pinks, Rose & Luxury Magenta
  '#fdf2f8', '#fbcfe8', '#f472b6', '#ec4899', '#db2777', '#be185d',
  '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48'
];

export const GRADIENT_PRESETS = [
  {
    name: 'Creativa Aurora',
    gradient: 'linear-gradient(135deg, #7D2AE8 0%, #00C4CC 100%)',
    stops: [{ offset: 0, color: '#7D2AE8' }, { offset: 1, color: '#00C4CC' }]
  },
  {
    name: 'Sunset Orange',
    gradient: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
    stops: [{ offset: 0, color: '#ff7e5f' }, { offset: 1, color: '#feb47b' }]
  },
  {
    name: 'Ocean Depths',
    gradient: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
    stops: [{ offset: 0, color: '#2b5876' }, { offset: 1, color: '#4e4376' }]
  },
  {
    name: 'Neon Cyber',
    gradient: 'linear-gradient(135deg, #f72585 0%, #7209b7 50%, #4cc9f0 100%)',
    stops: [{ offset: 0, color: '#f72585' }, { offset: 0.5, color: '#7209b7' }, { offset: 1, color: '#4cc9f0' }]
  },
  {
    name: 'Mint Fresh',
    gradient: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
    stops: [{ offset: 0, color: '#00b09b' }, { offset: 1, color: '#96c93d' }]
  },
  {
    name: 'Deep Space',
    gradient: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
    stops: [{ offset: 0, color: '#141e30' }, { offset: 1, color: '#243b55' }]
  },
  {
    name: 'Rose Gold',
    gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    stops: [{ offset: 0, color: '#fbc2eb' }, { offset: 1, color: '#a6c1ee' }]
  },
  {
    name: 'Royal Purple',
    gradient: 'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)',
    stops: [{ offset: 0, color: '#654ea3' }, { offset: 1, color: '#eaafc8' }]
  },
  {
    name: 'Peach Sorbet',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    stops: [{ offset: 0, color: '#ff9a9e' }, { offset: 1, color: '#fecfef' }]
  },
  {
    name: 'Solar Flare',
    gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    stops: [{ offset: 0, color: '#f12711' }, { offset: 1, color: '#f5af19' }]
  },
  {
    name: 'Mystic Twilight',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #fd746c 100%)',
    stops: [{ offset: 0, color: '#2c3e50' }, { offset: 1, color: '#fd746c' }]
  },
  {
    name: 'Emerald Waters',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    stops: [{ offset: 0, color: '#11998e' }, { offset: 1, color: '#38ef7d' }]
  },
  {
    name: 'California Dream',
    gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    stops: [{ offset: 0, color: '#d299c2' }, { offset: 1, color: '#fef9d7' }]
  },
  {
    name: 'Neon Synthwave',
    gradient: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
    stops: [{ offset: 0, color: '#833ab4' }, { offset: 0.5, color: '#fd1d1d' }, { offset: 1, color: '#fcb045' }]
  },
  {
    name: 'Lavender Cloud',
    gradient: 'linear-gradient(135deg, #c471ed 0%, #f64f59 100%)',
    stops: [{ offset: 0, color: '#c471ed' }, { offset: 1, color: '#f64f59' }]
  },
  {
    name: 'Dark Obsidian',
    gradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    stops: [{ offset: 0, color: '#232526' }, { offset: 1, color: '#414345' }]
  },
  {
    name: 'Tropical Mango',
    gradient: 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)',
    stops: [{ offset: 0, color: '#ffe259' }, { offset: 1, color: '#ffa751' }]
  },
  {
    name: 'Glacier Blue',
    gradient: 'linear-gradient(135deg, #74ebd5 0%, #9face6 100%)',
    stops: [{ offset: 0, color: '#74ebd5' }, { offset: 1, color: '#9face6' }]
  },
  {
    name: 'Electric Violet',
    gradient: 'linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)',
    stops: [{ offset: 0, color: '#4776e6' }, { offset: 1, color: '#8e54e9' }]
  },
  {
    name: 'Golden Hour',
    gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    stops: [{ offset: 0, color: '#f6d365' }, { offset: 1, color: '#fda085' }]
  },
  {
    name: 'Northern Lights',
    gradient: 'linear-gradient(135deg, #0575e6 0%, #00f260 100%)',
    stops: [{ offset: 0, color: '#0575e6' }, { offset: 1, color: '#00f260' }]
  },
  {
    name: 'Retro 80s Sunset',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    stops: [{ offset: 0, color: '#fa709a' }, { offset: 1, color: '#fee140' }]
  },
  {
    name: 'Midnight Amethyst',
    gradient: 'linear-gradient(135deg, #3023ae 0%, #c86dd7 100%)',
    stops: [{ offset: 0, color: '#3023ae' }, { offset: 1, color: '#c86dd7' }]
  },
  {
    name: 'Minimalist Pearl',
    gradient: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
    stops: [{ offset: 0, color: '#e0eafc' }, { offset: 1, color: '#cfdef3' }]
  }
];
