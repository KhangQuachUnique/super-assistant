import { BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const WIDTH = 500;
export const HEIGHT = 500;

export let mainWindow: BrowserWindow | null = null;

export const createMainWindow = () => {
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
      contextIsolation: true,
    },
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
