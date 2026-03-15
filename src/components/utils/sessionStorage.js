export function setStorage(key, value) {
  sessionStorage.setItem(key, value);
}

export function getStorage(key) {
  return sessionStorage.getItem(key);
}

export function removeStorage(key) {
  sessionStorage.removeItem(key);
}

export const storageKeys = [
  "quick-style-isOpen",
  "quick-style-selected",
  "quick-style-edits",
  "quick-style-changes",
  "quick-style-scroll-position",
];

export function clearStorage() {
  for (const key in storageKeys) {
    removeStorage(key);
  }
}
