import { BrowserWindow, ipcMain, app } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WIDTH = 500;
const HEIGHT = 500;
let mainWindow = null;
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, "/preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
  const APP_ROOT = path.join(__dirname, "..", "..");
  const RENDERER_DIST = path.join(APP_ROOT, "dist");
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  return mainWindow;
};
let lastMoveTime = 0;
const MOVE_THROTTLE = 4;
function registerWindowHandlers() {
  ipcMain.on(
    "move-window",
    (event, { screenX, screenY, mouseOffsetX, mouseOffsetY }) => {
      const win = BrowserWindow.fromWebContents(event.sender);
      if (!win || win.isDestroyed()) return;
      const now = Date.now();
      if (now - lastMoveTime < MOVE_THROTTLE) return;
      lastMoveTime = now;
      const x = Math.round(screenX - mouseOffsetX);
      const y = Math.round(screenY - mouseOffsetY);
      win.setBounds({ x, y, width: 500, height: 500 });
    }
  );
}
registerWindowHandlers();
app.whenReady().then(createMainWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
