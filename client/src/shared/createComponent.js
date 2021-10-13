const createComponent = (tag, props, children) => {
  const element = document.createElement(tag);

  if (typeof props == "object" && props != null) {
    Object.entries(props).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((node) => {
      element.appendChild(node);
    });
  } else {
    element.appendChild(document.createTextNode(children));
  }
  return element;
};

export { createComponent };
