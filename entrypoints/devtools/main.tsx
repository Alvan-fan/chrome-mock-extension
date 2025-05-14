import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// 创建面板
chrome.devtools.panels.create(
  'Mock DevTools',
  'public/icon/16.png',
  'devtools.html',
  (panel) => {
    console.log('DevTools panel created');
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
