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
  "quick-style-editor-side",
];

export function clearStorage() {
  for (const key in storageKeys) {
    removeStorage(key);
  }
}

export function getMapFromStorage(key) {
  const store = getStorage(key);
  if (store !== null) {
    return new Map(JSON.parse(store));
  }
  return new Map();
}

export function storeEdit(key, type, obj) {
  const store = getMapFromStorage("quick-style-edits");
  if (store.size > 0) {
    if (store.has(key)) {
      const curr = store.get(key);
      curr[type] = obj;
      store.delete(key);
      store.set(key, curr);
    } else {
      const temp = { editClass: null, editText: null };
      temp[type] = obj;
      store.set(key, temp);
    }
  } else {
    const temp = { editClass: null, editText: null };
    temp[type] = obj;
    store.set(key, temp);
  }
  const storeStr = JSON.stringify([...store]);
  setStorage("quick-style-edits", storeStr);
}

export function storeChange(key, type, obj) {
  const store = getMapFromStorage("quick-style-changes");
  if (store.size > 0) {
    if (store.has(key)) {
      const curr = store.get(key);
      curr[type] = obj;
      store.delete(key);
      store.set(key, curr);
    } else {
      const temp = { changeClass: null, changeFull: null };
      temp[type] = obj;
      store.set(key, temp);
    }
  } else {
    const temp = { changeClass: null, changeFull: null };
    temp[type] = obj;
    store.set(key, temp);
  }

  const storeStr = JSON.stringify([...store]);
  setStorage("quick-style-changes", storeStr);
}
