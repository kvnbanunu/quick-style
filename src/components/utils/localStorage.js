export function setStorage(key, value) {
  localStorage.setItem(key, value);
}

export function getStorage(key) {
  return localStorage.getItem(key);
}