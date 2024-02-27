import { BrowserWindow, Event, IpcMain, Result } from 'electron';

import { INVOKE_KEY } from '../constant';

type FoundInPageCallback = (_: Event, result: Result) => void

export class SearchInPage {
  protected browserWindow: BrowserWindow;
  protected ipcMain: IpcMain;
  protected searchWord: string | undefined;
  protected isSearching = false;
  protected searchRequestId: number | null = null;
  protected handler: FoundInPageCallback | null = null;

  constructor(browserWindow: BrowserWindow, ipcMain: IpcMain) {
    this.browserWindow = browserWindow;
    this.ipcMain = ipcMain;
  }

  public changeBrowserWindow(browserWindow: BrowserWindow) {
    this.browserWindow = browserWindow;
  }

  protected startSearch(searchWord: string) {
    if(this.isSearching) {
      this.stopSearch();
    }
    this.searchWord = searchWord;
    this.isSearching = true;
    this.searchInPage(searchWord);
  }

  protected searchNext() {
    if(this.isSearching && this.searchWord) {
      this.searchInPage(this.searchWord, true)
    }
  }

  protected searchPrev() {
    if(this.isSearching && this.searchWord) {
      this.searchInPage(this.searchWord, false)
    }
  }

  protected searchInPage(searchWord: string, forward?: boolean) {
    const parameters: [string, { findNext: boolean, forward: boolean }?] = [searchWord];
    if(forward !== undefined) {
      parameters[1] = {
        findNext: true,
        forward
      }
    }
    this.searchRequestId = this.browserWindow.webContents.findInPage(...parameters);
  }

  protected stopSearch() {
    this.browserWindow.webContents.stopFindInPage('clearSelection');
    this.isSearching = false;
    this.searchWord = undefined;
    this.searchRequestId = null;
  }

  public setup() {
    this.ipcMain.handle(INVOKE_KEY, (_, args: { type: 'startSearch' | 'searchNext' | 'searchPrev' | 'stopSearch', value?: string }) => {
      const { type, value } = args;
      switch (type) {
        case 'startSearch':
          if(value) {
            this.startSearch(value);
            return new Promise<{
              matches: number
            }>((resolve) => {
              if(this.handler) {
                this.browserWindow.webContents.removeListener('found-in-page', this.handler);
              }
              const handler: FoundInPageCallback = (_: Event, result: Result) => {
                resolve({
                  matches: result.matches
                })
              }
              this.handler = handler;
              this.browserWindow.webContents.on('found-in-page', handler)
            })
          }
          break;
        case 'searchNext':
          this.searchNext();
          return Promise.resolve();
        case 'searchPrev':
          this.searchPrev();
          return Promise.resolve();
        case 'stopSearch':
          this.stopSearch();
          return Promise.resolve();
        default:
          return Promise.resolve();
      }
    })
  }
}