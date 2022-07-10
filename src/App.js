import React, { useEffect, useState } from "react";
import { Slide, ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import './App.css';
import Header from './components/header/Header';
import Footer from "./components/footer/Footer";
import RootPage from "./components/pages/root/RootPage";
import AdminPage from "./components/pages/admin/AdminPage";

function App() {
  

  return (
    <>
      <div className="App">
        <Header />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootPage/>} />
            <Route path="/admin" element={<AdminPage/>} />
          </Routes>
        </BrowserRouter>

        <Footer />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="colored"
        transition={Slide}
      />
    </>
  );
}

export default App;
