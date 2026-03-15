import { getMapFromStorage, removeStorage } from "./sessionStorage";

export async function saveChanges(endpoint, obj) {
  await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  })
    .then((res) => res.json())
    .then((data) => console.log("Backend response:", data))
    .catch(console.error);
}

export async function saveAll() {
  const store = getMapFromStorage("quick-style-changes");
  if (store.size === 0) return;

  for (const [key, val] of store) {
    if (val.changeClass !== null) {
      await saveChanges("/api/update-element", val.changeClass);
    }
    if (val.changeFull !== null) {
      await saveChanges("/api/update-full-element", val.changeFull);
    }
  }

  removeStorage("quick-style-isOpen");
  removeStorage("quick-style-selected");
  removeStorage("quick-style-edits");
  removeStorage("quick-style-changes");
}
