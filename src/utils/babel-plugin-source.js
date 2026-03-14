export default function ({ types: t }) {
  return {
    visitor: {
      JSXOpeningElement(path, state) {
        const name = path.node.name;
        // Only native DOM elements (lowercase), not React components
        if (!t.isJSXIdentifier(name) || /^[A-Z]/.test(name.name)) return;

        const { filename } = state.file.opts;
        const { line, column } = path.node.loc?.start ?? {};
        if (!line) return;

        // Avoid adding if already present
        const alreadyHas = path.node.attributes.some(
          (a) =>
            t.isJSXAttribute(a) &&
            t.isJSXIdentifier(a.name, { name: "data-qs-src" }),
        );
        if (alreadyHas) return;

        path.node.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier("data-qs-src"),
            t.stringLiteral(`${filename}#${line}#${column}`),
          ),
        );
      },
    },
  };
}
