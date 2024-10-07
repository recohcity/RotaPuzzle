import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';

console.log("Index.js is running");

const rootElement = document.getElementById('root');
console.log("Root element:", rootElement);

const root = ReactDOM.createRoot(rootElement);
console.log("ReactDOM.createRoot called");

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);