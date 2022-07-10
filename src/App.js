import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import './App.css';
import Header from './components/header/Header';
import Footer from "./components/footer/Footer";
import EnterPage from './components/pages/enter/EnterPage';
import SearchPage from './components/pages/search/SearchPage';
import { Slide, ToastContainer } from "react-toastify";
import firebaseApp from "./shared/FirebaseAPI";
import { get, getDatabase, ref } from "firebase/database";
import makeToast from "./shared/MakeToast";
import moment from "moment";

function App() {
  let [karaokePrefs, setKaraokePrefs] = useState({});
  let [karaokeTime, setKaraokeTime] = useState(false);
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
   * Effect: get karaoke preferences and check times. Runs once
   */
  useEffect(() => {
    // Weird bug where this useEffect called multiple times. If prefs non-empty, don't call db again.
    if (Object.keys(karaokePrefs).length > 0) {
      return;
    }

    // Initialize Realtime Database and get a reference to the service
    const db = getDatabase(firebaseApp);
    get(ref(db)).then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        setKaraokePrefs(data);
      } else {
        return makeToast("RTDB Error!", "error");
      }
    }).catch((error) => {
      console.log(error);
      return makeToast("RTDB Error!", "error");
    });
  }, []);

  /**
   * Effect: Check karaoke times based on karaokePrefs update. Setter is async!
   */
  useEffect(checkKaraokeTimes, [karaokePrefs]);

  /**
   * Effect: Checks local storage to see if user is following
   */
  useEffect(() => {
    if (alreadyFollowing()) {
      setShowSearch(true);
    }
  });

  /**
   * Checks if right now is during karaoke hours. 
   */
  function checkKaraokeTimes() {
    if (Object.keys(karaokePrefs).length === 0) {
      return;
    }

    let now = moment();
    let startTime = moment(karaokePrefs.karaokeStart, "HH:mm");
    let endTime = moment(karaokePrefs.karaokeEnd, "HH:mm");

    // false if out of time, true if within time
    setKaraokeTime(!(now.isBefore(startTime) || now.isAfter(endTime)));
  }

  return (
    <>
      <div className="App">
        <Header />

        {
          (!karaokeTime) ?
            <main className="text-center">
              <h1>It is currently not during karaoke hours.</h1>
              <h3>Karaoke hours are from {karaokePrefs.karaokeStart} to {karaokePrefs.karaokeEnd}.</h3>
              <br/>
              <h2>See you soon!</h2>
            </main>
            :
            (showSearch) ?
              <SearchPage karaokePrefs={karaokePrefs} /> :
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
