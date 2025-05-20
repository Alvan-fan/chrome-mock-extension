import { EXTENSION_NAME } from './constant';

export const sendMessage = <T>(type: any, message: T): void => {
  window.postMessage(
    {
      message,
      type,
      extensionName: EXTENSION_NAME,
    },
    '*'
  );
};

export const listenMessage = <T>(
  messageType: any,
  callback: (payload: T) => void
): void => {
  window.addEventListener('message', (event) => {
    const { data, source } = event;

    if (source !== window || typeof data !== 'object') return;
    if (data.type !== messageType || data.extensionName !== EXTENSION_NAME)
      return;

    callback(data.message);
  });
};
