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
      '<all_urls>'
    ],
    devtools_page: 'devtools.html',
    host_permissions: [
      '<all_urls>'
    ]
  },
});
