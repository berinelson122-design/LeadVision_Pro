import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // THE MASTER UPLINK

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="scanlines" /> {/* Injects the CRT overlay */}
    <App />
  </React.StrictMode>
);