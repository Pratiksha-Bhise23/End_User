import { StrictMode } from 'react'
import React from 'react';
// import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Auth/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom';
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </StrictMode>,
// )
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
