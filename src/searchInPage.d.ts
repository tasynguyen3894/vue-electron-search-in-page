import { ELECONTRON_WINDOW_KEY, INVOKE_KEY } from './constant';

declare global {
  interface Window {
    [ELECONTRON_WINDOW_KEY]: {
      [INVOKE_KEY]: (a: any) => Promise<number>,
    }
  }
}
