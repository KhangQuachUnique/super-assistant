import { ipcMain, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
function initWindowDrag(win2, width = 300, height = 300) {
  ipcMain.on(
    "move-window",
    (event, { screenX, screenY, mouseOffsetX, mouseOffsetY }) => {
      if (!win2) return;
      win2.setBounds({
        x: screenX - mouseOffsetX,
        y: screenY - mouseOffsetY,
        width,
        height
      });
    }
  );
}
const WIDTH = 500;
const HEIGHT = 500;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: WIDTH,
    height: HEIGHT,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  initWindowDrag(win, WIDTH, HEIGHT);
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.on(
  "move-window",
  (event, { screenX, screenY, mouseOffsetX, mouseOffsetY }) => {
    if (!win) return;
    win.setBounds({
      x: screenX - mouseOffsetX,
      y: screenY - mouseOffsetY,
      width: WIDTH,
      height: HEIGHT
    });
  }
);
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
