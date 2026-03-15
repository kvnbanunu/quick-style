export function shouldLockDimensions(el) {
  return !(
    el instanceof HTMLImageElement ||
    el instanceof HTMLVideoElement ||
    el instanceof HTMLCanvasElement ||
    el instanceof SVGElement
  );
}

export function canUseParentContainer(el) {
  const parent = el?.parentElement;
  if (!(parent instanceof HTMLElement)) return false;

  const isLayoutRoot =
    parent === document.body ||
    parent === document.documentElement ||
    parent.id === "root";

  if (isLayoutRoot) return false;

  const parentStyle = window.getComputedStyle(parent);
  return parentStyle.display !== "inline" && parentStyle.display !== "contents";
}

export function ensureParentContains(el) {
  if (!canUseParentContainer(el)) return;

  const parent = el.parentElement;
  if (!(parent instanceof HTMLElement)) return;

  const parentRect = parent.getBoundingClientRect();
  const childRect = el.getBoundingClientRect();

  let newWidth = parentRect.width;
  let newHeight = parentRect.height;

  const overflowRight = childRect.right - parentRect.right;
  const overflowBottom = childRect.bottom - parentRect.bottom;

  if (overflowRight > 0) newWidth += overflowRight;
  if (overflowBottom > 0) newHeight += overflowBottom;

  if (overflowRight > 0 || overflowBottom > 0) {
    parent.style.width = Math.ceil(newWidth) + "px";
    parent.style.height = Math.ceil(newHeight) + "px";
  }
}