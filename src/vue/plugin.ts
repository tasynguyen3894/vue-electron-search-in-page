import { Plugin, App, ref, Ref, inject } from 'vue';

import { INVOKE_KEY, ELECONTRON_WINDOW_KEY } from '../constant';

export const injectKey = Symbol('findInPage');

type SearchInPageData = {
  currentSearchWord: Ref<string | undefined>,
  isSearching: Ref<boolean>,
  matches: Ref<number>
  startSearch: (search: string) => void
}

export function useSearchInPage(): SearchInPageData {
  return inject(injectKey) as SearchInPageData;
}

export function createSearchInPagePlugin(): Plugin {
  return {
    install(app: App) {
      const currentSearchWord = ref<string | undefined>(undefined);
      const isSearching = ref<boolean>(false);
      const matches = ref<number>(0);
      
      app.provide<SearchInPageData>(injectKey, {
        currentSearchWord,
        isSearching,
        matches,
        startSearch
      });

      function startSearch(value: string) {
        window[ELECONTRON_WINDOW_KEY][INVOKE_KEY]({ type: 'startSearch', value })
          .then((result: any) => {
            currentSearchWord.value = value;
            isSearching.value = true;
            if(typeof result === 'number') {
              matches.value = result;
            }
          })
      }

      app.config.globalProperties.$searchInPage = {
        currentSearchWord,
        isSearching,
        matches,
        startSearch
      }
    }
  }
}
