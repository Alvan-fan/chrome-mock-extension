import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    action: {},
    permissions: [
      'webRequest',
      'webRequestBlocking',
      'storage',
      'tabs',
      'scripting',
      '<all_urls>'
    ],
    devtools_page: 'devtools.html',
    host_permissions: [
      '<all_urls>'
    ],
    web_accessible_resources: [{
      resources: ['services.js'],
      matches: ['<all_urls>']
    }],
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
    }
  },
});
