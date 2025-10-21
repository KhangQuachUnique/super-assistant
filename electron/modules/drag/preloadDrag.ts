import { contextBridge, ipcRenderer } from "electron";

export const initWindowDragAPI = () => {
  contextBridge.exposeInMainWorld("electronAPI", {
    moveWindow: (
      screenX: number,
      screenY: number,
      mouseOffsetX: number,
      mouseOffsetY: number
    ) =>
      ipcRenderer.send("move-window", {
        screenX,
        screenY,
        mouseOffsetX,
        mouseOffsetY,
      }),
  });
};
