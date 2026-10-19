export const SHAPE_ELEMENTS = [
  { id: 'rect', name: 'Rectangle', type: 'rect', fill: '#7D2AE8', width: 140, height: 140, rx: 0, ry: 0, keywords: ['box', 'square', 'block', 'quad'] },
  { id: 'rounded-rect', name: 'Rounded Rectangle', type: 'rect', fill: '#00C4CC', width: 160, height: 110, rx: 20, ry: 20, keywords: ['pill', 'card', 'button', 'badge'] },
  { id: 'circle', name: 'Circle', type: 'circle', fill: '#f59e0b', radius: 70, keywords: ['round', 'dot', 'oval', 'ring'] },
  { id: 'triangle', name: 'Triangle', type: 'triangle', fill: '#ec4899', width: 140, height: 130, keywords: ['pyramid', 'wedge', 'delta', 'arrow'] },
  { id: 'star', name: '5-Point Star', type: 'star', fill: '#fbbf24', points: 5, outerRadius: 75, innerRadius: 35, keywords: ['sparkle', 'rating', 'favorite', 'gold', 'award'] },
  { id: 'polygon', name: 'Hexagon', type: 'hexagon', fill: '#10b981', size: 75, keywords: ['honeycomb', 'mesh', 'poly', 'polygon'] },
  { id: 'heart', name: 'Heart', type: 'heart', fill: '#ef4444', keywords: ['love', 'like', 'valentine', 'romance'] }
];

export const MOCKUP_FRAMES = [
  { id: 'frame-phone', name: 'Phone Mockup Frame', type: 'phone', description: 'Smartphone frame', keywords: ['iphone', 'mobile', 'cell', 'android', 'device', 'screen'] },
  { id: 'frame-laptop', name: 'Laptop Mockup Frame', type: 'laptop', description: 'MacBook frame', keywords: ['macbook', 'computer', 'notebook', 'pc', 'monitor', 'display'] },
  { id: 'frame-polaroid', name: 'Polaroid Photo Frame', type: 'polaroid', description: 'Vintage photo frame', keywords: ['camera', 'instant', 'retro', 'photo', 'picture', 'card'] },
  { id: 'frame-circle', name: 'Circle Photo Frame', type: 'circle', description: 'Circular avatar frame', keywords: ['round', 'avatar', 'profile', 'crop', 'circle'] }
];

export const SOCIAL_MEDIA_ICONS = [
  { id: 'icon-instagram', name: 'Instagram Icon', platform: 'instagram', fill: '#E1306C', keywords: ['ig', 'insta', 'social', 'story', 'reels'] },
  { id: 'icon-youtube', name: 'YouTube Icon', platform: 'youtube', fill: '#FF0000', keywords: ['video', 'yt', 'channel', 'subscribe', 'stream'] },
  { id: 'icon-twitter', name: 'X / Twitter Icon', platform: 'twitter', fill: '#000000', keywords: ['tweet', 'social', 'feed', 'post'] },
  { id: 'icon-facebook', name: 'Facebook Icon', platform: 'facebook', fill: '#1877F2', keywords: ['meta', 'fb', 'social', 'community'] },
  { id: 'icon-linkedin', name: 'LinkedIn Icon', platform: 'linkedin', fill: '#0A66C2', keywords: ['career', 'jobs', 'professional', 'network'] },
  { id: 'icon-globe', name: 'Website Globe Icon', platform: 'globe', fill: '#7D2AE8', keywords: ['url', 'web', 'internet', 'browser', 'link'] }
];

export const LINE_ELEMENTS = [
  { id: 'line-solid', name: 'Solid Divider Line', type: 'line', stroke: '#1e293b', strokeWidth: 4, strokeDashArray: null, keywords: ['stroke', 'rule', 'separator', 'border'] },
  { id: 'line-dashed', name: 'Dashed Accent Line', type: 'line', stroke: '#7D2AE8', strokeWidth: 4, strokeDashArray: [12, 8], keywords: ['dash', 'accent', 'guide', 'pattern'] },
  { id: 'line-dotted', name: 'Dotted Guide Line', type: 'line', stroke: '#ec4899', strokeWidth: 5, strokeDashArray: [4, 6], keywords: ['dot', 'points', 'beads', 'trail'] },
  { id: 'arrow-right', name: 'Arrow Pointer Line', type: 'arrow', stroke: '#00C4CC', strokeWidth: 5, keywords: ['pointer', 'direction', 'next', 'flow'] }
];

export const STICKERS_AND_BADGES = [
  // Sales & Discounts
  { id: 'badge-sale', text: '50% OFF', bg: '#ef4444', textColor: '#ffffff', shape: 'pill', keywords: ['discount', 'promo', 'deal', 'offer', 'shop', 'sale'] },
  { id: 'badge-mega-sale', text: '🔥 MEGA SALE', bg: '#dc2626', textColor: '#ffffff', shape: 'pill', keywords: ['sale', 'mega', 'discount', 'hot', 'fire'] },
  { id: 'badge-bogo', text: 'BUY 1 GET 1 FREE', bg: '#ea580c', textColor: '#ffffff', shape: 'rounded', keywords: ['bogo', 'free', 'offer', 'deal', 'shopping'] },
  { id: 'badge-limited', text: '⏳ LIMITED OFFER', bg: '#f59e0b', textColor: '#000000', shape: 'rounded', keywords: ['exclusive', 'rare', 'special', 'urgency', 'time'] },
  { id: 'badge-flash', text: '⚡ FLASH DEAL', bg: '#eab308', textColor: '#000000', shape: 'pill', keywords: ['flash', 'speed', 'discount', 'lightning', 'deal'] },
  { id: 'badge-70off', text: 'UP TO 70% OFF', bg: '#be123c', textColor: '#ffffff', shape: 'rounded', keywords: ['discount', 'clearance', 'promo', 'percent', 'sale'] },

  // Trust, Verified & Ratings
  { id: 'badge-verified', text: '✔ 100% VERIFIED', bg: '#06b6d4', textColor: '#ffffff', shape: 'pill', keywords: ['check', 'authentic', 'guarantee', 'trust', 'safe', 'verified'] },
  { id: 'badge-best', text: '★ BESTSELLER', bg: '#8b5cf6', textColor: '#ffffff', shape: 'badge', keywords: ['popular', 'top', 'favorite', 'award', 'star', 'bestseller'] },
  { id: 'badge-top-rated', text: '★★★★★ TOP RATED', bg: '#7c3aed', textColor: '#ffffff', shape: 'rounded', keywords: ['rating', 'stars', 'review', 'top', 'quality'] },
  { id: 'badge-guarantee', text: '100% GUARANTEED', bg: '#059669', textColor: '#ffffff', shape: 'pill', keywords: ['guarantee', 'warranty', 'money back', 'trust', 'promise'] },
  { id: 'badge-support', text: '🎧 24/7 SUPPORT', bg: '#0284c7', textColor: '#ffffff', shape: 'pill', keywords: ['support', 'help', 'service', 'customer', 'always'] },

  // New & Trending
  { id: 'badge-new', text: 'NEW ARRIVAL', bg: '#10b981', textColor: '#ffffff', shape: 'rounded', keywords: ['latest', 'fresh', 'item', 'launch', 'new'] },
  { id: 'badge-trending', text: '🚀 TRENDING NOW', bg: '#ec4899', textColor: '#ffffff', shape: 'pill', keywords: ['viral', 'popular', 'trending', 'hot', 'hyped'] },
  { id: 'badge-coming-soon', text: '✨ COMING SOON', bg: '#6366f1', textColor: '#ffffff', shape: 'rounded', keywords: ['soon', 'launch', 'anticipation', 'future', 'sneak'] },

  // Premium & Creativa Branding
  { id: 'badge-pro', text: '⚡ CREATIVA STUDIO', bg: '#7D2AE8', textColor: '#ffffff', shape: 'pill', keywords: ['brand', 'studio', 'lightning', 'energy', 'creativa', 'pro'] },
  { id: 'badge-premium', text: '👑 PREMIUM QUALITY', bg: '#d97706', textColor: '#ffffff', shape: 'pill', keywords: ['gold', 'crown', 'luxury', 'quality', 'vip'] },
  { id: 'badge-vip', text: '💎 VIP EXCLUSIVE', bg: '#4338ca', textColor: '#ffffff', shape: 'rounded', keywords: ['diamond', 'vip', 'exclusive', 'member', 'elite'] },
  { id: 'badge-handcrafted', text: '✂ HANDCRAFTED', bg: '#854d0e', textColor: '#ffffff', shape: 'rounded', keywords: ['handmade', 'craft', 'artisan', 'custom', 'unique'] },

  // Shipping & Shopping CTAs
  { id: 'badge-free-shipping', text: '🚚 FREE SHIPPING', bg: '#15803d', textColor: '#ffffff', shape: 'pill', keywords: ['shipping', 'delivery', 'truck', 'free', 'courier'] },
  { id: 'badge-fast-delivery', text: '⚡ SAME DAY DELIVERY', bg: '#0f766e', textColor: '#ffffff', shape: 'rounded', keywords: ['delivery', 'fast', 'express', 'speed', 'today'] },
  { id: 'badge-gift', text: '🎁 FREE BONUS GIFT', bg: '#c026d3', textColor: '#ffffff', shape: 'pill', keywords: ['gift', 'present', 'free', 'bonus', 'reward'] },
  { id: 'badge-shop-now', text: '🛒 SHOP NOW', bg: '#1e293b', textColor: '#ffffff', shape: 'pill', keywords: ['cta', 'cart', 'buy', 'action', 'button'] },

  // Eco, Organic & Health
  { id: 'badge-organic', text: '🌿 100% ORGANIC', bg: '#16a34a', textColor: '#ffffff', shape: 'pill', keywords: ['organic', 'green', 'bio', 'nature', 'healthy'] },
  { id: 'badge-eco', text: '♻ ECO-FRIENDLY', bg: '#0d9488', textColor: '#ffffff', shape: 'rounded', keywords: ['recycle', 'eco', 'earth', 'sustainable', 'green'] },
  { id: 'badge-vegan', text: '🌱 CRUELTY-FREE', bg: '#65a30d', textColor: '#ffffff', shape: 'pill', keywords: ['vegan', 'animal', 'safe', 'clean', 'pure'] },

  // Social & Engagement CTAs
  { id: 'badge-swipe', text: '👉 SWIPE UP', bg: '#db2777', textColor: '#ffffff', shape: 'pill', keywords: ['instagram', 'story', 'swipe', 'arrow', 'social'] },
  { id: 'badge-link-in-bio', text: '🔗 LINK IN BIO', bg: '#4f46e5', textColor: '#ffffff', shape: 'pill', keywords: ['bio', 'link', 'instagram', 'profile', 'social'] },
  { id: 'badge-subscribe', text: '🔔 SUBSCRIBE NOW', bg: '#e11d48', textColor: '#ffffff', shape: 'rounded', keywords: ['youtube', 'bell', 'subscribe', 'channel', 'cta'] }
];

export const ELEMENT_FILTER_TAGS = [
  'All', 'Graphics', 'Shapes', 'Photos', 'Charts', 'Frames', 'Lines', 'Stickers'
];

export const RETRO_GRAPHICS_ELEMENTS = [
  { id: 'retro-cassette', name: 'Mixtape Cassette Tape', type: 'cassette', icon: '📼', tag: 'Graphics', keywords: ['audio', 'music', '90s', 'vintage', 'tape', 'radio', 'song'] },
  { id: 'retro-3dstar', name: '3D Chrome Sparkle Star', type: '3dstar', icon: '✨', tag: 'Graphics', keywords: ['sparkle', 'shine', 'glow', 'gold', 'y2k', 'glitter', 'star'] },
  { id: 'retro-chair', name: 'Mid-Century Modern Armchair', type: 'chair', icon: '🪑', tag: 'Graphics', keywords: ['furniture', 'interior', 'vintage', 'decor', 'living', 'seat'] },
  { id: 'retro-pencil', name: 'Doodle Artist Pencil', type: 'pencil', icon: '✏️', tag: 'Graphics', keywords: ['draw', 'sketch', 'write', 'author', 'craft', 'study', 'education'] },
  { id: 'retro-peace', name: '70s Groovy Peace Badge', type: 'peace', icon: '☮️', tag: 'Graphics', keywords: ['peace', 'hippie', '70s', 'love', 'freedom', 'badge'] }
];

export const CURATED_STOCK_PHOTOS = [
  {
    id: 'photo-1',
    name: 'Modern Laptop Workspace',
    category: 'Business',
    keywords: ['office', 'desk', 'laptop', 'macbook', 'work', 'workplace', 'minimal', 'tech'],
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-2',
    name: 'Vibrant Sunset Beach',
    category: 'Nature',
    keywords: ['beach', 'sea', 'ocean', 'sunset', 'sky', 'sun', 'nature', 'travel', 'summer'],
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-3',
    name: 'Urban High-Rise Architecture',
    category: 'Architecture',
    keywords: ['building', 'skyscraper', 'city', 'glass', 'modern', 'architecture', 'downtown'],
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-4',
    name: 'Creative Coffee & Latte Art',
    category: 'Lifestyle',
    keywords: ['coffee', 'cafe', 'cup', 'morning', 'drink', 'relax', 'food', 'lifestyle', 'breakfast'],
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-5',
    name: 'Cyberpunk Neon Street Lights',
    category: 'Abstract',
    keywords: ['neon', 'cyberpunk', 'glow', 'night', 'futuristic', 'tokyo', 'purple', 'abstract'],
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-6',
    name: 'Minimal Emerald Monstera Leaves',
    category: 'Nature',
    keywords: ['leaves', 'plant', 'green', 'monstera', 'botanical', 'flora', 'minimalist', 'nature'],
    url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-7',
    name: 'Professional Business Team Meeting',
    category: 'Business',
    keywords: ['meeting', 'corporate', 'people', 'team', 'collaboration', 'strategy', 'office'],
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-8',
    name: 'Organic Healthy Food Bowl',
    category: 'Food',
    keywords: ['food', 'salad', 'healthy', 'fresh', 'vegetables', 'diet', 'meal', 'nutrition'],
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-9',
    name: 'High Fashion Editorial Model',
    category: 'Fashion',
    keywords: ['fashion', 'model', 'portrait', 'style', 'clothing', 'beauty', 'magazine', 'person'],
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-10',
    name: 'Technology Code Matrix & Data',
    category: 'Technology',
    keywords: ['coding', 'tech', 'software', 'data', 'developer', 'screen', 'ai', 'computer'],
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-11',
    name: 'Himalayan Mountain Peaks & Mist',
    category: 'Nature',
    keywords: ['mountains', 'himalayas', 'peak', 'snow', 'landscape', 'clouds', 'adventure'],
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-12',
    name: 'Minimal Pastel Geometry Abstract',
    category: 'Abstract',
    keywords: ['abstract', 'pastel', 'minimal', 'gradient', 'shapes', 'art', 'background'],
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-13',
    name: 'Athletic Gym Crossfit Athlete',
    category: 'Lifestyle',
    keywords: ['gym', 'fitness', 'workout', 'exercise', 'training', 'athlete', 'crossfit', 'muscle'],
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-14',
    name: 'Artisan Woodfired Cheesy Pizza',
    category: 'Food',
    keywords: ['pizza', 'food', 'italian', 'cheese', 'slice', 'dinner', 'restaurant', 'fast food'],
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-15',
    name: 'Gourmet Double Smash Burger',
    category: 'Food',
    keywords: ['burger', 'food', 'beef', 'cheeseburger', 'lunch', 'fast food', 'grill', 'snack'],
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-16',
    name: 'Exotic Porsche Sports Car',
    category: 'Technology',
    keywords: ['car', 'vehicle', 'porsche', 'speed', 'automotive', 'luxury', 'drive', 'transport'],
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-17',
    name: 'Playful Golden Retriever Dog',
    category: 'Nature',
    keywords: ['dog', 'puppy', 'pet', 'animal', 'golden retriever', 'cute', 'canine', 'friend'],
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-18',
    name: 'Cute Fluffy Striped Kitten',
    category: 'Nature',
    keywords: ['cat', 'kitten', 'pet', 'feline', 'cute', 'fluffy', 'animal', 'eyes'],
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-19',
    name: 'Luxury Modern Glass Villa Penthouse',
    category: 'Architecture',
    keywords: ['real estate', 'house', 'villa', 'mansion', 'luxury', 'architecture', 'home', 'property'],
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-20',
    name: 'Romantic Wedding Newlywed Couple',
    category: 'Lifestyle',
    keywords: ['wedding', 'marriage', 'bride', 'groom', 'love', 'couple', 'romance', 'celebration'],
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-21',
    name: 'Golden Bitcoin & Blockchain Network',
    category: 'Technology',
    keywords: ['crypto', 'bitcoin', 'blockchain', 'finance', 'investment', 'money', 'trading', 'web3'],
    url: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-22',
    name: 'Live Concert Lights & DJ Stage',
    category: 'Lifestyle',
    keywords: ['music', 'concert', 'dj', 'festival', 'party', 'stage', 'lights', 'crowd', 'sound'],
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'photo-23',
    name: 'Deep Cosmic Galaxy & Stars Nebula',
    category: 'Abstract',
    keywords: ['space', 'galaxy', 'stars', 'cosmos', 'universe', 'astronomy', 'night', 'nebula'],
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=80'
  }
];
