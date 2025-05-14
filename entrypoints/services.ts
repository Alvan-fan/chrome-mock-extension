import { BatchInterceptor } from '@mswjs/interceptors';
import { FetchInterceptor } from '@mswjs/interceptors/fetch';
import { XMLHttpRequestInterceptor } from '@mswjs/interceptors/XMLHttpRequest';

const interceptor = new BatchInterceptor({
  name: 'mock',
  interceptors: [new FetchInterceptor(), new XMLHttpRequestInterceptor()],
});

const applyInterceptor = () => {
  // 监听所有请求
  interceptor.on('request', async ({ request }) => {
    console.log('MSW Request intercepted:', {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    });
  });

  // 监听所有响应
  interceptor.on('response', async ({ response }) => {
    console.log('MSW Response intercepted:', {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });
  });
};

export default defineUnlistedScript(() => {
  interceptor.apply();
  applyInterceptor();
});
