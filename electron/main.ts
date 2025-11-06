import { app, BrowserWindow } from "electron";
import { createMainWindow } from "./windows/mainWindow";
import { registerWindowHandlers } from "./ipcs/windowHandlers";

// Đăng ký các IPC handlers trước khi tạo window
registerWindowHandlers();

app.whenReady().then(createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
