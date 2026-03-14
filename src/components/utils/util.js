// Converts an HTML string into live DOM elements in the document
export function stringToHTMLElements(str) {
  if (!str) return null;

  // Wrap in a temporary container to parse HTML
  const wrapper = document.createElement("div");
  wrapper.innerHTML = str;

  // Try to find each child in the document
  for (const child of wrapper.children) {
    const el = findElementByOuterHTML(child.outerHTML);
    if (el) return el; // return the first matching live element
  }

  return null; // nothing found
}

// Find a live element in the document that matches the outerHTML string
function findElementByOuterHTML(htmlString) {
  if (!htmlString) return null;

  const elements = document.body.querySelectorAll("*"); // all elements in body
  for (const el of elements) {
    if (el.outerHTML === htmlString) {
      return el; // found the live element
    }
  }
  return null; // no match
}