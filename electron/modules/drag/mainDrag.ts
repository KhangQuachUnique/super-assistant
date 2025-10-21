import { BrowserWindow, ipcMain } from "electron";

export function initWindowDrag(win: BrowserWindow, width = 300, height = 300) {
  ipcMain.on(
    "move-window",
    (event, { screenX, screenY, mouseOffsetX, mouseOffsetY }) => {
      if (!win) return;

      win.setBounds({
        x: screenX - mouseOffsetX,
        y: screenY - mouseOffsetY,
        width,
        height,
      });
    }
  );
}
