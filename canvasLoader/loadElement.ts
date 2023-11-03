export function loadElement(canvas: HTMLElement | string): HTMLElement {
  let element: HTMLElement | null = null;
  if (typeof canvas == "string") {
    element = document.querySelector(canvas);
  } else if (canvas instanceof HTMLElement) {
    element = canvas;
  }

  if (element === null) {
    throw new Error("Elementを取得できませんでした。");
  }

  return element;
}
