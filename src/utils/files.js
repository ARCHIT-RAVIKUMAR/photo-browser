// Pure helpers: turning a FileList into photo records. No React in here.
const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'bmp', 'svg']);

const extOf = (name) => name.slice(name.lastIndexOf('.') + 1).toLowerCase();

export function isSupportedImage(file) {
  return IMAGE_EXT.has(extOf(file.name)) && (!file.type || file.type.startsWith('image/'));
}

/**
 * Splits a FileList into photos and a summary of what was skipped.
 * Only lightweight metadata is stored; File objects are kept by reference
 * and are never read until a cell becomes visible.
 */
export function scanFiles(fileList) {
  const photos = [];
  let skipped = 0;
  const skippedTypes = {};

  for (const file of fileList) {
    if (file.name.startsWith('.')) continue; // hidden files like .DS_Store
    if (isSupportedImage(file)) {
      const path = file.webkitRelativePath || file.name;
      photos.push({ id: 0, file, name: file.name, path, size: file.size, modified: file.lastModified });
    } else {
      skipped++;
      const e = extOf(file.name) || 'no extension';
      skippedTypes[e] = (skippedTypes[e] || 0) + 1;
    }
  }

  photos.sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }));
  photos.forEach((p, i) => (p.id = i));
  return { photos, skipped, skippedTypes, total: photos.length + skipped };
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let v = bytes / 1024, i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v < 10 ? 1 : 0)} ${units[i]}`;
}

const SORTERS = {
  name: (a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }),
  size: (a, b) => b.size - a.size,
  newest: (a, b) => b.modified - a.modified,
  oldest: (a, b) => a.modified - b.modified,
};

// Returns a new sorted array; the original list is left untouched.
export function sortPhotos(photos, key) {
  return [...photos].sort(SORTERS[key] || SORTERS.name);
}

export function filterPhotos(photos, query) {
  const q = query.trim().toLowerCase();
  return q ? photos.filter((p) => p.path.toLowerCase().includes(q)) : photos;
}
