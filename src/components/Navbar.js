import React, { useState, useEffect } from 'react';
import SearchIcon from "../images/search-icon.png";
import UserIcon from "../images/user-2.png";
import V from "../images/v.png";

// TODO: add default trending subs to the search bar, which also show if you type characters that don't match any subreddits

export default function Navbar({ selectedSubreddit, setSelectedSubreddit, setSearch, allSubreddits, page, setPage, setPrevPage }) {
  const [searchResults, setSearchResults] = useState([]);
  let searchHistory = [];

  // const handleFormSubmit = e => {
  //   e.preventDefault();
  //   setSearch(selectedSubreddit);
  //   // setSelectedSubreddit("");
  //   setPrevPage(page);
  //   setPage("subhome");
  // }

  const handleSearch = e => {
    document.querySelector(".dropdown-subreddits").style.display = "block";
    // searchHistory is emptied at the beginning of each function call to remove all previous values
    searchHistory = [];
    setSelectedSubreddit(e.target.value);
    let query = e.target.value;
    allSubreddits.filter(sub => {
      // for testing, it's easier to make sure query isn't an empty string, but take this out later to add default values
      if (query && sub.startsWith("r/" + query) && !searchHistory.includes(sub)) {
          searchHistory.push(sub);
      }
    })
    setSearchResults(searchHistory);
  }

  const handleSearchSelect = sub => {
    setSelectedSubreddit(sub);
    setSearch(sub);
    document.querySelector(".dropdown-subreddits").style.display = "none";
    setSearchResults([]);
  }

  const toggleSearchDropdown = e => {
    if (!e.target.classList.contains("searchbar-subreddits")) {
      document.querySelector(".dropdown-subreddits").style.display = "none";
    } else {
      document.querySelector(".dropdown-subreddits").style.display = "block";
    }
  }

  useEffect(() => {
    document.body.addEventListener('click', e => {
      toggleSearchDropdown(e)
    });
    return function cleanupToggleSearchDropdown() {
        window.removeEventListener('click', toggleSearchDropdown);
    }
  }, []);

  const handleReturnToHome = () => {
    setSelectedSubreddit("r/popular");
    // reset the default "hot" position where the location bar is visible
    if (document.querySelector(".popular-location")) document.querySelector(".popular-location").classList.remove("hide");
    if (document.querySelector(".popular-today")) document.querySelector(".popular-today").classList.add("hide");
    // remove the clicked class from each of the buttons to remove the blue color, then add the blue color back to hot (default clicked)
    Array.from(document.querySelectorAll(".popular-btn")).map(btn => btn.classList.remove("clicked"));
    document.querySelector(".popular-hot").classList.add("clicked");
    Array.from(document.querySelectorAll(".top-icon, .new-icon")).map(icon => icon.classList.remove("top-blue", "new-blue"));
    document.querySelector(".hot-icon").classList.add("hot-blue");
    setSearch("home");
    setPrevPage(page);
    setPage("home");
  }

  return (
    <div className="Navbar">
      <div className="logo-container" onClick={handleReturnToHome}>
        <div className="logo"></div>
      </div>
      <form className="searchbar-container">
        <img src={SearchIcon} className="search-icon" alt="search-icon" />
        <input className="searchbar-subreddits" placeholder="Search Reddit" value={selectedSubreddit} onChange={handleSearch} />
        <div className="dropdown-subreddits">
          {searchResults.slice(0, 5).map(sub => <div className="dropdown-div" onClick={() => handleSearchSelect(sub)} key={sub}>{sub}</div>)}
        </div>
        <button type="submit" /*onClick={handleFormSubmit}*/ style={{display:"none"}}></button>
      </form>
      <div className = "btn-container">
        <button className="nav-btn btn-white btn-login">Log In</button>
        <button className="nav-btn btn-blue btn-signup">Sign Up</button>
        <div className="user-icons-container">
          <img src={UserIcon} className="user-icon" alt="user-icon" />
          <img src={V} className="v-icon" alt="" />
        </div>
      </div>
    </div>
  )
}


