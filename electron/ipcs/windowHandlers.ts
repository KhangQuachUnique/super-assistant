import { ipcMain, BrowserWindow, IpcMainEvent } from "electron";

let lastMoveTime = 0;
const MOVE_THROTTLE = 4; // ~240 FPS

export function registerWindowHandlers() {
  ipcMain.on(
    "move-window",
    (event: IpcMainEvent, { screenX, screenY, mouseOffsetX, mouseOffsetY }) => {
      const win = BrowserWindow.fromWebContents(event.sender);
      if (!win || win.isDestroyed()) return;

      // Throttle để tránh overload
      const now = Date.now();
      if (now - lastMoveTime < MOVE_THROTTLE) return;
      lastMoveTime = now;

      const x = Math.round(screenX - mouseOffsetX);
      const y = Math.round(screenY - mouseOffsetY);

      // Dùng setPosition thay vì setBounds để tránh thay đổi kích thước
      win.setBounds({ x, y, width: 500, height: 500 });
    }
  );
}
