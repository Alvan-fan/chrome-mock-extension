const destroy = () => {
  const script = document.getElementById('mockInterceptor');
  script?.parentNode?.removeChild(script);
};

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
    } catch (error) {
      console.error('Failed to setup mock interceptor:', error);
    }
  },
});
