import { nanoid } from 'nanoid';
import { BatchInterceptor } from '@mswjs/interceptors';
import { FetchInterceptor } from '@mswjs/interceptors/fetch';
import { XMLHttpRequestInterceptor } from '@mswjs/interceptors/XMLHttpRequest';

import { MessageBus } from '@/utils/messageBus';
import { sendMessage } from '@/utils/message';

const messageBus = new MessageBus();
const interceptor = new BatchInterceptor({
  name: 'mock',
  interceptors: [new FetchInterceptor(), new XMLHttpRequestInterceptor()],
});

const getRequestMocks = (url: string, method: string): Promise<any> => {
  const messageId = nanoid();
  const message = {
    messageId,
    url,
    method,
  };

  sendMessage<any>('requestIntercepted', message);

  return new Promise((resolve) => {
    messageBus.addListener(message.messageId, resolve);
  });
};

const applyInterceptor = () => {
  // 监听所有请求
  interceptor.on('request', async ({ request, controller }) => {
    console.log('Intercepted request:', request.url);
    try {
      const mocks = await getRequestMocks(request.url, request.method);
      const { url, response: mockData } = mocks.mock[0] || {
        url: '',
        response: '',
      };
      if (url === request.url) {
        // 将 mockData 转换为 JSON 对象
        const jsonMockData = parseMockData(mockData);

        const response = new Response(JSON.stringify(jsonMockData), {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
            'X-Mock-Response': 'true',
          },
        });
        controller.respondWith(response);
      }
    } catch (error) {
      console.error('Error creating mock response:', error);
      throw error;
    }
  });

  // 监听所有响应
  interceptor.on('response', async ({ response }) => {
    try {
      // 如果是 mock 响应，不需要再次处理
      if (response.headers.get('X-Mock-Response')) {
        console.log('Mock response detected, skipping further processing');
        return;
      }
    } catch (error) {
      console.error('Error processing response:', error);
    }
  });
};

listenMessage<any>('requestChecked', (message) => {
  messageBus.dispatch(message.messageId, message);
});

// 确保拦截器被正确应用
try {
  interceptor.apply();
  applyInterceptor();
  console.log('Interceptor successfully applied');
} catch (error) {
  console.error('Failed to apply interceptor:', error);
}

export default defineUnlistedScript(() => {
  console.log('Unlisted script started');
});
