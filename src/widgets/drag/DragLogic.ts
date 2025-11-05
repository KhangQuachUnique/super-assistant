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
  let rafId: number | null = null;
  let pendingMove: { x: number; y: number } | null = null;

  element.addEventListener("mousedown", (e) => {
    // Chỉ kích hoạt drag khi nhấn chuột TRÁI (button = 0)
    if (e.button !== 0) return;

    isDragging = true;
    mouseOffsetX = e.screenX - window.screenX;
    mouseOffsetY = e.screenY - window.screenY;
    element.style.cursor = "grabbing";
  });

  // Sử dụng requestAnimationFrame để throttle moves
  const performMove = () => {
    if (pendingMove) {
      electronAPI.moveWindow(
        pendingMove.x,
        pendingMove.y,
        mouseOffsetX,
        mouseOffsetY
      );
      pendingMove = null;
    }
    rafId = null;
  };

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    // Lưu vị trí mới nhất
    pendingMove = { x: e.screenX, y: e.screenY };

    // Chỉ schedule move nếu chưa có request pending
    if (!rafId) {
      rafId = requestAnimationFrame(performMove);
    }
  });

  window.addEventListener("mouseup", (e) => {
    // Chỉ xử lý mouseup cho chuột trái
    if (e.button !== 0) return;

    isDragging = false;
    element.style.cursor = "grab";

    // Cleanup pending animation frame
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    pendingMove = null;
  });
}
