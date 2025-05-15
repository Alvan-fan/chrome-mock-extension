import { STORE_KEY, CONTENT_SCRIPT_ID } from './constant';

export const getStore = async (): Promise<any> => {
  const store = await chrome.storage.local.get(STORE_KEY);
  return store[STORE_KEY];
};

export const setStore = async (store: any) => {
  await chrome.storage.local.set({ [STORE_KEY]: store });
};

export const initStore = async () => {
  const initStore = {
    mock: [],
    settings: {
      enabledHosts: {},
    },
  };
  const store = await getStore();
  if (!store) {
    setStore(initStore);
  }
};

export const destroy = () => {
  const script = document.getElementById(CONTENT_SCRIPT_ID);
  script?.parentNode?.removeChild(script);
};
