import { SCRAPED_CANVA_CREATORS } from './scrapedCanvaCreators';
import { getAutoScrapedData } from '../utils/autoScraper';

const CURATED_CREATORS = [
  {
    id: 'creator-marina',
    name: 'Marina Studio',
    handle: '@marinastudio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    location: 'Global Creative Network',
    totalLikes: '120K likes',
    rating: '4.9 ★',
    badge: 'Creativa Verified Creator',
    specialty: 'Luxury & Editorial',
    followers: '184K',
    templatesCount: 142,
    bio: 'Crafting high-end editorial layouts, minimalist branding, and magazine portfolios.',
    designs: [
      {
        id: 'marina-1',
        title: 'Minimalist Fashion Lookbook',
        category: 'Marketing',
        previewGradient: 'linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%)',
        width: 1080,
        height: 1350,
        backgroundColor: '#faf5ff',
        objects: [
          { type: 'rect', left: 540, top: 675, width: 1000, height: 1270, fill: '#ffffff', stroke: '#e9d5ff', strokeWidth: 2, originX: 'center', originY: 'center' },
          { type: 'textbox', text: 'MAISON ÉTÉ', left: 540, top: 120, fontSize: 48, fill: '#1e1b4b', fontFamily: 'Cinzel', originX: 'center', width: 800, textAlign: 'center' },
          { type: 'textbox', text: 'SUMMER EDITORIAL COLLECTION', left: 540, top: 190, fontSize: 16, fill: '#7c3aed', fontFamily: 'Montserrat', originX: 'center', width: 600, textAlign: 'center' },
          { type: 'textbox', text: 'Timeless silhouettes crafted with natural silk and organic linen.', left: 540, top: 1150, fontSize: 18, fill: '#64748b', fontFamily: 'Lora', originX: 'center', width: 800, textAlign: 'center' }
        ]
      },
      {
        id: 'marina-2',
        title: 'Clean Architectural Portfolio',
        category: 'Presentation',
        previewGradient: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        width: 1920,
        height: 1080,
        backgroundColor: '#f8fafc',
        objects: [
          { type: 'textbox', text: 'ARCHITECTURAL MONOGRAPH', left: 960, top: 220, fontSize: 64, fill: '#0f172a', fontFamily: 'Montserrat', originX: 'center', width: 1400, textAlign: 'center' },
          { type: 'textbox', text: 'MODERN SPACES & STRUCTURAL INTEGRITY', left: 960, top: 310, fontSize: 22, fill: '#64748b', fontFamily: 'Inter', originX: 'center', width: 1000, textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'creator-retrowaves',
    name: 'Retro Waves Studio',
    handle: '@retrowaves',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
    location: 'Global Creative Network',
    totalLikes: '120K likes',
    rating: '4.9 ★',
    badge: 'Creativa Verified Creator',
    specialty: 'Y2K & 90s Aesthetics',
    followers: '142K',
    templatesCount: 98,
    bio: 'Cassette tapes, neon grids, groovy stickers, and bold retro nostalgia.',
    designs: [
      {
        id: 'retro-1',
        title: '90s Indie Mixtape Cover',
        category: 'Social Media',
        previewGradient: 'linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%)',
        width: 1080,
        height: 1080,
        backgroundColor: '#18181b',
        objects: [
          { type: 'rect', left: 540, top: 540, width: 860, height: 600, fill: '#27272a', rx: 30, ry: 30, originX: 'center', originY: 'center' },
          { type: 'textbox', text: 'SIDE A: SUMMER VIBES', left: 540, top: 320, fontSize: 36, fill: '#f43f5e', fontFamily: 'Montserrat', originX: 'center', width: 700, textAlign: 'center' },
          { type: 'textbox', text: '★ CASSETTE STEREO HI-FI ★', left: 540, top: 760, fontSize: 26, fill: '#fbbf24', fontFamily: 'Montserrat', originX: 'center', width: 700, textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'creator-naveen',
    name: 'Naveen Visuals',
    handle: '@naveenvisuals',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80',
    location: 'Global Creative Network',
    totalLikes: '120K likes',
    rating: '4.9 ★',
    badge: 'Creativa Verified Creator',
    specialty: 'Indian Festivals & Weddings',
    followers: '210K',
    templatesCount: 220,
    bio: 'Vibrant cultural designs, royal wedding stationery, Diwali greetings, and festive promos.',
    designs: [
      {
        id: 'naveen-1',
        title: 'Royal Indian Wedding Sangeet',
        category: 'Invitation',
        previewGradient: 'linear-gradient(135deg, #78350f 0%, #b45309 100%)',
        width: 1080,
        height: 1920,
        backgroundColor: '#451a03',
        objects: [
          { type: 'textbox', text: 'शुभ विवाह', left: 540, top: 220, fontSize: 52, fill: '#fef08a', fontFamily: 'Rozha One', originX: 'center', width: 600, textAlign: 'center' },
          { type: 'textbox', text: 'ANANYA & ROHAN', left: 540, top: 320, fontSize: 44, fill: '#ffffff', fontFamily: 'Cinzel', originX: 'center', width: 800, textAlign: 'center' },
          { type: 'textbox', text: 'CORDIALLY INVITE YOU TO THEIR SANGEET NIGHT', left: 540, top: 400, fontSize: 18, fill: '#fde047', fontFamily: 'Montserrat', originX: 'center', width: 700, textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'creator-studiosun',
    name: 'Studio Sun & Clay',
    handle: '@studiosun',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    location: 'Global Creative Network',
    totalLikes: '120K likes',
    rating: '4.9 ★',
    badge: 'Creativa Verified Creator',
    specialty: 'Warm Minimalist Branding',
    followers: '95K',
    templatesCount: 84,
    bio: 'Earthy terracotta tones, organic shapes, and calm minimalist lifestyle layouts.',
    designs: [
      {
        id: 'sun-1',
        title: 'Ceramic Studio Workshop',
        category: 'Marketing',
        previewGradient: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
        width: 1080,
        height: 1350,
        backgroundColor: '#fff7ed',
        objects: [
          { type: 'textbox', text: 'POTTERY & CLAY', left: 540, top: 200, fontSize: 54, fill: '#9a3412', fontFamily: 'Playfair Display', originX: 'center', width: 800, textAlign: 'center' },
          { type: 'textbox', text: 'Handcrafted wheel throwing masterclass.', left: 540, top: 290, fontSize: 22, fill: '#7c2d12', fontFamily: 'Lora', originX: 'center', width: 700, textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'creator-borcelle',
    name: 'Borcelle Agency',
    handle: '@borcelledesign',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=80',
    location: 'Global Creative Network',
    totalLikes: '120K likes',
    rating: '4.9 ★',
    badge: 'Creativa Verified Creator',
    specialty: 'Corporate & Education',
    followers: '320K',
    templatesCount: 310,
    bio: 'High-impact pitch decks, academic credentials, and enterprise brand systems.',
    designs: [
      {
        id: 'borcelle-1',
        title: 'Corporate Growth Pitch Deck',
        category: 'Presentation',
        previewGradient: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
        width: 1920,
        height: 1080,
        backgroundColor: '#0f172a',
        objects: [
          { type: 'textbox', text: 'SERIES B EXPANSION DECK', left: 960, top: 280, fontSize: 62, fill: '#ffffff', fontFamily: 'Montserrat', originX: 'center', width: 1400, textAlign: 'center' },
          { type: 'textbox', text: 'BORCELLE GLOBAL STRATEGY 2026', left: 960, top: 380, fontSize: 26, fill: '#38bdf8', fontFamily: 'Inter', originX: 'center', width: 1000, textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'creator-neontokyo',
    name: 'Neon Tokyo Studio',
    handle: '@neontokyo',
    avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    location: 'Global Creative Network',
    totalLikes: '120K likes',
    rating: '4.9 ★',
    badge: 'Creativa Verified Creator',
    specialty: 'Cyberpunk & Twitch Overlays',
    followers: '198K',
    templatesCount: 165,
    bio: 'Futuristic glowing typography, synthwave posters, and esports streaming packages.',
    designs: [
      {
        id: 'tokyo-1',
        title: 'Cyberpunk Twitch Live Screen',
        category: 'Video',
        previewGradient: 'linear-gradient(135deg, #090014 0%, #7000ff 100%)',
        width: 1920,
        height: 1080,
        backgroundColor: '#050010',
        objects: [
          { type: 'textbox', text: 'STREAM STARTING SOON', left: 960, top: 460, fontSize: 68, fill: '#00f7ff', fontFamily: 'Montserrat', originX: 'center', width: 1400, textAlign: 'center' },
          { type: 'textbox', text: 'CYBER LIVE // SHIBUYA 2099', left: 960, top: 560, fontSize: 24, fill: '#ff007f', fontFamily: 'Inter', originX: 'center', width: 900, textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'creator-fitpulse',
    name: 'FitPulse Studio',
    handle: '@fitpulsedesign',
    avatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150&q=80',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80',
    location: 'Global Creative Network',
    totalLikes: '120K likes',
    rating: '4.9 ★',
    badge: 'Creativa Verified Creator',
    specialty: 'Fitness & Athletic Posters',
    followers: '175K',
    templatesCount: 120,
    bio: 'High-intensity gym promotions, fitness challenges, and athlete workout guides.',
    designs: [
      {
        id: 'fit-1',
        title: '30-Day Beast Transformation',
        category: 'Poster',
        previewGradient: 'linear-gradient(135deg, #450a0a 0%, #dc2626 100%)',
        width: 1080,
        height: 1350,
        backgroundColor: '#09090b',
        objects: [
          { type: 'textbox', text: 'UNLEASH YOUR LIMITS', left: 540, top: 220, fontSize: 56, fill: '#ef4444', fontFamily: 'Montserrat', originX: 'center', width: 900, textAlign: 'center' },
          { type: 'textbox', text: 'HIGH INTENSITY CROSSFIT CHALLENGE', left: 540, top: 310, fontSize: 22, fill: '#f59e0b', fontFamily: 'Inter', originX: 'center', width: 800, textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'creator-culinary',
    name: 'Culinary Canvas',
    handle: '@culinarycanvas',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    location: 'Global Creative Network',
    totalLikes: '120K likes',
    rating: '4.9 ★',
    badge: 'Creativa Verified Creator',
    specialty: 'Food Menus & Cafe Promos',
    followers: '230K',
    templatesCount: 190,
    bio: 'Artisan coffee branding, burger shack flyers, cocktail menus, and gourmet food cards.',
    designs: [
      {
        id: 'food-1',
        title: 'Artisan Roast Coffee Menu',
        category: 'Marketing',
        previewGradient: 'linear-gradient(135deg, #451a03 0%, #92400e 100%)',
        width: 1080,
        height: 1920,
        backgroundColor: '#fffbeb',
        objects: [
          { type: 'textbox', text: 'ESPRESSO & BOTANICALS', left: 540, top: 240, fontSize: 52, fill: '#78350f', fontFamily: 'Playfair Display', originX: 'center', width: 900, textAlign: 'center' },
          { type: 'textbox', text: 'ETHICALLY SOURCED COLD BREW', left: 540, top: 320, fontSize: 20, fill: '#b45309', fontFamily: 'Montserrat', originX: 'center', width: 700, textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'creator-cryptonexus',
    name: 'CryptoNexus UI',
    handle: '@cryptonexus',
    avatar: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=150&q=80',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    location: 'Global Creative Network',
    totalLikes: '120K likes',
    rating: '4.9 ★',
    badge: 'Creativa Verified Creator',
    specialty: 'Web3 & Fintech Infographics',
    followers: '162K',
    templatesCount: 115,
    bio: 'DeFi analytics dashboards, blockchain tokenomics pitch decks, and crypto exchange ads.',
    designs: [
      {
        id: 'crypto-1',
        title: 'Web3 Tokenomics Infographic',
        category: 'Marketing',
        previewGradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        width: 1080,
        height: 1080,
        backgroundColor: '#020617',
        objects: [
          { type: 'textbox', text: 'DECENTRALIZED ECOSYSTEM', left: 540, top: 260, fontSize: 46, fill: '#38bdf8', fontFamily: 'Montserrat', originX: 'center', width: 900, textAlign: 'center' },
          { type: 'textbox', text: 'TOTAL VALUE LOCKED: $1.4B', left: 540, top: 340, fontSize: 24, fill: '#10b981', fontFamily: 'Inter', originX: 'center', width: 700, textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'creator-botanica',
    name: 'Botanica Greens',
    handle: '@botanicagreens',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80',
    location: 'Global Creative Network',
    totalLikes: '120K likes',
    rating: '4.9 ★',
    badge: 'Creativa Verified Creator',
    specialty: 'Eco Wellness & Botanical',
    followers: '110K',
    templatesCount: 88,
    bio: 'Earthy matcha aesthetics, organic skincare packaging, and zero-waste lifestyle tips.',
    designs: [
      {
        id: 'botanica-1',
        title: 'Organic Herbal Infusion',
        category: 'Marketing',
        previewGradient: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
        width: 1080,
        height: 1080,
        backgroundColor: '#f0fdf4',
        objects: [
          { type: 'textbox', text: 'PURE BOTANICALS', left: 540, top: 280, fontSize: 50, fill: '#064e3b', fontFamily: 'Cinzel', originX: 'center', width: 800, textAlign: 'center' },
          { type: 'textbox', text: '100% ORGANIC HERBAL BLEND', left: 540, top: 360, fontSize: 18, fill: '#059669', fontFamily: 'Montserrat', originX: 'center', width: 600, textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'creator-realestate',
    name: 'RealEstate Elite',
    handle: '@reelite',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=80',
    location: 'Global Creative Network',
    totalLikes: '120K likes',
    rating: '4.9 ★',
    badge: 'Creativa Verified Creator',
    specialty: 'Luxury Architecture & Real Estate',
    followers: '148K',
    templatesCount: 130,
    bio: 'Million-dollar penthouse flyers, architectural blueprints, and luxury open house guides.',
    designs: [
      {
        id: 're-1',
        title: 'Modern Waterfront Villa',
        category: 'Poster',
        previewGradient: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
        width: 1080,
        height: 1350,
        backgroundColor: '#0f172a',
        objects: [
          { type: 'textbox', text: 'OCEANFRONT RESIDENCE', left: 540, top: 220, fontSize: 52, fill: '#f8fafc', fontFamily: 'Montserrat', originX: 'center', width: 900, textAlign: 'center' },
          { type: 'textbox', text: 'OFFERED AT $4,850,000 | 5 BEDS 6 BATHS', left: 540, top: 300, fontSize: 20, fill: '#38bdf8', fontFamily: 'Inter', originX: 'center', width: 800, textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'creator-soundwave',
    name: 'SoundWave Beats',
    handle: '@soundwave',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=80',
    location: 'Global Creative Network',
    totalLikes: '120K likes',
    rating: '4.9 ★',
    badge: 'Creativa Verified Creator',
    specialty: 'Electronic Music & Podcasts',
    followers: '205K',
    templatesCount: 178,
    bio: 'Ibiza festival line-ups, techno rave posters, and top-charting Spotify podcast covers.',
    designs: [
      {
        id: 'sw-1',
        title: 'Electronic Music Festival 2026',
        category: 'Poster',
        previewGradient: 'linear-gradient(135deg, #701a75 0%, #4c0519 100%)',
        width: 1080,
        height: 1920,
        backgroundColor: '#18181b',
        objects: [
          { type: 'textbox', text: 'ECHOES OF THE FUTURE', left: 540, top: 280, fontSize: 58, fill: '#f43f5e', fontFamily: 'Montserrat', originX: 'center', width: 900, textAlign: 'center' },
          { type: 'textbox', text: '3 DAYS OF IMMERSIVE SOUND & LIGHT', left: 540, top: 370, fontSize: 22, fill: '#e879f9', fontFamily: 'Inter', originX: 'center', width: 800, textAlign: 'center' }
        ]
      }
    ]
  }
];

export function getAllCreators() {
  try {
    const autoData = getAutoScrapedData();
    const map = new Map();
    [...autoData.creators, ...SCRAPED_CANVA_CREATORS, ...CURATED_CREATORS].forEach(c => {
      if (c && c.id) map.set(c.id, c);
    });
    return Array.from(map.values());
  } catch (e) {
    return [...SCRAPED_CANVA_CREATORS, ...CURATED_CREATORS];
  }
}

export const CREATIVA_CREATORS = getAllCreators();
export const CANVA_CREATORS = CREATIVA_CREATORS;
