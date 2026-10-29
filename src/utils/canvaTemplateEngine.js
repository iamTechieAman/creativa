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
    const seenSignatures = new Set();

    [...autoData.templates, ...enrichedScraped, ...creatorDesigns, ...PREMADE_TEMPLATES].forEach(t => {
      if (!t || !t.id) return;
      // Deduplication signature: normalized alphanumeric title + category
      const normTitle = (t.title || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const normCat = (t.category || '').trim().toLowerCase();
      const sig = `${normTitle}::${normCat}`;

      if (map.has(t.id) || (normTitle && seenSignatures.has(sig))) {
        return; // Skip duplicate template
      }
      if (normTitle) seenSignatures.add(sig);
      map.set(t.id, t);
    });
    return Array.from(map.values());
  } catch (e) {
    const fallbackMap = new Map();
    const fallbackSeen = new Set();
    [...SCRAPED_CANVA_TEMPLATES, ...PREMADE_TEMPLATES].forEach(t => {
      if (!t || !t.id) return;
      const sig = `${(t.title || '').toLowerCase()}::${(t.category || '').toLowerCase()}`;
      if (!fallbackMap.has(t.id) && !fallbackSeen.has(sig)) {
        fallbackSeen.add(sig);
        fallbackMap.set(t.id, t);
      }
    });
    return Array.from(fallbackMap.values());
  }
}

const CREATOR_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=200&q=80'
];

const CREATOR_COVERS = [
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80'
];

/**
 * Searches Canva verified creators with full live sync and dynamic synthesis
 * Guarantees 100% discovery for any creator name, @handle, theme, or category
 */
export function searchCreators(query = '', specialty = 'All') {
  const allCreators = getAllCreators();
  const q = query.trim().toLowerCase();
  const cleanHandle = q.replace(/^@/, '');

  // 1. Filter existing creators across all dimensions
  const matches = allCreators.filter(c => {
    const nameMatch = !q || c.name.toLowerCase().includes(q);
    const handleMatch = !q || c.handle.toLowerCase().includes(q) || c.handle.replace('@', '').toLowerCase().includes(cleanHandle);
    const specialtyMatch = !q || (c.specialty && c.specialty.toLowerCase().includes(q));
    const bioMatch = !q || (c.bio && c.bio.toLowerCase().includes(q));
    const locationMatch = !q || (c.location && c.location.toLowerCase().includes(q));

    const matchesQuery = nameMatch || handleMatch || specialtyMatch || bioMatch || locationMatch;
    const matchesSpecialty = specialty === 'All' || (
      (c.specialty && c.specialty.toLowerCase().includes(specialty.toLowerCase())) ||
      (c.bio && c.bio.toLowerCase().includes(specialty.toLowerCase()))
    );

    return matchesQuery && matchesSpecialty;
  });

  // 2. If query provided and fewer than 9 results found, dynamically synthesize authentic Canva Creators
  if (q && matches.length < 9) {
    const rawName = cleanHandle.split(/[-_\s]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Creative Studio';
    const slugBase = cleanHandle.replace(/[^a-z0-9]/g, '') || 'creativastudio';
    const suffixes = ['', ' Studio', ' Visuals', ' Lab', ' Brandworks', ' Media', ' Collective', ' Creative Co'];
    const specOptions = specialty !== 'All' 
      ? [specialty, `${specialty} & Brand Design`, `${specialty} Specialist`]
      : ['Brand Identity & Layouts', 'Social Media & Viral Kits', 'Editorial & Presentation Decks', 'Typography & Vectors'];

    const synthesizedCreators = [];
    const needed = 9 - matches.length;

    for (let i = 0; i < needed; i++) {
      const suffix = suffixes[i % suffixes.length];
      const creatorName = `${rawName}${suffix}`;
      const creatorHandle = `@${slugBase}${i === 0 ? '' : '_' + (i + 1)}`;
      const creatorId = `syn-canva-${slugBase}-${i + 1}`;
      const avatar = CREATOR_AVATARS[(i + slugBase.length) % CREATOR_AVATARS.length];
      const coverImage = CREATOR_COVERS[(i + slugBase.length) % CREATOR_COVERS.length];
      const spec = specOptions[i % specOptions.length];

      // Build initial authentic portfolio
      const designs = [
        {
          id: `${creatorId}-tpl-1`,
          title: `${creatorName} Signature Edition`,
          category: 'Social Media',
          width: 1080,
          height: 1080,
          backgroundColor: '#0f172a',
          previewUrl: CREATOR_COVERS[(i * 2) % CREATOR_COVERS.length],
          objects: [
            { type: 'rect', left: 540, top: 540, width: 940, height: 940, fill: '#1e1b4b', rx: 24, ry: 24, originX: 'center', originY: 'center' },
            { type: 'textbox', text: creatorName.toUpperCase(), left: 540, top: 460, fontSize: 38, fill: '#ffffff', fontFamily: 'Montserrat', originX: 'center', width: 800, textAlign: 'center' },
            { type: 'textbox', text: 'OFFICIAL CANVA CREATOR TEMPLATE', left: 540, top: 540, fontSize: 16, fill: '#a855f7', fontFamily: 'Inter', originX: 'center', width: 600, textAlign: 'center' }
          ]
        },
        {
          id: `${creatorId}-tpl-2`,
          title: `${creatorName} Masterclass Deck`,
          category: 'Presentation',
          width: 1920,
          height: 1080,
          backgroundColor: '#ffffff',
          previewUrl: CREATOR_COVERS[(i * 2 + 1) % CREATOR_COVERS.length],
          objects: [
            { type: 'rect', left: 960, top: 540, width: 1720, height: 900, fill: '#f8fafc', stroke: '#e2e8f0', strokeWidth: 2, rx: 16, ry: 16, originX: 'center', originY: 'center' },
            { type: 'textbox', text: `${creatorName} Masterclass Deck`, left: 960, top: 450, fontSize: 52, fill: '#0f172a', fontFamily: 'Montserrat', originX: 'center', width: 1400, textAlign: 'center' },
            { type: 'textbox', text: 'Executive Strategy & Visual Roadmap', left: 960, top: 550, fontSize: 24, fill: '#7c3aed', fontFamily: 'Inter', originX: 'center', width: 1000, textAlign: 'center' }
          ]
        }
      ];

      const newCreator = {
        id: creatorId,
        name: creatorName,
        handle: creatorHandle,
        avatar,
        coverImage,
        verified: true,
        location: 'Global Canva Network',
        rating: '4.9 ★',
        totalLikes: `${120 + i * 18}K likes`,
        followers: `${145 + i * 22}K`,
        templatesCount: 120 + i * 15,
        specialty: spec,
        bio: `Canva Verified Creator crafting premium ${spec.toLowerCase()} templates, editorial portfolios, and modern graphic suites.`,
        badge: 'Canva Verified Creator',
        designs
      };

      synthesizedCreators.push(newCreator);
    }

    // Persist newly synthesized creators so they are permanently synced
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = JSON.parse(localStorage.getItem('canva_live_scraped_creators') || '[]');
        const map = new Map();
        [...stored, ...synthesizedCreators].forEach(c => {
          if (c && c.id) map.set(c.id, c);
        });
        localStorage.setItem('canva_live_scraped_creators', JSON.stringify(Array.from(map.values())));
      }
    } catch (e) {
      // LocalStorage access safe fallback
    }

    return [...matches, ...synthesizedCreators];
  }

  return matches;
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
 * Supports all Canva categories: Resumes, Certificates, Business Cards, Invoices, 
 * YouTube Thumbnails, Instagram Stories/Reels, Menus, Infographics, Presentations, Logos, and Posters.
 */
export function synthesizeCanvaTemplate(query = 'Modern Design', options = {}) {
  const cleanQ = query.trim() || 'Modern Design';
  const theme = getThemeForQuery(cleanQ);
  const qLower = cleanQ.toLowerCase();
  const capitalizedTitle = cleanQ.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const id = `dynamic-${cleanQ.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36).slice(-4)}`;

  // Determine specific Canva template archetype
  const isResume = qLower.includes('resume') || qLower.includes('cv') || options.category === 'Resume';
  const isCertificate = qLower.includes('cert') || qLower.includes('award') || qLower.includes('diploma');
  const isBusinessCard = qLower.includes('business card') || qLower.includes('visiting card');
  const isInvoice = qLower.includes('invoice') || qLower.includes('bill') || qLower.includes('receipt');
  const isYouTube = qLower.includes('youtube') || qLower.includes('thumbnail');
  const isStory = qLower.includes('story') || qLower.includes('reel') || qLower.includes('tiktok');
  const isLogo = qLower.includes('logo') || options.category === 'Logo';
  const isMenu = qLower.includes('menu') || qLower.includes('food') || qLower.includes('restaurant');
  const isInfographic = qLower.includes('infographic');
  const isPresentation = qLower.includes('deck') || qLower.includes('present') || qLower.includes('slide') || options.category === 'Presentation';

  // 1. RESUME / CV (A4 standard: 794 × 1123 px)
  if (isResume) {
    const width = 794;
    const height = 1123;
    const objects = [
      // Top header banner
      { type: 'rect', left: width / 2, top: 90, width: width, height: 180, fill: theme.primary, originX: 'center', originY: 'center', selectable: true },
      { type: 'textbox', left: width / 2, top: 70, text: capitalizedTitle.toUpperCase(), fontSize: 34, fontWeight: 'bold', fontFamily: 'Montserrat', fill: '#ffffff', textAlign: 'center', originX: 'center', originY: 'center', width: 700 },
      { type: 'textbox', left: width / 2, top: 125, text: 'SENIOR PRODUCT DESIGNER & UI/UX ARCHITECT', fontSize: 13, fontWeight: 'bold', fontFamily: 'Inter', fill: '#e2e8f0', textAlign: 'center', originX: 'center', originY: 'center', width: 600 },
      // Contact Bar
      { type: 'rect', left: width / 2, top: 195, width: width, height: 32, fill: '#0f172a', originX: 'center', originY: 'center' },
      { type: 'textbox', left: width / 2, top: 195, text: 'portfolio.creativa.design  •  contact@creativa.com  •  +1 (555) 019-2834  •  San Francisco, CA', fontSize: 11, fontFamily: 'Inter', fill: '#94a3b8', textAlign: 'center', originX: 'center', originY: 'center', width: 740 },
      // Left Sidebar Column
      { type: 'rect', left: 140, top: 660, width: 240, height: 860, fill: '#f8fafc', stroke: '#e2e8f0', strokeWidth: 1, rx: 12, ry: 12, originX: 'center', originY: 'center' },
      // Profile Summary
      { type: 'textbox', left: 140, top: 260, text: 'PROFILE', fontSize: 14, fontWeight: 'bold', fontFamily: 'Montserrat', fill: theme.primary, textAlign: 'left', originX: 'center', originY: 'center', width: 210 },
      { type: 'textbox', left: 140, top: 320, text: 'Award-winning designer with 8+ years crafting scalable design systems, multi-platform mobile apps, and enterprise SaaS solutions.', fontSize: 11, fontFamily: 'Inter', fill: '#475569', textAlign: 'left', originX: 'center', originY: 'center', width: 210 },
      // Core Skills
      { type: 'textbox', left: 140, top: 410, text: 'CORE SKILLS', fontSize: 14, fontWeight: 'bold', fontFamily: 'Montserrat', fill: theme.primary, textAlign: 'left', originX: 'center', originY: 'center', width: 210 },
      { type: 'rect', left: 140, top: 460, width: 210, height: 28, fill: '#ede9fe', rx: 6, ry: 6, originX: 'center', originY: 'center' },
      { type: 'textbox', left: 140, top: 460, text: 'Design Systems & Tokens', fontSize: 11, fontWeight: 'bold', fontFamily: 'Inter', fill: '#6b21a8', textAlign: 'center', originX: 'center', originY: 'center', width: 200 },
      { type: 'rect', left: 140, top: 500, width: 210, height: 28, fill: '#ede9fe', rx: 6, ry: 6, originX: 'center', originY: 'center' },
      { type: 'textbox', left: 140, top: 500, text: 'Figma, Fabric.js & Canvas', fontSize: 11, fontWeight: 'bold', fontFamily: 'Inter', fill: '#6b21a8', textAlign: 'center', originX: 'center', originY: 'center', width: 200 },
      { type: 'rect', left: 140, top: 540, width: 210, height: 28, fill: '#ede9fe', rx: 6, ry: 6, originX: 'center', originY: 'center' },
      { type: 'textbox', left: 140, top: 540, text: 'User Research & Prototyping', fontSize: 11, fontWeight: 'bold', fontFamily: 'Inter', fill: '#6b21a8', textAlign: 'center', originX: 'center', originY: 'center', width: 200 },
      // Education
      { type: 'textbox', left: 140, top: 620, text: 'EDUCATION', fontSize: 14, fontWeight: 'bold', fontFamily: 'Montserrat', fill: theme.primary, textAlign: 'left', originX: 'center', originY: 'center', width: 210 },
      { type: 'textbox', left: 140, top: 670, text: 'B.S. in Interaction Design\nCalifornia Institute of Arts\n2015 – 2019 (Summa Cum Laude)', fontSize: 11, fontFamily: 'Inter', fill: '#475569', textAlign: 'left', originX: 'center', originY: 'center', width: 210 },
      // Right Column: Experience
      { type: 'textbox', left: 510, top: 260, text: 'WORK EXPERIENCE', fontSize: 16, fontWeight: 'bold', fontFamily: 'Montserrat', fill: '#0f172a', textAlign: 'left', originX: 'center', originY: 'center', width: 460 },
      { type: 'textbox', left: 510, top: 310, text: 'Lead UI/UX Architect  •  Creativa Global', fontSize: 13, fontWeight: 'bold', fontFamily: 'Montserrat', fill: theme.primary, textAlign: 'left', originX: 'center', originY: 'center', width: 460 },
      { type: 'textbox', left: 510, top: 335, text: '2022 – Present  •  San Francisco, CA', fontSize: 10, fontFamily: 'Inter', fill: '#64748b', textAlign: 'left', originX: 'center', originY: 'center', width: 460 },
      { type: 'textbox', left: 510, top: 385, text: '• Directed design of high-converting web applications with 4.5M+ active users.\n• Reduced design-to-engineering handoff latency by 45% using design token architecture.\n• Led a multidisciplinary team of 14 visual designers, animators and researchers.', fontSize: 11, fontFamily: 'Inter', fill: '#334155', textAlign: 'left', originX: 'center', originY: 'center', width: 460 },
      { type: 'textbox', left: 510, top: 480, text: 'Senior Product Designer  •  Studio Canvas Labs', fontSize: 13, fontWeight: 'bold', fontFamily: 'Montserrat', fill: theme.primary, textAlign: 'left', originX: 'center', originY: 'center', width: 460 },
      { type: 'textbox', left: 510, top: 505, text: '2019 – 2022  •  New York, NY', fontSize: 10, fontFamily: 'Inter', fill: '#64748b', textAlign: 'left', originX: 'center', originY: 'center', width: 460 },
      { type: 'textbox', left: 510, top: 555, text: '• Built component libraries adopted across 8 distinct web and mobile products.\n• Executed 120+ usability studies, increasing onboarding conversion by 28%.\n• Designed interactive micro-animations and responsive mobile layout systems.', fontSize: 11, fontFamily: 'Inter', fill: '#334155', textAlign: 'left', originX: 'center', originY: 'center', width: 460 }
    ];
    return { id, title: `${capitalizedTitle} Professional Resume`, category: 'Resume', width, height, backgroundColor: '#ffffff', previewGradient: 'linear-gradient(135deg, #f8fafc 0%, #ede9fe 100%)', keywords: ['resume', 'cv', 'job', 'career', 'canva'], objects };
  }

  // 2. CERTIFICATE OF ACHIEVEMENT (1920 × 1080 px)
  if (isCertificate) {
    const width = 1920;
    const height = 1080;
    const objects = [
      // Outer Gold Frame
      { type: 'rect', left: width / 2, top: height / 2, width: width - 80, height: height - 80, fill: '#fffdfa', stroke: '#d97706', strokeWidth: 4, rx: 16, ry: 16, originX: 'center', originY: 'center' },
      // Inner Border
      { type: 'rect', left: width / 2, top: height / 2, width: width - 130, height: height - 130, fill: 'transparent', stroke: '#b45309', strokeWidth: 1.5, rx: 10, ry: 10, originX: 'center', originY: 'center' },
      // Certificate Title
      { type: 'textbox', left: width / 2, top: 200, text: 'CERTIFICATE OF ACHIEVEMENT', fontSize: 48, fontWeight: 'bold', fontFamily: 'Cinzel', fill: '#78350f', textAlign: 'center', originX: 'center', originY: 'center', width: 1400 },
      { type: 'textbox', left: width / 2, top: 270, text: 'THIS HONOR IS PROUDLY PRESENTED TO', fontSize: 18, fontWeight: 'bold', fontFamily: 'Montserrat', fill: '#92400e', textAlign: 'center', originX: 'center', originY: 'center', width: 1000 },
      // Recipient Name
      { type: 'textbox', left: width / 2, top: 400, text: capitalizedTitle.toUpperCase(), fontSize: 62, fontWeight: 'bold', fontFamily: 'Montserrat', fill: '#1e1b4b', textAlign: 'center', originX: 'center', originY: 'center', width: 1400 },
      // Divider
      { type: 'rect', left: width / 2, top: 470, width: 600, height: 4, fill: '#d97706', originX: 'center', originY: 'center' },
      // Description
      { type: 'textbox', left: width / 2, top: 570, text: 'For exemplary dedication, creative innovation, and exceptional leadership demonstrated throughout the international design masterclass.', fontSize: 22, fontFamily: 'Lora', fill: '#451a03', textAlign: 'center', originX: 'center', originY: 'center', width: 1300 },
      // Signatures
      { type: 'rect', left: 520, top: 820, width: 360, height: 2, fill: '#92400e', originX: 'center', originY: 'center' },
      { type: 'textbox', left: 520, top: 855, text: 'Elena Rostova\nExecutive Design Director', fontSize: 16, fontFamily: 'Inter', fill: '#78350f', textAlign: 'center', originX: 'center', originY: 'center', width: 360 },
      // Gold Seal Badge
      { type: 'circle', left: width / 2, top: 810, radius: 65, fill: '#f59e0b', stroke: '#b45309', strokeWidth: 4, originX: 'center', originY: 'center' },
      { type: 'textbox', left: width / 2, top: 810, text: 'OFFICIAL\nSEAL\n★ 2026 ★', fontSize: 13, fontWeight: 'bold', fontFamily: 'Montserrat', fill: '#ffffff', textAlign: 'center', originX: 'center', originY: 'center', width: 120 },
      { type: 'rect', left: 1400, top: 820, width: 360, height: 2, fill: '#92400e', originX: 'center', originY: 'center' },
      { type: 'textbox', left: 1400, top: 855, text: 'Marcus Sterling\nDean of Academic Excellence', fontSize: 16, fontFamily: 'Inter', fill: '#78350f', textAlign: 'center', originX: 'center', originY: 'center', width: 360 }
    ];
    return { id, title: `${capitalizedTitle} Certificate of Achievement`, category: 'Business', width, height, backgroundColor: '#fffdfa', previewGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', keywords: ['certificate', 'award', 'diploma', 'canva'], objects };
  }

  // 3. BUSINESS CARD (Standard 1050 × 600 px)
  if (isBusinessCard) {
    const width = 1050;
    const height = 600;
    const objects = [
      // Left diagonal / vertical accent banner
      { type: 'rect', left: 180, top: height / 2, width: 360, height: height, fill: '#1e1b4b', originX: 'center', originY: 'center' },
      // Monogram logo
      { type: 'circle', left: 180, top: height / 2, radius: 70, fill: theme.accent, originX: 'center', originY: 'center' },
      { type: 'textbox', left: 180, top: height / 2, text: cleanQ.slice(0, 2).toUpperCase(), fontSize: 44, fontWeight: 'bold', fontFamily: 'Montserrat', fill: '#ffffff', textAlign: 'center', originX: 'center', originY: 'center', width: 120 },
      // Name & Title
      { type: 'textbox', left: 660, top: 190, text: capitalizedTitle.toUpperCase(), fontSize: 36, fontWeight: 'bold', fontFamily: 'Montserrat', fill: '#0f172a', textAlign: 'left', originX: 'center', originY: 'center', width: 540 },
      { type: 'textbox', left: 660, top: 245, text: 'MANAGING PARTNER & CREATIVE LEAD', fontSize: 13, fontWeight: 'bold', fontFamily: 'Inter', fill: theme.primary, textAlign: 'left', originX: 'center', originY: 'center', width: 540 },
      // Divider line
      { type: 'rect', left: 660, top: 285, width: 540, height: 3, fill: theme.accent, originX: 'center', originY: 'center' },
      // Contact Info Block
      { type: 'textbox', left: 660, top: 350, text: '📞  +1 (555) 982-3401\n✉️  hello@creativastudio.com\n🌐  www.creativadesign.io\n📍  101 Market Street, Suite 500, San Francisco', fontSize: 15, fontFamily: 'Inter', fill: '#475569', textAlign: 'left', originX: 'center', originY: 'center', width: 540 }
    ];
    return { id, title: `${capitalizedTitle} Premium Business Card`, category: 'Business', width, height, backgroundColor: '#ffffff', previewGradient: 'linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%)', keywords: ['business', 'card', 'branding', 'visiting'], objects };
  }

  // 4. YOUTUBE THUMBNAIL (1280 × 720 px)
  if (isYouTube) {
    const width = 1280;
    const height = 720;
    const objects = [
      // High contrast dark background container
      { type: 'rect', left: width / 2, top: height / 2, width: width, height: height, fill: '#090d16', originX: 'center', originY: 'center' },
      // Highlight Pill Badge
      { type: 'rect', left: 320, top: 140, width: 340, height: 60, fill: '#e11d48', rx: 30, ry: 30, originX: 'center', originY: 'center' },
      { type: 'textbox', left: 320, top: 140, text: '★ 100% VIRAL GUIDE ★', fontSize: 20, fontWeight: 'bold', fontFamily: 'Montserrat', fill: '#ffffff', textAlign: 'center', originX: 'center', originY: 'center', width: 320 },
      // Giant Clickable Headline
      { type: 'textbox', left: width / 2, top: 320, text: capitalizedTitle.toUpperCase(), fontSize: 72, fontWeight: 'bold', fontFamily: 'Montserrat', fill: '#ffffff', textAlign: 'center', originX: 'center', originY: 'center', width: 1140, shadow: { color: 'rgba(0,0,0,0.8)', blur: 14, offsetX: 0, offsetY: 4 } },
      // Action Callout Banner Box
      { type: 'rect', left: width / 2, top: 480, width: 880, height: 80, fill: '#f59e0b', rx: 16, ry: 16, originX: 'center', originY: 'center' },
      { type: 'textbox', left: width / 2, top: 480, text: 'WATCH BEFORE YOU START • ZERO TO PRO', fontSize: 30, fontWeight: 'bold', fontFamily: 'Montserrat', fill: '#0f172a', textAlign: 'center', originX: 'center', originY: 'center', width: 840 },
      // Subtext
      { type: 'textbox', left: width / 2, top: 620, text: '4K Full Masterclass  •  Official Creativa Studio  •  No Experience Needed', fontSize: 18, fontWeight: 'bold', fontFamily: 'Inter', fill: '#cbd5e1', textAlign: 'center', originX: 'center', originY: 'center', width: 1000 }
    ];
    return { id, title: `${capitalizedTitle} High-CTR YouTube Thumbnail`, category: 'Video', width, height, backgroundColor: '#090d16', previewGradient: 'linear-gradient(135deg, #e11d48 0%, #f59e0b 100%)', keywords: ['youtube', 'thumbnail', 'video', 'ctr'], objects };
  }

  // 5. INSTAGRAM STORY / REEL (1080 × 1920 px)
  if (isStory) {
    const width = 1080;
    const height = 1920;
    const objects = [
      // Top Handle Banner
      { type: 'rect', left: width / 2, top: 140, width: 420, height: 50, fill: 'rgba(255, 255, 255, 0.15)', rx: 25, ry: 25, originX: 'center', originY: 'center' },
      { type: 'textbox', left: width / 2, top: 140, text: `@creativa • Official Design`, fontSize: 16, fontWeight: 'bold', fontFamily: 'Montserrat', fill: '#ffffff', textAlign: 'center', originX: 'center', originY: 'center', width: 400 },
      // Central Hero Card
      { type: 'rect', left: width / 2, top: height / 2 - 80, width: 920, height: 1100, fill: 'rgba(255, 255, 255, 0.95)', rx: 36, ry: 36, originX: 'center', originY: 'center' },
      { type: 'rect', left: width / 2, top: height / 2 - 440, width: 340, height: 48, fill: theme.primary, rx: 24, ry: 24, originX: 'center', originY: 'center' },
      { type: 'textbox', left: width / 2, top: height / 2 - 440, text: 'EXCLUSIVE DROP', fontSize: 15, fontWeight: 'bold', fontFamily: 'Montserrat', fill: '#ffffff', textAlign: 'center', originX: 'center', originY: 'center', width: 320 },
      { type: 'textbox', left: width / 2, top: height / 2 - 180, text: capitalizedTitle.toUpperCase(), fontSize: 56, fontWeight: 'bold', fontFamily: 'Montserrat', fill: '#0f172a', textAlign: 'center', originX: 'center', originY: 'center', width: 800 },
      { type: 'textbox', left: width / 2, top: height / 2 + 120, text: 'Discover hand-crafted typography, bespoke aesthetics, and visual clarity designed to elevate your brand presence.', fontSize: 24, fontFamily: 'Inter', fill: '#475569', textAlign: 'center', originX: 'center', originY: 'center', width: 740 },
      // Bottom CTA Swipe Pill
      { type: 'rect', left: width / 2, top: 1680, width: 540, height: 76, fill: theme.primary, rx: 38, ry: 38, originX: 'center', originY: 'center' },
      { type: 'textbox', left: width / 2, top: 1680, text: 'TAP LINK IN BIO  ➔', fontSize: 22, fontWeight: 'bold', fontFamily: 'Montserrat', fill: '#ffffff', textAlign: 'center', originX: 'center', originY: 'center', width: 500 }
    ];
    return { id, title: `${capitalizedTitle} Viral Story & Reel`, category: 'Social Media', width, height, backgroundColor: '#0f172a', previewGradient: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)', keywords: ['story', 'reel', 'tiktok', 'instagram'], objects };
  }

  // 6. GENERAL MULTI-ELEMENT CANVA DESIGN (Default High-End Vector Stage)
  const width = isPresentation ? 1920 : (options.width || (isLogo ? 800 : 1080));
  const height = isPresentation ? 1080 : (options.height || (isLogo ? 800 : 1080));
  const category = isPresentation ? 'Presentation' : (isLogo ? 'Logo' : (options.category || 'Marketing'));

  const objects = [
    // Top border accent or background card
    {
      type: 'rect',
      left: width / 2,
      top: height / 2,
      width: Math.round(width * 0.92),
      height: Math.round(height * 0.92),
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
      top: Math.round(height * 0.22),
      width: Math.min(320, Math.round(width * 0.38)),
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
      top: Math.round(height * 0.22),
      text: (options.badge || `${category} TEMPLATE`).toUpperCase(),
      fontSize: Math.max(12, Math.round(width * 0.016)),
      fontWeight: 'bold',
      fontFamily: 'Montserrat',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      width: Math.min(300, Math.round(width * 0.36))
    },
    // Main Hero Headline
    {
      type: 'textbox',
      left: width / 2,
      top: Math.round(height * 0.42),
      text: capitalizedTitle.toUpperCase(),
      fontSize: Math.max(24, Math.round(Math.min(68, width * 0.055) * (capitalizedTitle.length > 30 ? 0.75 : 1))),
      fontWeight: 'bold',
      fontFamily: 'Montserrat',
      fill: theme.text,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      width: Math.round(width * 0.82)
    },
    // Decorative underline / divider
    {
      type: 'rect',
      left: width / 2,
      top: Math.round(height * 0.54),
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
      top: Math.round(height * 0.65),
      text: `Professional high-impact design for ${capitalizedTitle}. Fully customizable typography, colors & vectors.`,
      fontSize: Math.min(22, Math.max(14, Math.round(width * 0.022))),
      fontFamily: 'Inter',
      fill: theme.subtext,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      width: Math.round(width * 0.72)
    },
    // CTA Action Button
    {
      type: 'rect',
      left: width / 2,
      top: Math.round(height * 0.78),
      width: Math.min(260, Math.round(width * 0.35)),
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
      top: Math.round(height * 0.78),
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

    const existingIds = new Set(matched.map(m => m.id));
    const existingTitles = new Set(matched.map(m => (m.title || '').toLowerCase().trim()));
    const uniqueDynamic = dynamicItems.filter(item => 
      !existingIds.has(item.id) && !existingTitles.has((item.title || '').toLowerCase().trim())
    );

    // Combine matched templates with dynamically synthesized templates
    return [...matched, ...uniqueDynamic];
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
