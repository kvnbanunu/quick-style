export default function ElementTraverser({ selected, selectElement, hoverBoxRef, selectBoxRef }) {
  function getSelectableElements() {
    const panel = document.getElementById("quickstyle-editor");

    return Array.from(document.body.querySelectorAll("*")).filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      if (panel && panel.contains(el)) return false;
      if (el === hoverBoxRef.current || el === selectBoxRef.current) return false;
      if (["HTML", "BODY", "HEAD", "SCRIPT", "STYLE", "LINK", "META"].includes(el.tagName)) return false;

      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
  }

  function buildNearestVisualOrder(elements) {
    if (elements.length <= 1) return elements;

    const centers = new Map(
      elements.map((el) => {
        const rect = el.getBoundingClientRect();
        return [el, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }];
      })
    );

    const remaining = [...elements].sort((a, b) => {
      const aCenter = centers.get(a);
      const bCenter = centers.get(b);
      return aCenter.y - bCenter.y || aCenter.x - bCenter.x;
    });

    const ordered = [remaining.shift()];

    while (remaining.length > 0) {
      const last = ordered[ordered.length - 1];
      const lastCenter = centers.get(last);

      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (let i = 0; i < remaining.length; i += 1) {
        const candidateCenter = centers.get(remaining[i]);
        const dx = candidateCenter.x - lastCenter.x;
        const dy = candidateCenter.y - lastCenter.y;
        const distance = dx * dx + dy * dy;

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      ordered.push(remaining.splice(nearestIndex, 1)[0]);
    }

    return ordered;
  }

  function cycleSelection(direction) {
    const orderedElements = buildNearestVisualOrder(getSelectableElements());
    if (orderedElements.length === 0) return;

    const currentIndex = selected ? orderedElements.indexOf(selected) : -1;
    const nextIndex =
      currentIndex === -1
        ? direction === 1
          ? 0
          : orderedElements.length - 1
        : (currentIndex + direction + orderedElements.length) % orderedElements.length;

    selectElement(orderedElements[nextIndex]);
  }

  return (
    <div className="flex gap-2">
      <button type="button" onClick={() => cycleSelection(-1)}>
        Prev element
      </button>
      <button type="button" onClick={() => cycleSelection(1)}>
        Next element
      </button>
    </div>
  );
}
