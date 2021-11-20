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
      if (!args?.filePath) throw new Error("No filePath was provided");

      const { filePath } = args;

      callback(args)
        .then((res) => {
          event.sender.send(eventType, filePath, res, true);
        })
        .catch((err) => {
          event.sender.send(eventType, filePath, err, false);
        });
    });
  });
};

// export const useFileGateway = <T extends FileGatewayKeys>(
//   ipcRenderer: Electron.IpcRenderer,
//   gateway: T,
//   args: Parameters<typeof fileGateways[T]>[0],
//   onResult: (
//     filePath: string,
//     res: Awaited<ReturnType<typeof fileGateways[T]>>,
//     event: IpcRendererEvent,
//   ) => void,
//   onError?: (filePath: string, error: any, event: IpcRendererEvent) => void,
//   onFinal?: (filePath: string, event: IpcRendererEvent) => void,
// ) => {
//   const eventType = getEventType(gateway);
//
//   // Add the event listener for the response from the main process
//   ipcRenderer.on(eventType, (event, filePath: string, arg: any, isSuccess: boolean) => {
//     if (isSuccess) {
//       onResult(filePath, arg, event);
//     } else {
//       onError?.(filePath, arg, event);
//     }
//
//     onFinal?.(filePath, event);
//   });
//
//   // Send information to the main process
//   // if a listener has been set, then the main process
//   // will react to the request !
//   ipcRenderer.send(eventType, args);
// };

type FileGatewayOutput<T> = [filePath: string, res: T, event: IpcRendererEvent];

// TODO: ADD CUSTOM STATIC CLASS TO SOLVE ONE GATEWAY EVENT SUBSCRIPTION.
export const useFileGateway = <T extends FileGatewayKeys>(
  ipcRenderer: Electron.IpcRenderer,
  gateway: T,
  args: Parameters<typeof fileGateways[T]>[0],
  onResult?: (
    filePath: string,
    res: Awaited<ReturnType<typeof fileGateways[T]>>,
    event: IpcRendererEvent,
  ) => void,
  onError?: (filePath: string, error: any, event: IpcRendererEvent) => void,
  onFinal?: (filePath: string, event: IpcRendererEvent) => void,
): Promise<FileGatewayOutput<Awaited<ReturnType<typeof fileGateways[T]>>>> => {
  const eventType = getEventType(gateway);

  // Send information to the main process
  // if a listener has been set, then the main process
  // will react to the request!
  ipcRenderer.send(eventType, args);

  return new Promise<FileGatewayOutput<Awaited<ReturnType<typeof fileGateways[T]>>>>(
    (resolve, reject) => {
      // Add the event listener for the response from the main process
      ipcRenderer.on(eventType, (event, filePath: string, arg: any, isSuccess: boolean) => {
        if (isSuccess) {
          resolve([filePath, arg, event]);
          onResult?.(filePath, arg, event);
        } else {
          reject({ filePath, error: arg, event });
          onError?.(filePath, arg, event);
        }

        onFinal?.(filePath, event);
      });
    },
  );
};
