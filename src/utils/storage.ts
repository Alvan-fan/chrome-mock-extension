import { STORE_KEY } from './constant';
import { isObject } from './index';
import { storage } from '#imports';

const emptyStore: any = {
  mocks: [],
  settings: {
    enabledHosts: {},
  },
};

const getLocalStorage = async (): Promise<any | undefined> => {
  const data = await storage.getItem(`local:${STORE_KEY}`);
  return data ? JSON.parse(data as string) : undefined;
};

const getExtensionStore = async (): Promise<any | undefined> => {
  const response = await chrome.storage.local.get(STORE_KEY);
  return response[STORE_KEY] as any;
};

export const getStore = async (): Promise<any> => {
  let store: any | undefined;

  if (import.meta.env.VITE_NODE_ENV === 'development') {
    store = await getLocalStorage();
  } else {
    store = await getExtensionStore();
  }

  return store ?? emptyStore;
};

export const setStore = async (store: any): Promise<void> => {
  if (import.meta.env.VITE_NODE_ENV === 'development') {
    await storage.setItem(`local:${STORE_KEY}`, JSON.stringify(store));
  } else {
    await chrome.storage.local.set({ [STORE_KEY]: store });
  }
};

export const getUpdatedValue = <StoreKey extends string>(
  update: any,
  key: StoreKey
): any | null => {
  const { newValue, oldValue } = update[STORE_KEY];
  const oldValString = JSON.stringify(oldValue[key]);
  const newValString = JSON.stringify(newValue[key]);

  if (oldValString === newValString) {
    return null;
  }

  return newValue[key];
};

export const getStoreValue = async <StoreKey extends string>(
  key: StoreKey
): Promise<any> => {
  const store = await getStore();
  return store[key];
};

export const setStoreValue = async <StoreKey extends string>(
  key: StoreKey,
  value: any
): Promise<void> => {
  const store = await getStore();

  const newStore: any = {
    ...store,
    [key]: value,
  };

  await setStore(newStore);
};

export const initStore = async <StoreKey extends string>(): Promise<any> => {
  const initialStore = structuredClone(emptyStore);
  const store = await getStore();

  Object.keys(initialStore).forEach((key) => {
    const k = key as StoreKey;
    const existingValue = store[k];

    if (existingValue && k !== 'network') {
      if (isObject(existingValue)) {
        initialStore[k] = { ...initialStore[k], ...existingValue };
      } else {
        initialStore[k] = existingValue;
      }
    }
  });

  await setStore(initialStore);
  return initialStore;
};
