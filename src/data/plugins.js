export const CANVA_PLUGINS = [
  {
    id: 'ai-image',
    name: 'AI Image Generator',
    category: 'AI & Magic',
    badge: 'Magic Media',
    icon: 'Sparkles',
    color: '#7D2AE8',
    description: 'Transform your text prompts into photorealistic images, digital art, and anime styles.'
  },
  {
    id: 'typecraft',
    name: 'TypeCraft (3D Text)',
    category: 'Typography',
    badge: 'Popular',
    icon: 'Type',
    color: '#00C4CC',
    description: 'Extrude, bevel, warp, and create 3D dimensional typography with layered shadow depth.'
  },
  {
    id: 'smartmockups',
    name: 'Smartmockups Studio',
    category: 'Design & Mockups',
    badge: 'Pro',
    icon: 'Smartphone',
    color: '#ec4899',
    description: 'Preview designs on smartphones, laptops, apparel, mugs, and hardcover book covers.'
  },
  {
    id: 'tables',
    name: 'Data Tables & Grids',
    category: 'Productivity',
    badge: 'Essential',
    icon: 'Table',
    color: '#10b981',
    description: 'Insert responsive vector grid tables with custom rows, columns, and zebra styling.'
  },
  {
    id: 'giphy',
    name: 'GIPHY Stickers',
    category: 'Media & Social',
    badge: 'Trending',
    icon: 'Film',
    color: '#f59e0b',
    description: 'Search millions of trending stickers, expressive memes, and animated celebration badges.'
  },
  {
    id: 'brandfetch',
    name: 'Brandfetch Logos',
    category: 'Media & Social',
    badge: 'Verified',
    icon: 'ShieldCheck',
    color: '#6366f1',
    description: 'Instant 1-click access to official vector logos for Google, Apple, Microsoft, Spotify, and more.'
  },
  {
    id: 'equations',
    name: 'Math Equations',
    category: 'Typography',
    badge: 'Education',
    icon: 'Binary',
    color: '#06b6d4',
    description: 'Render crisp scientific formulas, calculus derivatives, and algebraic equations.'
  },
  {
    id: 'qrcode',
    name: 'Dynamic QR Codes',
    category: 'Marketing',
    badge: 'Utility',
    icon: 'QrCode',
    color: '#8b5cf6',
    description: 'Generate high-density branded QR codes with custom colors and logo embedding.'
  },
  {
    id: 'charts',
    name: 'Vector Infographics',
    category: 'Productivity',
    badge: 'Business',
    icon: 'BarChart3',
    color: '#3b82f6',
    description: 'Create presentation-ready bar charts, line graphs, and percentage donut rings.'
  },
  {
    id: 'contrast-checker',
    name: 'Contrast & Accessibility',
    category: 'Utility',
    badge: 'WCAG',
    icon: 'Eye',
    color: '#14b8a6',
    description: 'Check color contrast ratios against WCAG 2.1 AA and AAA accessibility standards.'
  },
  {
    id: 'magic-morph',
    name: 'Magic Morph (3D Texture)',
    category: 'AI & Magic',
    badge: 'Pro AI',
    icon: 'Sparkles',
    color: '#BD00FF',
    description: 'Transform words and shapes into 3D balloons, liquid chrome, melted gold, and neon wire.'
  },
  {
    id: 'magic-design',
    name: 'Magic Design (AI Layouts)',
    category: 'AI & Magic',
    badge: 'Magic Studio',
    icon: 'Wand2',
    color: '#FF0055',
    description: 'Describe any vision in words and generate full multi-element templates in seconds.'
  }
];

export const BRAND_LOGOS = [
  { name: 'Google', symbol: 'G', color: '#4285F4', bg: '#ffffff', textColor: '#4285F4' },
  { name: 'Apple', symbol: '', color: '#000000', bg: '#f1f5f9', textColor: '#000000' },
  { name: 'Microsoft', symbol: '⊞', color: '#00A4EF', bg: '#ffffff', textColor: '#00A4EF' },
  { name: 'Amazon', symbol: 'a', color: '#FF9900', bg: '#131921', textColor: '#FF9900' },
  { name: 'Netflix', symbol: 'N', color: '#E50914', bg: '#000000', textColor: '#E50914' },
  { name: 'Spotify', symbol: '♫', color: '#1DB954', bg: '#121212', textColor: '#1DB954' },
  { name: 'Creativa', symbol: 'C', color: '#7D2AE8', bg: '#00C4CC', textColor: '#ffffff' },
  { name: 'OpenAI', symbol: '✳', color: '#10A37F', bg: '#000000', textColor: '#ffffff' },
  { name: 'YouTube', symbol: '▶', color: '#FF0000', bg: '#ffffff', textColor: '#FF0000' },
  { name: 'GitHub', symbol: '⌥', color: '#24292e', bg: '#ffffff', textColor: '#24292e' },
  { name: 'Slack', symbol: '#', color: '#4A154B', bg: '#ffffff', textColor: '#4A154B' },
  { name: 'Figma', symbol: 'F', color: '#F24E1E', bg: '#1E1E1E', textColor: '#ffffff' }
];

export const GIPHY_STICKERS = [
  { id: 'fire', name: 'Lit Fire', url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=300&q=80', tag: 'Trending' },
  { id: 'party', name: 'Party Popper', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80', tag: 'Celebration' },
  { id: 'sparkle', name: 'Magic Sparkles', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80', tag: 'Vibes' },
  { id: 'coffee', name: 'Coffee Cup', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=300&q=80', tag: 'Work' },
  { id: 'heart', name: 'Neon Heart', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=300&q=80', tag: 'Love' },
  { id: 'stars', name: 'Star Galaxy', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=80', tag: 'Cool' }
];

export const MATH_FORMULAS = [
  { name: 'Mass-Energy Equivalence', formula: 'E = mc²', category: 'Physics' },
  { name: 'Pythagorean Theorem', formula: 'a² + b² = c²', category: 'Geometry' },
  { name: 'Euler’s Identity', formula: 'e^(iπ) + 1 = 0', category: 'Calculus' },
  { name: 'Quadratic Formula', formula: 'x = (-b ± √(b² - 4ac)) / 2a', category: 'Algebra' },
  { name: 'Schrödinger Wave', formula: 'iℏ ∂ψ/∂t = Ĥψ', category: 'Quantum' },
  { name: 'Normal Distribution', formula: 'f(x) = (1/σ√2π) e^(-(x-μ)²/2σ²)', category: 'Statistics' }
];
