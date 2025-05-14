export default defineContentScript({
  matches: ['*://*.google.com/*'],
  main() {
    console.log('content.ts');
  },
});
