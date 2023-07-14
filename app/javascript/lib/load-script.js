const loadScript = (url) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.head.appendChild(script);
    script.onload = resolve;
  });
};

export { loadScript };
