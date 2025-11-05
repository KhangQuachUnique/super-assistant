import { BrowserWindow, ipcMain } from "electron";

export function initWindowDrag(win: BrowserWindow, width = 300, height = 300) {
  let lastMoveTime = 0;
  const MOVE_THROTTLE = 8; // Giới hạn ~120 FPS

  ipcMain.on(
    "move-window",
    (_event, { screenX, screenY, mouseOffsetX, mouseOffsetY }) => {
      if (!win) return;

      // Throttle để tránh overload
      const now = Date.now();
      if (now - lastMoveTime < MOVE_THROTTLE) return;
      lastMoveTime = now;

      win.setBounds({
        x: screenX - mouseOffsetX,
        y: screenY - mouseOffsetY,
        width,
        height,
      });
    }
  );
}
