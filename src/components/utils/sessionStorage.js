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

export function storeEdit(session, key, type, obj) {
  const store = getMapFromStorage(session);
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
  setStorage(session, storeStr);
}

export function storeChange(session, key, type, obj) {
  const store = getMapFromStorage(session);
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
  setStorage(session, storeStr);
}
