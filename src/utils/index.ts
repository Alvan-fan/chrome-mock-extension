import { CONTENT_SCRIPT_ID } from './constant';

export const destroy = () => {
  const script = document.getElementById(CONTENT_SCRIPT_ID);
  script?.parentNode?.removeChild(script);
};

export const isObject = (variable: unknown) =>
  typeof variable === 'object' &&
  variable !== null &&
  Object.prototype.toString.call(variable) === '[object Object]' &&
  Object.getPrototypeOf(variable) === Object.prototype;

export const parseMockData = (mockData: string) => {
  let jsonMockData;
  try {
    // 如果 mockData 是字符串，尝试清理和解析
    if (typeof mockData === 'string') {
      try {
        // 如果数据看起来像 JavaScript 对象字面量，使用 eval 安全地解析
        if (mockData.startsWith('{') && mockData.endsWith('}')) {
          // 使用 Function 构造器来安全地解析对象字面量
          jsonMockData = new Function('return ' + mockData)();
        } else {
          // 否则尝试作为 JSON 解析
          jsonMockData = JSON.parse(mockData);
        }
      } catch (parseError) {
        console.error('解析错误:', parseError);
        console.error('问题数据:', mockData);
        // 如果解析失败，使用原始数据
        jsonMockData = mockData;
      }
    } else {
      // 如果已经是对象，直接使用
      jsonMockData = mockData;
    }

    console.log('转换后的 mockData:', jsonMockData);
  } catch (error) {
    console.error('处理 mockData 失败:', error);
    jsonMockData = mockData; // 如果处理失败，使用原始数据
  }

  return jsonMockData;
};
