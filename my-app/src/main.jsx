// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx'; 
// import './App.css';          

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Stats from "./Stats";
import LoginSignUp from "./LoginSignUp";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginSignUp />} />
      <Route path="/app" element={<App />} />
      <Route path="/stats" element={<Stats />} />
    </Routes>
  </BrowserRouter>
);
