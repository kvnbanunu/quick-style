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
  "quick-style-undo-stack",
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
      const temp = {
        editClass: null,
        editText: null,
        addChild: null,
        addAtt: null,
        rmAtt: null,
        delete: null,
      };
      temp[type] = obj;
      store.set(key, temp);
    }
  } else {
    const temp = {
      editClass: null,
      editText: null,
      addChild: null,
      addAtt: null,
      rmAtt: null,
      delete: null,
    };
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
      const temp = { changeClass: null, changeFull: null, delete: null };
      temp[type] = obj;
      store.set(key, temp);
    }
  } else {
    const temp = { changeClass: null, changeFull: null, delete: null };
    temp[type] = obj;
    store.set(key, temp);
  }

  const storeStr = JSON.stringify([...store]);
  setStorage("quick-style-changes", storeStr);
}

function cloneSerializable(value) {
  if (value === null || value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
}

export function captureElementState(el) {
  if (!el) return null;

  return {
    className: el.getAttribute("class") || "",
    innerHTML: el.innerHTML,
    hidden: !!el.hidden,
    attributes: Array.from(el.attributes || []).map((attr) => [
      attr.name,
      attr.value,
    ]),
  };
}

export function restoreElementState(el, state) {
  if (!el || !state) return;

  const keepAttrs = new Set(["data-qs-src"]);
  for (const attr of Array.from(el.attributes || [])) {
    if (!keepAttrs.has(attr.name)) {
      el.removeAttribute(attr.name);
    }
  }

  for (const [name, value] of state.attributes || []) {
    if (name === "data-qs-src") continue;
    el.setAttribute(name, value);
  }

  el.hidden = !!state.hidden;
  el.innerHTML = state.innerHTML || "";
}

export function pushUndoSnapshot(key, element) {
  if (!key || !element) return;

  const edits = getMapFromStorage("quick-style-edits");
  const changes = getMapFromStorage("quick-style-changes");

  const snapshot = {
    key,
    state: captureElementState(element),
    prevEdit: edits.has(key) ? cloneSerializable(edits.get(key)) : null,
    prevChange: changes.has(key) ? cloneSerializable(changes.get(key)) : null,
  };

  const stackRaw = getStorage("quick-style-undo-stack");
  const stack = stackRaw ? JSON.parse(stackRaw) : [];
  stack.push(snapshot);

  const MAX_STACK_SIZE = 100;
  const limited =
    stack.length > MAX_STACK_SIZE ? stack.slice(-MAX_STACK_SIZE) : stack;
  setStorage("quick-style-undo-stack", JSON.stringify(limited));
}

export function popUndoSnapshot() {
  const stackRaw = getStorage("quick-style-undo-stack");
  if (!stackRaw) return null;

  const stack = JSON.parse(stackRaw);
  if (!Array.isArray(stack) || stack.length === 0) return null;

  const snapshot = stack.pop();
  setStorage("quick-style-undo-stack", JSON.stringify(stack));
  return snapshot;
}
