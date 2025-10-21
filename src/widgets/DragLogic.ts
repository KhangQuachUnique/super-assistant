export function initDrag(
  element: HTMLElement,
  electronAPI: {
    moveWindow: (
      x: number,
      y: number,
      offsetX: number,
      offsetY: number
    ) => void;
  }
) {
  let isDragging = false;
  let mouseOffsetX = 0;
  let mouseOffsetY = 0;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    mouseOffsetX = e.screenX - window.screenX;
    mouseOffsetY = e.screenY - window.screenY;
    element.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    electronAPI.moveWindow(e.screenX, e.screenY, mouseOffsetX, mouseOffsetY);
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    element.style.cursor = "grab";
  });
}
