import { destroy } from '../utils';
import { initStore, getStore } from '../utils/storage';
import { listenMessage } from '../utils/message';

listenMessage<any>('requestIntercepted', async (message) => {
  try {
    const store = await getStore();
    sendMessage<any>('requestChecked', {
      messageId: message.messageId,
      headers: message.headers,
      mock: store.mocks,
    });
  } catch (err) {
    sendMessage<any>('requestChecked', {
      messageId: message.messageId,
      headers: {},
    });
  }
});

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    try {
      destroy();
      const s = document.createElement('script');
      s.type = 'module';
      s.id = 'mockInterceptor';
      s.src = chrome.runtime.getURL('services.js');
      (document.head || document.documentElement).appendChild(s);

      initStore();
    } catch (error) {
      console.error('Failed to setup mock interceptor:', error);
    }
  },
});
