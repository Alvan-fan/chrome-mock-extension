import { BatchInterceptor } from '@mswjs/interceptors';
import { FetchInterceptor } from '@mswjs/interceptors/fetch';
import { XMLHttpRequestInterceptor } from '@mswjs/interceptors/XMLHttpRequest';

const interceptor = new BatchInterceptor({
  name: 'mock',
  interceptors: [new FetchInterceptor(), new XMLHttpRequestInterceptor()],
});

const applyInterceptor = () => {
  // 监听所有请求
  interceptor.on('request', async ({ request, controller }) => {
    console.log('Intercepted request:', request.url);

    // 示例：拦截特定 URL 的请求
    if (
      request.url.includes(
        'https://vue.ruoyi.vip/prod-api/system/user/list?pageNum=1&pageSize=10'
      )
    ) {
      // 构造 mock 数据
      const mockData = {
        total: 2,
        rows: [
          {
            createBy: 'admin',
            createTime: '2024-06-30 11:27:11',
            updateBy: null,
            updateTime: null,
            remark: '管理员',
            userId: 1,
            deptId: 103,
            userName: 'admin',
            nickName: '若依1111',
            email: 'ry@163.com',
            phonenumber: '15888888888',
            sex: '1',
            avatar: '',
            password: null,
            status: '0',
            delFlag: '0',
            loginIp: '115.222.228.104',
            loginDate: '2025-05-16T12:21:05.000+08:00',
            dept: {
              createBy: null,
              createTime: null,
              updateBy: null,
              updateTime: null,
              remark: null,
              deptId: 103,
              parentId: null,
              ancestors: null,
              deptName: '研发部门',
              orderNum: null,
              leader: '若依',
              phone: null,
              email: null,
              status: null,
              delFlag: null,
              parentName: null,
              children: [],
            },
            roles: [],
            roleIds: null,
            postIds: null,
            roleId: null,
            admin: true,
          },
        ],
        code: 200,
        msg: '查询成功',
      };

      try {
        // 直接返回 Response 对象
        const response = new Response(JSON.stringify(mockData), {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
            'X-Mock-Response': 'true',
          },
        });
        controller.respondWith(response);
      } catch (error) {
        console.error('Error creating mock response:', error);
        throw error;
      }
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
