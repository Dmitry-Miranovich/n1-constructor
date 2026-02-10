const collectAllStyles = () => {
  let styles = "";

  // Collect style tags
  document.querySelectorAll("style").forEach((style) => {
    styles += style.outerHTML;
  });

  // Collect from stylesheets
  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      if (sheet.cssRules) {
        Array.from(sheet.cssRules).forEach((rule) => {
          styles += `<style>${rule.cssText}</style>`;
        });
      }
    } catch (e) {
      // Skip cross-origin stylesheets
    }
  });

  return styles;
};

export { collectAllStyles };
