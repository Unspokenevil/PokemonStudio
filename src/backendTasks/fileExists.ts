import Electron, { IpcMainEvent } from "electron";
import fs from "fs";

const fileExists = (event: IpcMainEvent, payload: { filePath: string }) => {
  console.info("file-exists");
  try {
    const result = fs.existsSync(payload.filePath);
    console.info("file-exists/success", { result });
    return event.sender.send("file-exists/success", { result });
  } catch (error) {
    console.error("file-exists/failure", error);
    event.sender.send("file-exists/failure", { errorMessage: `${error instanceof Error ? error.message : error}` });
  }
};

export const registerFileExists = (ipcMain: Electron.IpcMain) => {
  ipcMain.on("file-exists", fileExists);
};
