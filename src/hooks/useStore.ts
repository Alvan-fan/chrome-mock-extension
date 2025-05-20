import { useEffect, useState } from 'react';
import {
  getStoreValue,
  getUpdatedValue,
  setStoreValue,
} from '../utils/storage';

// eslint-disable-next-line max-len
export const useStore = <Key extends string>(
  key: Key
): [any, (val: any) => Promise<void>] => {
  const [value, setValue] = useState<any | null>(null);

  const updateValue = async (val: any): Promise<void> => {
    setValue(val);
    await setStoreValue(key, val);
    window.dispatchEvent(new Event('storage'));
  };

  if (chrome.storage) {
    chrome.storage.onChanged.addListener(async (data) => {
      const newValue = getUpdatedValue(data as any, key);
      if (newValue) {
        setValue(newValue);
      }
    });
  }

  const handleChangeStore = () => {
    getStoreValue(key).then((data: any) => {
      setValue(data);
    });
  };

  useEffect(() => {
    handleChangeStore();

    window.addEventListener('storage', handleChangeStore);
    return () => window.removeEventListener('storage', handleChangeStore);
  }, [key]);

  return [value, updateValue];
};
