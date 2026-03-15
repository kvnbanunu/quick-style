// Client-side helper for sending newly typed classes to the dev server runtime.
// In production builds import.meta.hot is undefined, so this becomes a no-op.
export function sendClass(cls) {
  if (!cls) return;
  if (import.meta.hot) {
    import.meta.hot.send("tw:class", cls);
  }
}
