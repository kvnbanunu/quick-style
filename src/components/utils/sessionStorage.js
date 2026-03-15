export function setStorage(key, value) {
  sessionStorage.setItem(key, value);
}

export function getStorage(key) {
  return sessionStorage.getItem(key);
}

export function removeStorage(key) {
  sessionStorage.removeItem(key);
}

export const storageKeys = ["quick-style-isOpen", "quick-style-selected"];

export function clearStorage() {
  for (const key in storageKeys) {
    removeStorage(key);
  }
}
