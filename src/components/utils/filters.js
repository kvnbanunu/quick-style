export function isSelectableElement(target) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.closest("#quickstyle-editor")) return false;
  if (target.closest("[quickstyle-overlay='true']")) return false;
  if (target.closest("[quickstyle-ignore='true']")) return false;

  return true;
}