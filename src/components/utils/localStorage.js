export function setStorage(key, value) {
  localStorage.setItem(key, value);
}

export function getStorage(key) {
  return localStorage.getItem(key);
}

export function removeStorage(key) {
  localStorage.removeItem(key);
}

export const localStorageKeys = ["quick-style-isOpen", "quick-style-selected"];

export function clearStorage() {
  for (const key in localStorageKeys) {
    removeStorage(key);
  }
}

