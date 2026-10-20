import { Rect, Circle, Triangle, Polygon, Line, Path, Group, Textbox } from 'fabric';

export const createStar = ({ points = 5, outerRadius = 70, innerRadius = 35, fill = '#fbbf24', left = 350, top = 350 }) => {
  const step = Math.PI / points;
  const polyPoints = [];

  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    polyPoints.push({
      x: r * Math.cos(angle),
      y: r * Math.sin(angle)
    });
  }

  return new Polygon(polyPoints, {
    left,
    top,
    fill,
    originX: 'center',
    originY: 'center',
    stroke: 'transparent',
    strokeWidth: 0
  });
};

export const createHexagon = ({ size = 65, fill = '#10b981', left = 350, top = 350 }) => {
  const polyPoints = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * 2 * Math.PI) / 6;
    polyPoints.push({
      x: size * Math.cos(angle),
      y: size * Math.sin(angle)
    });
  }

  return new Polygon(polyPoints, {
    left,
    top,
    fill,
    originX: 'center',
    originY: 'center'
  });
};

export const createHeart = ({ fill = '#ef4444', left = 350, top = 350 }) => {
  const heartPath = 'M 0, -20 A 20,20 0 0,0 -40,-20 A 20,20 0 0,0 -40,10 Q -40,25 0,55 Q 40,25 40,10 A 20,20 0 0,0 40,-20 A 20,20 0 0,0 0,-20 Z';
  
  return new Path(heartPath, {
    left,
    top,
    fill,
    scaleX: 1.5,
    scaleY: 1.5,
    originX: 'center',
    originY: 'center'
  });
};

export const createStickerBadge = ({ text, bg = '#ef4444', textColor = '#ffffff', shape = 'pill', left = 350, top = 350 }) => {
  const padX = 24;
  const fontSize = 16;
  const textObj = new Textbox(text, {
    fontSize,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    fill: textColor,
    textAlign: 'center',
    originX: 'center',
    originY: 'center'
  });

  const width = Math.max(140, text.length * 10 + padX * 2);
  const height = 48;
  const rx = shape === 'pill' ? height / 2 : 12;

  const bgRect = new Rect({
    width,
    height,
    fill: bg,
    rx,
    ry: rx,
    originX: 'center',
    originY: 'center',
    shadow: {
      color: 'rgba(0,0,0,0.2)',
      blur: 8,
      offsetX: 0,
      offsetY: 3
    }
  });

  return new Group([bgRect, textObj], {
    left,
    top,
    originX: 'center',
    originY: 'center'
  });
};

/**
 * Creativa Pro Vector Phone Mockup Frame
 */
export const createPhoneMockup = ({ left = 400, top = 400 }) => {
  const bezel = new Rect({
    width: 220,
    height: 440,
    rx: 36,
    ry: 36,
    fill: '#1e293b',
    stroke: '#0f172a',
    strokeWidth: 4,
    originX: 'center',
    originY: 'center',
    shadow: { color: 'rgba(0,0,0,0.25)', blur: 24, offsetY: 12 }
  });

  const screen = new Rect({
    width: 204,
    height: 422,
    rx: 28,
    ry: 28,
    fill: '#1e1b4b',
    originX: 'center',
    originY: 'center'
  });

  const island = new Rect({
    width: 66,
    height: 18,
    rx: 9,
    ry: 9,
    fill: '#0f172a',
    originX: 'center',
    originY: 'center',
    top: -192
  });

  const timeLabel = new Textbox('9:41', {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    fill: '#ffffff',
    textAlign: 'left',
    originX: 'center',
    originY: 'center',
    top: -192,
    left: -58,
    width: 40
  });

  const cardMockup = new Rect({
    width: 172,
    height: 100,
    rx: 16,
    ry: 16,
    fill: '#7D2AE8',
    originX: 'center',
    originY: 'center',
    top: -80
  });

  const cardTitle = new Textbox('Creativa Mobile', {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    fill: '#ffffff',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    top: -80,
    width: 160
  });

  const uiFeed = new Rect({
    width: 172,
    height: 160,
    rx: 14,
    ry: 14,
    fill: '#312e81',
    originX: 'center',
    originY: 'center',
    top: 65
  });

  return new Group([bezel, screen, island, timeLabel, cardMockup, cardTitle, uiFeed], {
    left,
    top,
    originX: 'center',
    originY: 'center'
  });
};

/**
 * Creativa Pro Laptop Mockup Frame
 */
export const createLaptopMockup = ({ left = 400, top = 400 }) => {
  const screenBezel = new Rect({
    width: 360,
    height: 225,
    rx: 12,
    ry: 12,
    fill: '#1e293b',
    originX: 'center',
    originY: 'center',
    top: -15,
    shadow: { color: 'rgba(0,0,0,0.2)', blur: 20, offsetY: 10 }
  });

  const screenDisplay = new Rect({
    width: 336,
    height: 200,
    rx: 4,
    ry: 4,
    fill: '#0f172a',
    originX: 'center',
    originY: 'center',
    top: -15
  });

  const cameraDot = new Circle({
    radius: 3,
    fill: '#475569',
    originX: 'center',
    originY: 'center',
    top: -121
  });

  const baseTop = new Rect({
    width: 420,
    height: 14,
    rx: 4,
    ry: 4,
    fill: '#cbd5e1',
    originX: 'center',
    originY: 'center',
    top: 102
  });

  const baseLip = new Rect({
    width: 70,
    height: 5,
    rx: 2,
    ry: 2,
    fill: '#94a3b8',
    originX: 'center',
    originY: 'center',
    top: 100
  });

  const appHeader = new Rect({
    width: 336,
    height: 28,
    fill: '#1e293b',
    originX: 'center',
    originY: 'center',
    top: -101
  });

  const heroGraphic = new Rect({
    width: 290,
    height: 120,
    rx: 10,
    ry: 10,
    fill: '#7D2AE8',
    originX: 'center',
    originY: 'center',
    top: -10
  });

  const heroLabel = new Textbox('Creative Workspace Dashboard', {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    fill: '#ffffff',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    top: -10,
    width: 260
  });

  return new Group([screenBezel, screenDisplay, cameraDot, baseTop, baseLip, appHeader, heroGraphic, heroLabel], {
    left,
    top,
    originX: 'center',
    originY: 'center'
  });
};

/**
 * Creativa Pro Polaroid Photo Card Frame
 */
export const createPolaroidFrame = ({ left = 400, top = 400, caption = 'Golden Memories ✨' }) => {
  const card = new Rect({
    width: 240,
    height: 290,
    rx: 8,
    ry: 8,
    fill: '#ffffff',
    stroke: '#e2e8f0',
    strokeWidth: 1.5,
    originX: 'center',
    originY: 'center',
    shadow: { color: 'rgba(0,0,0,0.12)', blur: 16, offsetY: 8 }
  });

  const photoArea = new Rect({
    width: 210,
    height: 210,
    rx: 4,
    ry: 4,
    fill: '#7D2AE8',
    originX: 'center',
    originY: 'center',
    top: -20
  });

  const photoArt = new Textbox('Sunset Horizon', {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    fill: '#ffffff',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    top: -20,
    width: 190
  });

  const textObj = new Textbox(caption, {
    fontSize: 16,
    fontFamily: 'Dancing Script',
    fill: '#475569',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    top: 110,
    width: 200
  });

  return new Group([card, photoArea, photoArt, textObj], {
    left,
    top,
    originX: 'center',
    originY: 'center'
  });
};

/**
 * Social Media & Vector Brand Icons
 */
export const createSocialIcon = ({ platform = 'instagram', fill = '#7D2AE8', left = 400, top = 400 }) => {
  let pathStr = '';
  let viewBoxScale = 1.5;

  if (platform === 'instagram') {
    pathStr = 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z';
  } else if (platform === 'youtube') {
    pathStr = 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z';
  } else if (platform === 'twitter') {
    pathStr = 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z';
  } else if (platform === 'facebook') {
    pathStr = 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z';
  } else if (platform === 'linkedin') {
    pathStr = 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.27a1.64 1.64 0 0 0-1.64 1.63 1.64 1.64 0 0 0 1.64 1.63 1.64 1.64 0 0 0 1.63-1.63c0-.9-.73-1.63-1.63-1.63z';
  } else {
    // Globe / Web
    pathStr = 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8 8 0 0 1 18.93 8zM12 4.07a14 14 0 0 1 1.9 3.93h-3.8A14 14 0 0 1 12 4.07zM4.07 14A8 8 0 0 1 4 12a8 8 0 0 1 .07-2h3.38a16.8 16.8 0 0 0-.05 2 16.8 16.8 0 0 0 .05 2zm1.06 2h2.95a15.65 15.65 0 0 0 1.38 3.56A8 8 0 0 1 5.13 16zm2.95-8H5.13a8 8 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.08 8zm3.92 11.93A14 14 0 0 1 10.1 16h3.8a14 14 0 0 1-1.9 3.93zM14.54 14H9.46a14.7 14.7 0 0 1-.06-2 14.7 14.7 0 0 1 .06-2h5.08a14.7 14.7 0 0 1 .06 2 14.7 14.7 0 0 1-.06 2zm.84 5.56A15.65 15.65 0 0 0 16.76 16h2.95a8 8 0 0 1-4.33 3.56zM16.55 14a16.8 16.8 0 0 0 .05-2 16.8 16.8 0 0 0-.05-2h3.38A8 8 0 0 1 20 12a8 8 0 0 1-.07 2z';
  }

  return new Path(pathStr, {
    left,
    top,
    fill,
    scaleX: viewBoxScale,
    scaleY: viewBoxScale,
    originX: 'center',
    originY: 'center'
  });
};

/**
 * Creativa Circle Photo Frame
 */
export const createCircleFrame = ({ left = 400, top = 400, radius = 90 }) => {
  const outer = new Circle({
    radius: radius + 6,
    fill: '#ffffff',
    originX: 'center',
    originY: 'center',
    shadow: { color: 'rgba(0,0,0,0.12)', blur: 15, offsetY: 6 }
  });
  const inner = new Circle({
    radius,
    fill: '#cbd5e1',
    originX: 'center',
    originY: 'center'
  });
  const text = new Textbox('📷 Circle Frame', {
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fill: '#64748b',
    originX: 'center',
    originY: 'center',
    textAlign: 'center',
    width: 140
  });
  return new Group([outer, inner, text], {
    left,
    top,
    originX: 'center',
    originY: 'center'
  });
};

/**
 * 90s Vintage Audio Cassette Tape (Screenshot 3)
 */
export const createRetroCassette = ({ left = 400, top = 400 }) => {
  const body = new Rect({
    width: 200,
    height: 125,
    rx: 10,
    ry: 10,
    fill: '#27272a',
    stroke: '#18181b',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center'
  });

  const sticker = new Rect({
    width: 170,
    height: 75,
    rx: 6,
    ry: 6,
    fill: '#f43f5e',
    originX: 'center',
    originY: 'center',
    top: -6
  });

  const title = new Textbox('★ RETRO MIXTAPE 90s ★', {
    fontSize: 9,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    fill: '#ffffff',
    originX: 'center',
    originY: 'center',
    top: -30,
    textAlign: 'center',
    width: 160
  });

  const tapeWindow = new Rect({
    width: 90,
    height: 32,
    rx: 4,
    ry: 4,
    fill: '#18181b',
    originX: 'center',
    originY: 'center',
    top: -2
  });

  const reel1 = new Circle({
    radius: 10,
    fill: '#ffffff',
    stroke: '#cbd5e1',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    left: -25,
    top: -2
  });

  const reel2 = new Circle({
    radius: 10,
    fill: '#ffffff',
    stroke: '#cbd5e1',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    left: 25,
    top: -2
  });

  const bottomTrapezoid = new Rect({
    width: 130,
    height: 22,
    rx: 4,
    ry: 4,
    fill: '#3f3f46',
    originX: 'center',
    originY: 'center',
    top: 45
  });

  return new Group([body, bottomTrapezoid, sticker, title, tapeWindow, reel1, reel2], {
    left,
    top,
    originX: 'center',
    originY: 'center'
  });
};

/**
 * 3D Chrome Sparkle Star (Screenshot 3)
 */
export const create3DStar = ({ left = 400, top = 400, fill = '#f59e0b' }) => {
  // 4-point sparkle star
  const starPath = 'M 0 -60 Q 0 0 60 0 Q 0 0 0 60 Q 0 0 -60 0 Q 0 0 0 -60 Z';
  const mainSparkle = new Path(starPath, {
    fill,
    originX: 'center',
    originY: 'center',
    shadow: { color: 'rgba(245, 158, 11, 0.4)', blur: 15, offsetX: 0, offsetY: 0 }
  });

  const centerGlow = new Circle({
    radius: 12,
    fill: '#ffffff',
    originX: 'center',
    originY: 'center',
    opacity: 0.9
  });

  return new Group([mainSparkle, centerGlow], {
    left,
    top,
    originX: 'center',
    originY: 'center'
  });
};

/**
 * Doodle Artist Pencil (Screenshot 3)
 */
export const createDoodlePencil = ({ left = 400, top = 400 }) => {
  const body = new Rect({
    width: 140,
    height: 24,
    rx: 3,
    ry: 3,
    fill: '#f59e0b',
    originX: 'center',
    originY: 'center',
    angle: -30
  });

  const eraser = new Rect({
    width: 30,
    height: 24,
    rx: 4,
    ry: 4,
    fill: '#f43f5e',
    originX: 'center',
    originY: 'center',
    left: -75,
    angle: -30
  });

  const tip = new Triangle({
    width: 24,
    height: 28,
    fill: '#fde68a',
    originX: 'center',
    originY: 'center',
    left: 80,
    angle: 60
  });

  return new Group([body, eraser, tip], {
    left,
    top,
    originX: 'center',
    originY: 'center'
  });
};

/**
 * Mid-Century Armchair Graphic (Screenshot 3)
 */
export const createRetroChair = ({ left = 400, top = 400 }) => {
  const back = new Rect({
    width: 80,
    height: 90,
    rx: 24,
    ry: 24,
    fill: '#0d9488',
    originX: 'center',
    originY: 'center',
    top: -20
  });

  const seat = new Rect({
    width: 100,
    height: 36,
    rx: 14,
    ry: 14,
    fill: '#14b8a6',
    originX: 'center',
    originY: 'center',
    top: 20
  });

  const legLeft = new Line([-25, 30, -35, 70], {
    stroke: '#78350f',
    strokeWidth: 4,
    strokeLineCap: 'round'
  });

  const legRight = new Line([25, 30, 35, 70], {
    stroke: '#78350f',
    strokeWidth: 4,
    strokeLineCap: 'round'
  });

  return new Group([legLeft, legRight, back, seat], {
    left,
    top,
    originX: 'center',
    originY: 'center'
  });
};

/**
 * 70s Peace Sign Badge (Screenshot 3)
 */
export const createPeaceBadge = ({ left = 400, top = 400 }) => {
  const circle = new Circle({
    radius: 40,
    fill: '#8b5cf6',
    stroke: '#6d28d9',
    strokeWidth: 3,
    originX: 'center',
    originY: 'center'
  });

  const vLine = new Line([0, -35, 0, 35], {
    stroke: '#ffffff',
    strokeWidth: 6,
    strokeLineCap: 'round',
    originX: 'center',
    originY: 'center'
  });

  const lLine = new Line([0, 0, -26, 26], {
    stroke: '#ffffff',
    strokeWidth: 6,
    strokeLineCap: 'round',
    originX: 'center',
    originY: 'center'
  });

  const rLine = new Line([0, 0, 26, 26], {
    stroke: '#ffffff',
    strokeWidth: 6,
    strokeLineCap: 'round',
    originX: 'center',
    originY: 'center'
  });

  return new Group([circle, vLine, lLine, rLine], {
    left,
    top,
    originX: 'center',
    originY: 'center'
  });
};

