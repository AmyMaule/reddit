import React, { useEffect, useState, useRef } from 'react';
import Searchbar from './Searchbar';

export default function Navbar({ selectedSubreddit, setSelectedSubreddit, search, setSearch, setPage, setCachedPostData, setSelectedTimeText, setSortTop, setScrollPosition }) {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const hamburgerOptionsRef = useRef();

  const handleReturnToHome = () => {
    setTimeout(() => {
      // reset the sort posts bar to default styling and sorting
      document.querySelector(".popular-top").classList.remove("clicked");
      document.querySelector(".popular-new").classList.remove("clicked");
      document.querySelector(".popular-hot").classList.add("clicked");
      document.querySelector(".hot-icon").classList.add("hot-blue");
      document.querySelector(".top-icon").classList.remove("top-blue");
      document.querySelector(".new-icon").classList.remove("new-blue");
      document.querySelector(".popular-today").classList.add("hide");
      setSortTop("");
      setSelectedTimeText("Today");
      setScrollPosition(0);
      setPage("home");
    }, 1200);
    setSelectedSubreddit("r/popular");
    setSearch("home");
  };

  const toggleHamburger = () => {
    setHamburgerOpen(prev => !prev);
    hamburgerOptionsRef.current.classList.toggle("hide");
  }

  const closeHamburger = e => {
    if (!hamburgerOpen && !e.target.classList.contains("navbar-hamburger")) toggleHamburger();
  }

  useEffect(() => {
    window.addEventListener("click", closeHamburger);
    return () => window.removeEventListener("click", closeHamburger);
  }, []);

  return (
    <div className="navbar">
      <div className="logo-container" onClick={handleReturnToHome}>
        <div className="logo" />
      </div>
      <Searchbar 
        selectedSubreddit={selectedSubreddit}
        setSelectedSubreddit={setSelectedSubreddit}
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        setCachedPostData={setCachedPostData}
        setSelectedTimeText={setSelectedTimeText}
        setSortTop={setSortTop}
        setScrollPosition={setScrollPosition}
      />
      <div className="hamburger-container">
        <img src="images/hamburger.png" className="navbar-hamburger" alt="" onClick={toggleHamburger} />
        {hamburgerOpen && 
          <div className="hamburger-options-container" ref={hamburgerOptionsRef}>
            <div className="hamburger-option">Log in</div>
            <div className="hamburger-option">Sign up</div>
          </div>
        }
      </div>
      <div className="btn-container">
        <button className="btn nav-btn btn-white btn-login">Log In</button>
        <button className="btn nav-btn btn-blue btn-signup">Sign Up</button>
        <div className="user-icons-container">
          <img src="images/user-2.png" className="user-icon" alt="user-icon" />
          <img src="images/v.png" className="v-icon" alt="" />
        </div>
      </div>
    </div>
  )
}
