import { PREMADE_TEMPLATES } from '../data/templates';
import { SCRAPED_CANVA_TEMPLATES } from '../data/scrapedCanvaTemplates';
import { getAutoScrapedData } from './autoScraper';
import { getAllCreators } from '../data/creators';

export function getAllTemplates() {
  try {
    const autoData = getAutoScrapedData();
    const creators = getAllCreators();
    
    // Extract all designs from creators
    const creatorDesigns = [];
    creators.forEach(c => {
      if (c && Array.isArray(c.designs)) {
        c.designs.forEach((d) => {
          creatorDesigns.push({
            ...d,
            creator: {
              id: c.id,
              name: c.name,
              handle: c.handle,
              avatar: c.avatar,
              verified: c.verified,
              specialty: c.specialty
            },
            keywords: [
              ...(d.keywords || []),
              c.name.toLowerCase(),
              c.handle.toLowerCase(),
              c.specialty?.toLowerCase() || '',
              'creator',
              'official'
            ]
          });
        });
      }
    });

    // Map each scraped template to a creator if it doesn't already have one
    const enrichedScraped = SCRAPED_CANVA_TEMPLATES.map((t, idx) => {
      if (t.creator) return t;
      const assignedCreator = creators[idx % creators.length];
      return {
        ...t,
        creator: assignedCreator ? {
          id: assignedCreator.id,
          name: assignedCreator.name,
          handle: assignedCreator.handle,
          avatar: assignedCreator.avatar,
          verified: assignedCreator.verified,
          specialty: assignedCreator.specialty
        } : null
      };
    });

    const map = new Map();
    [...autoData.templates, ...enrichedScraped, ...creatorDesigns, ...PREMADE_TEMPLATES].forEach(t => {
      if (t && t.id) map.set(t.id, t);
    });
    return Array.from(map.values());
  } catch (e) {
    return [...SCRAPED_CANVA_TEMPLATES, ...PREMADE_TEMPLATES];
  }
}

export function searchCreators(query = '') {
  const allCreators = getAllCreators();
  if (!query) return allCreators;
  const q = query.trim().toLowerCase();
  return allCreators.filter(c => {
    return c.name.toLowerCase().includes(q) ||
           c.handle.toLowerCase().includes(q) ||
           (c.specialty && c.specialty.toLowerCase().includes(q)) ||
           (c.bio && c.bio.toLowerCase().includes(q));
  });
}

// Color palette themes by topic/vibe
const THEME_PALETTES = {
  fitness: { bg: '#09090b', primary: '#ef4444', accent: '#f59e0b', text: '#ffffff', subtext: '#a1a1aa' },
  gaming: { bg: '#0b0f19', primary: '#8b5cf6', accent: '#06b6d4', text: '#ffffff', subtext: '#94a3b8' },
  crypto: { bg: '#030712', primary: '#3b82f6', accent: '#10b981', text: '#f9fafb', subtext: '#9ca3af' },
  food: { bg: '#fffbeb', primary: '#d97706', accent: '#dc2626', text: '#451a03', subtext: '#78350f' },
  wedding: { bg: '#fffaf5', primary: '#9f1239', accent: '#d97706', text: '#4c0519', subtext: '#701a75' },
  realestate: { bg: '#0f172a', primary: '#0284c7', accent: '#e2e8f0', text: '#ffffff', subtext: '#94a3b8' },
  travel: { bg: '#082f49', primary: '#0ea5e9', accent: '#38bdf8', text: '#ffffff', subtext: '#bae6fd' },
  fashion: { bg: '#faf5ff', primary: '#7c3aed', accent: '#ec4899', text: '#2e1065', subtext: '#6b21a8' },
  medical: { bg: '#f0fdf4', primary: '#059669', accent: '#0284c7', text: '#064e3b', subtext: '#047857' },
  music: { bg: '#18181b', primary: '#f43f5e', accent: '#a855f7', text: '#ffffff', subtext: '#d4d4d8' },
  education: { bg: '#f8fafc', primary: '#2563eb', accent: '#f59e0b', text: '#0f172a', subtext: '#475569' },
  default: { bg: '#0f172a', primary: '#7c3aed', accent: '#06b6d4', text: '#ffffff', subtext: '#cbd5e1' }
};

const getThemeForQuery = (query = '') => {
  const q = query.toLowerCase();
  if (q.includes('fit') || q.includes('gym') || q.includes('sport') || q.includes('workout')) return THEME_PALETTES.fitness;
  if (q.includes('game') || q.includes('stream') || q.includes('esport') || q.includes('twitch')) return THEME_PALETTES.gaming;
  if (q.includes('crypto') || q.includes('coin') || q.includes('trade') || q.includes('fintech') || q.includes('bank')) return THEME_PALETTES.crypto;
  if (q.includes('food') || q.includes('cafe') || q.includes('coffee') || q.includes('burger') || q.includes('pizza') || q.includes('restaurant')) return THEME_PALETTES.food;
  if (q.includes('wed') || q.includes('marriage') || q.includes('party') || q.includes('love') || q.includes('anniversary')) return THEME_PALETTES.wedding;
  if (q.includes('estate') || q.includes('house') || q.includes('property') || q.includes('home') || q.includes('villa')) return THEME_PALETTES.realestate;
  if (q.includes('travel') || q.includes('trip') || q.includes('vacation') || q.includes('tour') || q.includes('beach')) return THEME_PALETTES.travel;
  if (q.includes('fashion') || q.includes('beauty') || q.includes('style') || q.includes('look') || q.includes('salon')) return THEME_PALETTES.fashion;
  if (q.includes('health') || q.includes('doctor') || q.includes('medic') || q.includes('dent') || q.includes('clinic')) return THEME_PALETTES.medical;
  if (q.includes('music') || q.includes('song') || q.includes('dj') || q.includes('beat') || q.includes('audio') || q.includes('podcast')) return THEME_PALETTES.music;
  if (q.includes('edu') || q.includes('school') || q.includes('learn') || q.includes('course') || q.includes('cert')) return THEME_PALETTES.education;
  return THEME_PALETTES.default;
};

/**
 * Dynamically synthesizes an authentic Creativa multi-layer template for any query
 */
export function synthesizeCanvaTemplate(query = 'Modern Design', options = {}) {
  const cleanQ = query.trim() || 'Modern Design';
  const theme = getThemeForQuery(cleanQ);
  const qLower = cleanQ.toLowerCase();
  
  // Choose format & aspect ratio
  let width = options.width || 1080;
  let height = options.height || 1080;
  let category = options.category || 'Marketing';
  
  if (qLower.includes('youtube') || qLower.includes('thumbnail')) {
    width = 1280;
    height = 720;
    category = 'Video';
  } else if (qLower.includes('story') || qLower.includes('reel') || qLower.includes('tiktok') || qLower.includes('flyer')) {
    width = 1080;
    height = 1920;
    category = 'Social Media';
  } else if (qLower.includes('deck') || qLower.includes('present') || qLower.includes('slide')) {
    width = 1920;
    height = 1080;
    category = 'Presentation';
  } else if (qLower.includes('logo')) {
    width = 800;
    height = 800;
    category = 'Logo';
  } else if (qLower.includes('invitation') || qLower.includes('card')) {
    width = 1080;
    height = 1920;
    category = 'Invitation';
  } else if (qLower.includes('poster')) {
    width = 1080;
    height = 1350;
    category = 'Poster';
  }

  const capitalizedTitle = cleanQ.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const id = `dynamic-${cleanQ.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36).slice(-4)}`;

  const objects = [
    // Top border accent or background card
    {
      type: 'rect',
      left: width / 2,
      top: height / 2,
      width: width * 0.92,
      height: height * 0.92,
      fill: 'transparent',
      stroke: theme.primary,
      strokeWidth: 3,
      rx: 24,
      ry: 24,
      originX: 'center',
      originY: 'center',
      selectable: true
    },
    // Category pill / header badge
    {
      type: 'rect',
      left: width / 2,
      top: height * 0.22,
      width: Math.min(320, width * 0.4),
      height: 48,
      fill: theme.primary,
      rx: 24,
      ry: 24,
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: width / 2,
      top: height * 0.22,
      text: (options.badge || 'OFFICIAL CANVA TEMPLATE').toUpperCase(),
      fontSize: Math.max(12, Math.round(width * 0.016)),
      fontWeight: 'bold',
      fontFamily: 'Montserrat',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      width: Math.min(300, width * 0.38)
    },
    // Main Hero Headline
    {
      type: 'textbox',
      left: width / 2,
      top: height * 0.42,
      text: capitalizedTitle.toUpperCase(),
      fontSize: Math.max(24, Math.round(Math.min(68, width * 0.055) * (capitalizedTitle.length > 30 ? 0.75 : 1))),
      fontWeight: 'bold',
      fontFamily: 'Montserrat',
      fill: theme.text,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      width: width * 0.82
    },
    // Decorative underline / divider
    {
      type: 'rect',
      left: width / 2,
      top: height * 0.54,
      width: 140,
      height: 6,
      fill: theme.accent,
      rx: 3,
      ry: 3,
      originX: 'center',
      originY: 'center'
    },
    // Supporting Subtext
    {
      type: 'textbox',
      left: width / 2,
      top: height * 0.65,
      text: `Professional high-impact design for ${capitalizedTitle}. Fully customizable typography, colors & vectors.`,
      fontSize: Math.min(22, Math.max(14, Math.round(width * 0.022))),
      fontFamily: 'Inter',
      fill: theme.subtext,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      width: width * 0.72
    },
    // CTA Action Button
    {
      type: 'rect',
      left: width / 2,
      top: height * 0.78,
      width: Math.min(260, width * 0.35),
      height: 52,
      fill: theme.accent,
      rx: 16,
      ry: 16,
      originX: 'center',
      originY: 'center'
    },
    {
      type: 'textbox',
      left: width / 2,
      top: height * 0.78,
      text: 'EXPLORE NOW',
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Montserrat',
      fill: '#0f172a',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      width: 220
    }
  ];

  return {
    id,
    title: capitalizedTitle,
    category,
    width,
    height,
    backgroundColor: theme.bg,
    previewGradient: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.primary}55 100%)`,
    keywords: [cleanQ.toLowerCase(), category.toLowerCase(), 'canva', 'design', 'custom'],
    objects,
    isSynthesized: true
  };
}

/**
 * Searches Creativa Templates with 100% connectivity and live dynamic synthesis
 */
export function searchCanvaTemplates(query = '', category = 'All') {
  const cleanQ = query.trim().toLowerCase();
  
  // 1. Filter combined library (Auto-scraped official Creativa + curated premade)
  const matched = getAllTemplates().filter(tpl => {
    const matchesCat = category === 'All' || tpl.category.toLowerCase() === category.toLowerCase();
    if (!matchesCat) return false;
    if (!cleanQ) return true;

    const inTitle = tpl.title.toLowerCase().includes(cleanQ);
    const inCat = tpl.category.toLowerCase().includes(cleanQ);
    const inKeywords = (tpl.keywords || []).some(k => k.toLowerCase().includes(cleanQ));
    const inCreator = tpl.creator && (
      tpl.creator.name.toLowerCase().includes(cleanQ) ||
      tpl.creator.handle.toLowerCase().includes(cleanQ) ||
      (tpl.creator.specialty && tpl.creator.specialty.toLowerCase().includes(cleanQ))
    );
    return inTitle || inCat || inKeywords || inCreator;
  });

  // 2. If user searched a term, dynamically synthesize authentic matching templates
  if (cleanQ) {
    const dynamicItems = [
      synthesizeCanvaTemplate(query, { category: category !== 'All' ? category : 'Social Media' }),
      synthesizeCanvaTemplate(`${query} Masterclass`, { category: category !== 'All' ? category : 'Marketing', width: 1080, height: 1350 }),
      synthesizeCanvaTemplate(`${query} Showcase`, { category: category !== 'All' ? category : 'Presentation', width: 1920, height: 1080 })
    ];

    // Combine matched templates with dynamically synthesized templates
    return [...matched, ...dynamicItems];
  }

  return matched;
}

const CREATOR_IMAGE_COLLECTION = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
];

/**
 * Returns a deep, rich, multi-category portfolio for any creator,
 * guaranteeing dozens of high-quality editable designs matching their count.
 */
export function getExpandedCreatorPortfolio(creator, requestedLimit = 36) {
  if (!creator) return [];

  const allLibraryTemplates = getAllTemplates();
  const linked = allLibraryTemplates.filter(t => t.creator && t.creator.id === creator.id);
  const designMap = new Map();
  [...(creator.designs || []), ...linked].forEach(d => {
    if (d && d.id) designMap.set(d.id, d);
  });

  const categories = ['Social Media', 'Presentation', 'Marketing', 'Video', 'Business', 'Poster', 'Flyer', 'Logo'];
  const creatorPrefix = creator.name || 'Studio';
  const targetCount = Math.min(creator.templatesCount || 48, requestedLimit);

  const designConcepts = [
    'Aesthetic Editorial Showcase', 'Minimalist Clean Lookbook', 'Modern Brand Pitch Deck', 
    'Signature Moodboard Pack', 'High-Engagement Carousel Kit', 'Nordic Horizon Story', 
    'Urban Lifestyle Collection', 'Monochrome Typography Poster', 'Warm Earth Tones Series',
    'Creative Agency Identity', 'Visual Portfolio Reel', 'Velvet & Stone Campaign',
    'Midnight Neon Special', 'Minimalist Product Spotlight', 'Craft & Texture Story',
    'Bold Gradient Masterclass', 'Organic Wellness Brief', 'Architectural Lines Deck',
    'Studio Retrospective Vol. 2', 'Artisanal Label & Badge Pack', 'Elevated Social Graphics',
    'Clean Grid Layout Kit', 'Dynamic Video Intro Slide', 'Luxury Retail Promotion'
  ];

  let conceptIdx = 0;
  while (designMap.size < targetCount && conceptIdx < 60) {
    const concept = designConcepts[conceptIdx % designConcepts.length];
    const vol = Math.floor(conceptIdx / designConcepts.length) + 1;
    const volStr = vol > 1 ? ` Vol. ${vol}` : '';
    const id = `${creator.id}-synth-${conceptIdx + 1}`;
    const category = categories[conceptIdx % categories.length];
    const isPresentation = category === 'Presentation';
    const isStory = category === 'Video';
    const width = isPresentation ? 1920 : (isStory ? 1080 : 1080);
    const height = isPresentation ? 1080 : (isStory ? 1920 : 1080);
    const imgUrl = CREATOR_IMAGE_COLLECTION[conceptIdx % CREATOR_IMAGE_COLLECTION.length];

    const title = `${creatorPrefix} ${concept}${volStr}`;
    const bgScale = Math.max(width / 1200, height / 800);

    const synthDesign = {
      id,
      title,
      category,
      width,
      height,
      previewUrl: imgUrl,
      backgroundColor: '#0f172a',
      creator: {
        id: creator.id,
        name: creator.name,
        handle: creator.handle,
        avatar: creator.avatar,
        verified: creator.verified,
        specialty: creator.specialty
      },
      objects: [
        {
          type: 'image',
          src: imgUrl,
          left: width / 2,
          top: height / 2,
          originX: 'center',
          originY: 'center',
          scaleX: bgScale,
          scaleY: bgScale,
          selectable: true,
          crossOrigin: 'anonymous'
        },
        {
          type: 'rect',
          left: width / 2,
          top: height / 2,
          width: Math.round(width * 0.84),
          height: Math.round(height * 0.58),
          fill: 'rgba(15, 23, 42, 0.55)',
          rx: 24,
          ry: 24,
          originX: 'center',
          originY: 'center',
          selectable: true
        },
        {
          type: 'rect',
          left: width / 2,
          top: Math.round(height * 0.30),
          width: 220,
          height: 38,
          fill: '#7D2AE8',
          rx: 19,
          ry: 19,
          originX: 'center',
          originY: 'center',
          selectable: true
        },
        {
          type: 'textbox',
          text: category.toUpperCase(),
          left: width / 2,
          top: Math.round(height * 0.30),
          fontSize: 13,
          fontWeight: 'bold',
          fontFamily: 'Montserrat',
          fill: '#ffffff',
          textAlign: 'center',
          originX: 'center',
          originY: 'center',
          width: 200,
          selectable: true,
          editable: true
        },
        {
          type: 'textbox',
          text: title,
          left: width / 2,
          top: Math.round(height * 0.44),
          fontSize: isPresentation ? 44 : 32,
          fontWeight: 'bold',
          fontFamily: 'Montserrat',
          fill: '#ffffff',
          textAlign: 'center',
          originX: 'center',
          originY: 'center',
          width: Math.round(width * 0.78),
          shadow: { color: 'rgba(0,0,0,0.6)', blur: 8, offsetX: 0, offsetY: 2 },
          selectable: true,
          editable: true
        },
        {
          type: 'textbox',
          text: `Curated by ${creator.name} • Official Creativa Studio Partner`,
          left: width / 2,
          top: Math.round(height * 0.56),
          fontSize: isPresentation ? 20 : 16,
          fontFamily: 'Inter',
          fill: '#cbd5e1',
          textAlign: 'center',
          originX: 'center',
          originY: 'center',
          width: Math.round(width * 0.72),
          selectable: true,
          editable: true
        },
        {
          type: 'rect',
          left: width / 2,
          top: Math.round(height * 0.68),
          width: 240,
          height: 48,
          fill: '#f59e0b',
          rx: 24,
          ry: 24,
          originX: 'center',
          originY: 'center',
          selectable: true
        },
        {
          type: 'textbox',
          text: 'CUSTOMIZE TEMPLATE',
          left: width / 2,
          top: Math.round(height * 0.68),
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: 'Montserrat',
          fill: '#0f172a',
          textAlign: 'center',
          originX: 'center',
          originY: 'center',
          width: 220,
          selectable: true,
          editable: true
        }
      ]
    };

    designMap.set(id, synthDesign);
    conceptIdx++;
  }

  return Array.from(designMap.values());
}

export const searchTemplates = searchCanvaTemplates;
export const synthesizeTemplate = synthesizeCanvaTemplate;
export const searchCreativaTemplates = searchCanvaTemplates;
export const synthesizeCreativaTemplate = synthesizeCanvaTemplate;
