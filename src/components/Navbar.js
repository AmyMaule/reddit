import React, { useState, useEffect } from 'react';
import SearchIcon from "../images/search-icon.png";
import UserIcon from "../images/user-2.png";
import V from "../images/v.png";

// TODO: add default trending subs to the search bar, which also show if you type characters that don't match any subreddits
// TODO: Finish attaching arrow keys to search

export default function Navbar({ selectedSubreddit, setSelectedSubreddit, setSearch, allSubreddits }) {
  const [searchResults, setSearchResults] = useState([]);
  let searchHistory = [];

  const handleFormSubmit = e => {
    e.preventDefault();
    setSearch(selectedSubreddit);
    setSelectedSubreddit("");
  }

  const handleSearch = e => {
    document.querySelector(".dropdown-subreddits").style.display = "block";
    // searchHistory is emptied at the beginning of each function call to remove previous values that may no longer be correct
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
    // if (e.code === "ArrowDown") console.log(2)
  }

  const handleSearchSelect = sub => {
    setSelectedSubreddit(sub);
    setSearch(sub);
    document.querySelector(".dropdown-subreddits").style.display = "none";
    setSearchResults([]);
    console.log(selectedSubreddit)
  }

  const toggleSearchDropdown = e => {
    if (!e.target.classList.contains("searchbar-subreddits")) {
      document.querySelector(".dropdown-subreddits").style.display = "none";
    } else {
      document.querySelector(".dropdown-subreddits").style.display = "block";
    }
  }

  // TODO: Finish attaching arrow keys to search
  const handleArrowKeySearch = e => {
    if (e.keyCode === 40 || e.keyCode === 38) console.log(e);
  }

  useEffect(() => {
    window.addEventListener("click", toggleSearchDropdown);
    return () => {
      window.removeEventListener("click", toggleSearchDropdown);
    }
  });

  useEffect(() => {
    window.addEventListener("click", handleArrowKeySearch);
    return () => {
      window.removeEventListener("click", handleArrowKeySearch);
    }
  })

  const handleReturnToHome = () => {
    setSelectedSubreddit("r/popular");
    document.querySelector(".popular-location").classList.remove("hide");
    setSearch("home");
  }

  return (
    <div className="Navbar">
      <div className="logo-container" onClick={handleReturnToHome}>
        <div className="logo"></div>
      </div>
      <form className="searchbar-container">
        <img src={SearchIcon} className="search-icon" alt="search-icon" />
        <input className="searchbar-subreddits" placeholder="Search Reddit" value={selectedSubreddit} onChange={handleSearch} onKeyDown={handleArrowKeySearch} />
        <div className="dropdown-subreddits">
          {searchResults.slice(0, 5).map(sub => <div className="dropdown-div" onClick={() => handleSearchSelect(sub)} key={sub}>{sub}</div>)}
        </div>
        <button type="submit" onClick={handleFormSubmit} style={{display:"none"}}></button>
      </form>
      <div className = "btn-container">
        <button className="btn nav-btn btn-white btn-login">Log In</button>
        <button className="btn nav-btn btn-blue btn-signup">Sign Up</button>
        <div className="user-icons-container">
          <img src={UserIcon} className="user-icon" alt="user-icon" />
          <img src={V} className="v-icon" alt="" />
        </div>
      </div>
    </div>
  )
}


