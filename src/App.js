import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import './App.css';
import Header from './components/header/Header';
import Footer from "./components/footer/Footer";
import EnterPage from './components/pages/enter/EnterPage';
import SearchPage from './components/pages/search/SearchPage';
import { Slide, ToastContainer } from "react-toastify";

function App() {
  let [showSearch, setShowSearch] = useState(false);
  let localStorageKey = "following2";

  /**
   * Checks if the local storage flag of "following" is true
   * @returns true if following flag in local storage is true
   */
  function alreadyFollowing() {
    let following = localStorage.getItem(localStorageKey); // changed to dynamic key to reset for email collection
    if (following == null) {
      setFollowing(false);
      return false;
    }

    return following === "true";
  }

  /**
   * Sets local storage to be the boolean value of whether
   * user is following page or not
   * @param {boolean} following 
   */
  function setFollowing(following) {
    localStorage.setItem(localStorageKey, following);
  }

  /**
   * Effect: Checks local storage to see if user is following
   */
  useEffect(() => {
    if (alreadyFollowing()) {
      setShowSearch(true);
    }
  });

  return (
    <>
      <div className="App">
        <Header />

        {
          showSearch ?
            <SearchPage /> :
            <EnterPage setShowSearch={setShowSearch} setFollowing={setFollowing} />
        }

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
