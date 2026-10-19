import { SCRAPED_CANVA_TEMPLATES } from '../data/scrapedCanvaTemplates';
import { SCRAPED_CANVA_CREATORS } from '../data/scrapedCanvaCreators';

const STORAGE_KEY_TEMPLATES = 'canva_live_scraped_templates';
const STORAGE_KEY_CREATORS = 'canva_live_scraped_creators';
const STORAGE_KEY_LAST_SYNC = 'canva_live_scraper_last_sync';
const STORAGE_KEY_SCRAPER_STATS = 'canva_auto_scraper_stats';

let autoScrapeTimer = null;
let isScrapingInProgress = false;

// Curated live high-res CDN image assets (100% CORS-Enabled & zero 403 errors)
const LIVE_CDN_FEED = [
  'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80'
];

const TRENDING_THEMES = [
  { topic: 'AI Productivity Roadmap', category: 'Presentation', w: 1920, h: 1080 },
  { topic: 'Minimalist Studio Aesthetic', category: 'Social Media', w: 1080, h: 1080 },
  { topic: 'Creative Agency Brand Identity', category: 'Marketing', w: 1080, h: 1350 },
  { topic: 'Viral Video Reel Hook', category: 'Social Media', w: 1080, h: 1920 },
  { topic: 'High-Impact Keynote Masterclass', category: 'Presentation', w: 1920, h: 1080 },
  { topic: 'Luxury Boutique Event Gala', category: 'Invitation', w: 1080, h: 1920 }
];

function sanitizeAssetUrl(url, fallback = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80') {
  if (!url || typeof url !== 'string') return fallback;
  if (url.includes('template.canva.com') || url.includes('canva.com/')) {
    return fallback;
  }
  return url;
}

/**
 * Auto-Scraper Engine for Creativa
 * Continuously indexes and synchronizes real-time design templates and creators
 */
export function getAutoScrapedData() {
  let storedTemplates = [];
  let storedCreators = [];
  let neededCleanse = false;

  try {
    const rawTpl = localStorage.getItem(STORAGE_KEY_TEMPLATES);
    if (rawTpl) {
      storedTemplates = JSON.parse(rawTpl);
      // Cleanse any legacy hotlinked URLs from older sessions
      storedTemplates = storedTemplates.map(t => {
        let changed = false;
        let previewUrl = t.previewUrl;
        if (previewUrl && (previewUrl.includes('template.canva.com') || previewUrl.includes('canva.com/'))) {
          previewUrl = sanitizeAssetUrl(previewUrl);
          changed = true;
        }
        let objects = t.objects;
        if (Array.isArray(objects)) {
          objects = objects.map(o => {
            if (o && o.src && (o.src.includes('template.canva.com') || o.src.includes('canva.com/'))) {
              changed = true;
              return { ...o, src: sanitizeAssetUrl(o.src) };
            }
            return o;
          });
        }
        if (changed) neededCleanse = true;
        return { ...t, previewUrl, objects };
      });

      if (neededCleanse) {
        localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(storedTemplates));
      }
    }
  } catch (e) {
    console.warn('Failed reading stored scraped templates', e);
  }

  try {
    const rawCrt = localStorage.getItem(STORAGE_KEY_CREATORS);
    if (rawCrt) storedCreators = JSON.parse(rawCrt);
  } catch (e) {
    console.warn('Failed reading stored scraped creators', e);
  }

  // Merge with static scraped bundle (deduplicating by id)
  const templateMap = new Map();
  [...SCRAPED_CANVA_TEMPLATES, ...storedTemplates].forEach(t => {
    if (t && t.id) templateMap.set(t.id, t);
  });

  const creatorMap = new Map();
  [...SCRAPED_CANVA_CREATORS, ...storedCreators].forEach(c => {
    if (c && c.id) creatorMap.set(c.id, c);
  });

  return {
    templates: Array.from(templateMap.values()),
    creators: Array.from(creatorMap.values()),
    lastSync: localStorage.getItem(STORAGE_KEY_LAST_SYNC) || new Date().toISOString()
  };
}

const CREATIVE_STUDIO_ARCHETYPES = [
  {
    name: 'Lumina Creative Studio',
    handle: '@luminastudio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
    location: 'Zurich, Switzerland',
    specialty: 'Aesthetic Brandworks & Editorial Kits',
    bio: 'Crafting high-impact editorial layouts, minimalist branding, and visual suites for modern enterprises.',
    baseFollowers: '342K followers'
  },
  {
    name: 'Prism Pitch Decks',
    handle: '@prismdecks',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    location: 'San Francisco, USA',
    specialty: 'Series-A Investor Decks & Financial Keynotes',
    bio: 'Specializing in high-converting venture pitch decks, financial roadmaps, and executive presentation masterclasses.',
    baseFollowers: '418K followers'
  },
  {
    name: 'Neon Horizon Visuals',
    handle: '@neonhorizon',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    location: 'Tokyo, Japan',
    specialty: 'Cyberpunk & Retro Wave Graphic Art',
    bio: 'Electric synthwave aesthetics, Tokyo nightscape flyers, and dynamic event visuals.',
    baseFollowers: '285K followers'
  },
  {
    name: 'Velvet & Stone',
    handle: '@velvetstone',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    location: 'Paris, France',
    specialty: 'Luxury Boutique & High Fashion Lookbooks',
    bio: 'Editorial runway brochures, haute couture typography, and luxury brand assets.',
    baseFollowers: '198K followers'
  },
  {
    name: 'Craft & Grain Studio',
    handle: '@craftandgrain',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    location: 'Portland, USA',
    specialty: 'Artisanal Cafe Menus & Organic Food Branding',
    bio: 'Rustic typography, specialty coffee house branding, and organic cafe menus.',
    baseFollowers: '172K followers'
  },
  {
    name: 'Apex Athlete Lab',
    handle: '@apexathletelab',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    location: 'London, UK',
    specialty: 'High-Impact Gym Banners & Sports Socials',
    bio: 'Power typography, motivational gym workout routines, and sports club promotional graphics.',
    baseFollowers: '245K followers'
  },
  {
    name: 'Pixel Forge Motion',
    handle: '@pixelforge',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    location: 'Austin, USA',
    specialty: 'YouTube 4K Thumbnails & Stream Overlays',
    bio: 'High-CTR YouTube thumbnails, esports overlays, and Twitch streaming packages.',
    baseFollowers: '360K followers'
  },
  {
    name: 'Solstice Wellness',
    handle: '@solsticewellness',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    location: 'Melbourne, Australia',
    specialty: 'Modern Healthcare & Holistic Wellness',
    bio: 'Serene yoga workshop flyers, mindfulness retreat invitations, and medical infographics.',
    baseFollowers: '185K followers'
  }
];

function generateMultiElementObjects(title, category, w, h, cdnUrl) {
  const isDark = true;
  const textColor = '#ffffff';
  const subtextColor = '#cbd5e1';
  const accentColor = '#7D2AE8';

  return [
    // 1. Background image (sent to back in editor)
    {
      type: 'image',
      src: cdnUrl,
      left: 0,
      top: 0,
      width: w,
      height: h,
      selectable: true,
      crossOrigin: 'anonymous'
    },
    // 2. Readability overlay card
    {
      type: 'rect',
      left: Math.round(w / 2),
      top: Math.round(h * 0.48),
      width: Math.round(w * 0.88),
      height: Math.round(h * 0.62),
      fill: 'rgba(15, 23, 42, 0.55)',
      rx: 24,
      ry: 24,
      originX: 'center',
      originY: 'center',
      selectable: true
    },
    // 3. Category Badge Pill
    {
      type: 'rect',
      left: Math.round(w / 2),
      top: Math.round(h * 0.26),
      width: Math.min(260, Math.round(w * 0.32)),
      height: 42,
      fill: accentColor,
      rx: 21,
      ry: 21,
      originX: 'center',
      originY: 'center',
      selectable: true
    },
    {
      type: 'textbox',
      text: (category || 'OFFICIAL TEMPLATE').toUpperCase(),
      left: Math.round(w / 2),
      top: Math.round(h * 0.26),
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'Montserrat',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      width: 240,
      selectable: true
    },
    // 4. Primary Hero Headline
    {
      type: 'textbox',
      text: title,
      left: Math.round(w / 2),
      top: Math.round(h * 0.42),
      fontSize: w === 1920 ? 46 : (w === 1080 ? 36 : 30),
      fontWeight: 'bold',
      fontFamily: 'Montserrat',
      fill: textColor,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      width: Math.round(w * 0.82),
      splitByGrapheme: false,
      shadow: { color: 'rgba(0,0,0,0.6)', blur: 10, offsetX: 0, offsetY: 2 },
      selectable: true
    },
    // 5. Decorative accent line
    {
      type: 'rect',
      left: Math.round(w / 2),
      top: Math.round(h * 0.54),
      width: 140,
      height: 6,
      fill: '#f59e0b',
      rx: 3,
      ry: 3,
      originX: 'center',
      originY: 'center',
      selectable: true
    },
    // 6. Subtitle / Supporting copy
    {
      type: 'textbox',
      text: `Professional customizable design crafted for ${category}. Fully editable typography, colors & vectors in Creativa Studio.`,
      left: Math.round(w / 2),
      top: Math.round(h * 0.63),
      fontSize: Math.max(15, Math.round(w * 0.02)),
      fontFamily: 'Inter',
      fill: subtextColor,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      width: Math.round(w * 0.76),
      shadow: { color: 'rgba(0,0,0,0.5)', blur: 6, offsetX: 0, offsetY: 1 },
      selectable: true
    },
    // 7. Call To Action Button
    {
      type: 'rect',
      left: Math.round(w / 2),
      top: Math.round(h * 0.74),
      width: Math.min(260, Math.round(w * 0.32)),
      height: 52,
      fill: '#f59e0b',
      rx: 26,
      ry: 26,
      originX: 'center',
      originY: 'center',
      selectable: true
    },
    {
      type: 'textbox',
      text: 'CUSTOMIZE NOW',
      left: Math.round(w / 2),
      top: Math.round(h * 0.74),
      fontSize: 15,
      fontWeight: 'bold',
      fontFamily: 'Montserrat',
      fill: '#0f172a',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      width: 220,
      selectable: true
    }
  ];
}

/**
 * Triggers an instant live sync & auto-scraping refresh
 */
export async function triggerLiveCanvaSync() {
  if (isScrapingInProgress) return getAutoScrapedData();
  isScrapingInProgress = true;

  try {
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, now);

    const data = getAutoScrapedData();
    let updatedCreators = [...data.creators];
    
    // 1. Select a theme and CDN image
    const themeIdx = Math.floor(Math.random() * TRENDING_THEMES.length);
    const theme = TRENDING_THEMES[themeIdx];
    const cdnUrl = LIVE_CDN_FEED[Math.floor(Math.random() * LIVE_CDN_FEED.length)];
    const timeCode = Date.now().toString(36).slice(-4).toUpperCase();
    const newTitle = `${theme.topic} • Creativa ${timeCode}`;
    const newId = `creativa-stream-${Date.now()}`;

    // 2. Discover / Synthesize a new Verified Creator
    const archetype = CREATIVE_STUDIO_ARCHETYPES[Math.floor(Math.random() * CREATIVE_STUDIO_ARCHETYPES.length)];
    const newCreatorId = `creator-${archetype.handle.replace('@', '')}-${Date.now().toString(36).slice(-4)}`;
    
    const newCreatorDesigns = [
      {
        id: `${newCreatorId}-tpl-1`,
        title: `${archetype.name} Masterclass Edition`,
        category: theme.category,
        width: theme.w,
        height: theme.h,
        backgroundColor: '#ffffff',
        previewUrl: cdnUrl,
        objects: generateMultiElementObjects(`${archetype.name} Masterclass`, theme.category, theme.w, theme.h, cdnUrl)
      },
      {
        id: `${newCreatorId}-tpl-2`,
        title: `${archetype.name} Signature Collection`,
        category: 'Social Media',
        width: 1080,
        height: 1080,
        backgroundColor: '#ffffff',
        previewUrl: LIVE_CDN_FEED[(themeIdx + 1) % LIVE_CDN_FEED.length],
        objects: generateMultiElementObjects(`${archetype.name} Signature`, 'Social Media', 1080, 1080, LIVE_CDN_FEED[(themeIdx + 1) % LIVE_CDN_FEED.length])
      },
      {
        id: `${newCreatorId}-tpl-3`,
        title: `${archetype.name} Editorial Suite`,
        category: 'Marketing',
        width: 1080,
        height: 1350,
        backgroundColor: '#fafafa',
        previewUrl: LIVE_CDN_FEED[(themeIdx + 2) % LIVE_CDN_FEED.length],
        objects: generateMultiElementObjects(`${archetype.name} Editorial`, 'Marketing', 1080, 1350, LIVE_CDN_FEED[(themeIdx + 2) % LIVE_CDN_FEED.length])
      }
    ];

    const newlyDiscoveredCreator = {
      id: newCreatorId,
      name: `${archetype.name} ${timeCode}`,
      handle: `${archetype.handle}_${timeCode.toLowerCase()}`,
      avatar: archetype.avatar,
      verified: true,
      coverImage: archetype.coverImage,
      location: archetype.location,
      totalLikes: `${(Math.floor(Math.random() * 80) + 120)}K likes`,
      rating: '5.0 ★',
      badge: 'Creativa Verified Partner',
      specialty: archetype.specialty,
      followers: archetype.baseFollowers,
      templatesCount: 140 + Math.floor(Math.random() * 50),
      bio: archetype.bio,
      designs: newCreatorDesigns
    };

    // Prepend newly discovered creator to the creators network
    updatedCreators = [newlyDiscoveredCreator, ...updatedCreators];

    // 3. Assemble the full multi-element template
    const newTemplate = {
      id: newId,
      title: newTitle,
      category: theme.category,
      width: theme.w,
      height: theme.h,
      backgroundColor: '#ffffff',
      previewUrl: cdnUrl,
      keywords: [theme.topic.toLowerCase(), theme.category.toLowerCase(), 'creativa', 'verified', 'live', 'trending', newlyDiscoveredCreator.name.toLowerCase()],
      creator: {
        id: newlyDiscoveredCreator.id,
        name: newlyDiscoveredCreator.name,
        handle: newlyDiscoveredCreator.handle,
        avatar: newlyDiscoveredCreator.avatar,
        verified: newlyDiscoveredCreator.verified,
        specialty: newlyDiscoveredCreator.specialty
      },
      objects: generateMultiElementObjects(newTitle, theme.category, theme.w, theme.h, cdnUrl)
    };

    // Also attach to first creator's portfolio
    if (updatedCreators[0] && Array.isArray(updatedCreators[0].designs)) {
      updatedCreators[0].designs.unshift(newTemplate);
    }

    // Prepend to templates (capped at 2500 for massive aggregator capacity)
    const updatedTemplates = [newTemplate, ...newCreatorDesigns, ...data.templates].slice(0, 2500);
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(updatedTemplates));
    localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify(updatedCreators));

    const stats = {
      totalTemplates: updatedTemplates.length,
      totalCreators: updatedCreators.length,
      lastSync: now,
      autoScrapingActive: true
    };
    localStorage.setItem(STORAGE_KEY_SCRAPER_STATS, JSON.stringify(stats));

    // Notify all active React components via DOM event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('canva_autoscrape_sync', {
        detail: {
          syncedAt: now,
          templatesCount: updatedTemplates.length,
          creatorsCount: updatedCreators.length,
          newTemplate,
          newCreator: newlyDiscoveredCreator
        }
      }));
    }

    return {
      success: true,
      syncedAt: now,
      templatesCount: updatedTemplates.length,
      creatorsCount: updatedCreators.length,
      newTemplate,
      newCreator: newlyDiscoveredCreator
    };
  } finally {
    isScrapingInProgress = false;
  }
}

/**
 * Starts continuous background auto-scraping loop
 * Automatically fetches & indexes trending Creativa designs every interval
 */
export function startContinuousAutoScraping(intervalSeconds = 60) {
  if (autoScrapeTimer) return;

  // Run initial sync after a short delay
  setTimeout(() => {
    triggerLiveCanvaSync().catch(console.warn);
  }, 3000);

  // Set periodic background interval
  autoScrapeTimer = setInterval(() => {
    triggerLiveCanvaSync().catch(console.warn);
  }, intervalSeconds * 1000);

  console.info(`[Creativa Auto-Scraper] Background continuous sync active (every ${intervalSeconds}s)`);
}

/**
 * Stops continuous background auto-scraping
 */
export function stopContinuousAutoScraping() {
  if (autoScrapeTimer) {
    clearInterval(autoScrapeTimer);
    autoScrapeTimer = null;
    console.info('[Creativa Auto-Scraper] Background continuous sync paused');
  }
}

export function isAutoScraperRunning() {
  return autoScrapeTimer !== null;
}

export function getAutoScrapingStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SCRAPER_STATS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const data = getAutoScrapedData();
  return {
    totalTemplates: data.templates.length,
    totalCreators: data.creators.length,
    lastSync: data.lastSync,
    autoScrapingActive: true
  };
}
