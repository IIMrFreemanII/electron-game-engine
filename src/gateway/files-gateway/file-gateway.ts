import { IpcRendererEvent } from "electron";

import { readFileGateway } from "./read-file";

export type FileGatewayKeys = keyof typeof fileGateways;

const fileGateWayKey = "file-gateway/";

const getEventType = (type: string) => fileGateWayKey + type;

export const fileGateways = {
  readFile: readFileGateway,
};

export const subscribeOnFileGateway = (ipcMain: Electron.IpcMain) => {
  Object.entries(fileGateways).forEach(([type, callback]) => {
    const eventType = getEventType(type);

    ipcMain.on(eventType, async (event, args) => {
      callback(args)
        .then((res) => {
          event.sender.send(eventType, res, true);
        })
        .catch((err) => {
          event.sender.send(eventType, err, false);
        });
    });
  });
};

export const useFileGateway = <T extends FileGatewayKeys>(
  ipcRenderer: Electron.IpcRenderer,
  gateway: T,
  args: Parameters<typeof fileGateways[T]>[0],
  onResult: (res: Awaited<ReturnType<typeof fileGateways[T]>>, event: IpcRendererEvent) => void,
  onError?: (error: any, event: IpcRendererEvent) => void,
  onFinal?: (event: IpcRendererEvent) => void,
) => {
  const eventType = getEventType(gateway);

  // Add the event listener for the response from the main process
  ipcRenderer.on(eventType, (event, arg, isSuccess: boolean) => {
    if (isSuccess) {
      onResult(arg, event);
    } else {
      onError?.(arg, event);
    }

    onFinal?.(event);
  });

  // Send information to the main process
  // if a listener has been set, then the main process
  // will react to the request !
  ipcRenderer.send(eventType, args);
};
