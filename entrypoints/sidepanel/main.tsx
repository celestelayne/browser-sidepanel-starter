import React from 'react';
import ReactDOM from 'react-dom/client';
import { browser } from 'wxt/browser';
import App from './App.tsx';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App version={browser.runtime.getManifest().version} />
  </React.StrictMode>,
);
