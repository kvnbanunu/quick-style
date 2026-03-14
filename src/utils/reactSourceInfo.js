export function getReactSourceInfo(el) {
  // React 19+
  const dataSrc =
    el.getAttribute("data-qs-src") ||
    el.closest("[data-qs-src]")?.getAttribute("data-qs-src");

  if (dataSrc) {
    const [fileName, lineNumber, columnNumber] = dataSrc.split("#");
    return {
      fileName,
      lineNumber: parseInt(lineNumber),
      columnNumber: parseInt(columnNumber),
    };
  }
}
