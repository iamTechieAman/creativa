/**
 * Creativa Client Session & Data Isolation Engine
 * 
 * Guarantees 100% client-side privacy & zero-cross contamination without login barriers.
 * Each device/browser maintains its own persistent session ID in cookies & localStorage.
 * Another user opening Creativa on their own laptop or incognito starts completely fresh
 * and cannot access or see any previous person's uploads or saved projects.
 */

const SESSION_COOKIE_NAME = 'creativa_device_session_token';
const SESSION_STORAGE_KEY = 'creativa_session_id';

/**
 * Helper to get cookie value by name
 */
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Helper to set cookie with 1-year persistence
 */
function setCookie(name, value, days = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Returns or generates a persistent, unique device session ID
 */
export function getOrCreateSessionId() {
  if (typeof window === 'undefined') return 'server_session';

  // 1. Check Cookie first
  let sessionId = getCookie(SESSION_COOKIE_NAME);

  // 2. Fallback to LocalStorage
  if (!sessionId) {
    try {
      sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    } catch (e) {}
  }

  // 3. Generate new unique session ID if fresh browser/laptop
  if (!sessionId) {
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(8)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    sessionId = `creativa_usr_${Date.now().toString(36)}_${randomHex}`;
    
    // Store in both Cookie and LocalStorage for robustness
    setCookie(SESSION_COOKIE_NAME, sessionId);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    } catch (e) {}
  } else {
    // Keep cookie refreshed
    setCookie(SESSION_COOKIE_NAME, sessionId);
  }

  return sessionId;
}

// Scoped key generators
export const getScopedKey = (feature) => {
  const sessionId = getOrCreateSessionId();
  return `creativa_${feature}_${sessionId}`;
};

/* =========================================================================
   USER UPLOADS ISOLATION
   ========================================================================= */

export function getIsolatedUserUploads() {
  const key = getScopedKey('uploads');
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed reading user isolated uploads', e);
    return [];
  }
}

export function saveIsolatedUserUpload(uploadItem) {
  const key = getScopedKey('uploads');
  try {
    const current = getIsolatedUserUploads();
    const updated = [uploadItem, ...current];
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Failed saving user isolated upload', e);
    return [];
  }
}

export function deleteIsolatedUserUpload(uploadId) {
  const key = getScopedKey('uploads');
  try {
    const current = getIsolatedUserUploads();
    const updated = current.filter(item => item.id !== uploadId);
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

/* =========================================================================
   USER PROJECTS ISOLATION
   ========================================================================= */

export function getIsolatedUserProjects() {
  const key = getScopedKey('projects');
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed reading user isolated projects', e);
    return [];
  }
}

export function saveIsolatedUserProject(projectData) {
  const key = getScopedKey('projects');
  try {
    const current = getIsolatedUserProjects();
    const existingIdx = current.findIndex(p => p.id === projectData.id);
    let updated;
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = { ...updated[existingIdx], ...projectData, updatedAt: new Date().toISOString() };
    } else {
      updated = [
        { ...projectData, id: projectData.id || `proj-${Date.now()}`, createdAt: new Date().toISOString() },
        ...current
      ];
    }
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Failed saving user isolated project', e);
    return [];
  }
}

export function deleteIsolatedUserProject(projectId) {
  const key = getScopedKey('projects');
  try {
    const current = getIsolatedUserProjects();
    const updated = current.filter(p => p.id !== projectId);
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

/* =========================================================================
   USER FOLLOWED CREATORS ISOLATION
   ========================================================================= */

export function getIsolatedFollowedCreators() {
  const key = getScopedKey('followed_creators');
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : ['creator-babhelluq50', 'creator-kulokale', 'creator-aplumstudio'];
  } catch (e) {
    return ['creator-babhelluq50', 'creator-kulokale'];
  }
}

export function toggleIsolatedFollowedCreator(creatorId) {
  const key = getScopedKey('followed_creators');
  try {
    const current = getIsolatedFollowedCreators();
    const isFollowed = current.includes(creatorId);
    const updated = isFollowed 
      ? current.filter(id => id !== creatorId) 
      : [...current, creatorId];
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}
