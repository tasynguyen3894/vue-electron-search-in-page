import { INVOKE_KEY, ELECONTRON_WINDOW_KEY } from '../constant';

export function setupSearchInPagePreload(context: Electron.ContextBridge, ipcRenderer: Electron.IpcRenderer) {
  context.exposeInMainWorld(ELECONTRON_WINDOW_KEY, {
    [INVOKE_KEY](args: any) {
      return ipcRenderer.invoke(INVOKE_KEY, args);
    }
  });
}
