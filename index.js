import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Đảm bảo import App từ file App.js
//import './index.css'; // Nếu có file CSS

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Render vào phần tử có id là root trong HTML
);
