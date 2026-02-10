const collectAllStyles = () => {
  let styles = "";
  document.querySelectorAll("style").forEach((style) => {
    styles += style.outerHTML;
  });
  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      if (sheet.cssRules) {
        Array.from(sheet.cssRules).forEach((rule) => {
          styles += `<style>${rule.cssText}</style>`;
        });
      }
    } catch (e) {}
  });

  return styles;
};

export { collectAllStyles };
