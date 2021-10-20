import React, { useState, useEffect, useCallback } from 'react';
import SearchIcon from "../images/search-icon.png";
import UserIcon from "../images/user-2.png";
import V from "../images/v.png";

// TODO: add default trending subs to the search bar, which also show if you type characters that don't match any subreddits

export default function Navbar({ selectedSubreddit, setSelectedSubreddit, search, setSearch, allSubreddits }) {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchInput = e => {
    // must keep in this style change as otherwise in various circumstances (including once a search has been performed), the dropdown subreddits box doesn't reappear
    document.querySelector(".dropdown-subreddits").style.display = "block";
    // searchHistory is emptied at the beginning of each function call to remove previous values that may no longer be correct
    let searchHistory = [];
    setSelectedSubreddit(e.target.value);
    let query = e.target.value;
    allSubreddits.filter(sub => {
      // for testing, it's easier to make sure query isn't an empty string, but take this out later to add default values
      if (query && sub.startsWith("r/" + query) && !searchHistory.includes(sub)) {
          searchHistory.push(sub);
      }
    });
    setSearchResults(searchHistory);
  }

  // determineChosenSubreddit is called when the user presses the enter key while hovering over one of the search options
  const determineChosenSubreddit = e => {
    e.preventDefault();
    // hoveredSubreddit gets the innertext of the div element that is currently being hovered over (which is the name of the subreddit preceded by r/)
    let hoveredSubreddit = Array.from(document.querySelectorAll(".dropdown-div")).find(sub => sub.classList.contains("dropdown-div-hover")).innerText;
    handleSearch(hoveredSubreddit);
  };

  // handleSearch performs the search using the mouse
  const handleSearch = sub => {
    // document.querySelector(".dropdown-subreddits").style.display = "none";
    setSelectedSubreddit(sub);
    setSearchResults([]);
    document.querySelector(".searchbar-subreddits").value = "";
    setSearch(sub);
  };

  const toggleSearchDropdown = e => {
    if (!e.target.classList.contains("searchbar-subreddits")) {
      document.querySelector(".dropdown-subreddits").style.display = "none";
    } else {
      document.querySelector(".dropdown-subreddits").style.display = "block";
    }
  };

  // handleMouseAndKeySearch allows subreddits to be selected and hovered while the dropdown subreddits bar is open
  const handleMouseAndKeySearch = e => {
    let selectableSubs = Array.from(document.querySelectorAll(".dropdown-div"));
    // hovered is used to keep track of whether or not any items have the hover class - if an item is found that is being hovered over, hovered becomes true
    let hovered = false;
    // 40 is the down arrow, 38 is the up arrow
    if (e.keyCode === 40 || e.keyCode === 38) {
      for (let i = 0; i < selectableSubs.length; i++) {
        if (hovered) break;
        // if it gets to the end of the loop and no item was hovered on, hover over the first item for a down arrow press or last item for an up arrow press
        if (i === selectableSubs.length-1 && !selectableSubs[i].classList.contains("dropdown-div-hover")) {
          hovered = true;
          if (e.keyCode === 40) selectableSubs[0].classList.add("dropdown-div-hover");
          if (e.keyCode === 38) selectableSubs[i].classList.add("dropdown-div-hover");
          break;
        }
        // if the first item has been hovered on and the up arrow is pressed, remove the hover
        if (e.keyCode === 38 && i === 0 && selectableSubs[i].classList.contains("dropdown-div-hover")) {
          hovered = true;
          selectableSubs[i].classList.remove("dropdown-div-hover");
          // if it gets to the end of the loop and the last item is hovered on, remove the hover
        } else if (e.keyCode === 40 && i === selectableSubs.length-1 && selectableSubs[i].classList.contains("dropdown-div-hover")) {
          hovered = true;
          selectableSubs[i].classList.remove("dropdown-div-hover");
          // for any other item in the list, just remove the hover and add it one item above or below
        } else if (selectableSubs[i].classList.contains("dropdown-div-hover")) {
          selectableSubs[i].classList.remove("dropdown-div-hover");
          if (e.keyCode === 40) {
            hovered = true;
            selectableSubs[i+1].classList.add("dropdown-div-hover");
          } else if (e.keyCode === 38) {
            hovered = true;
            selectableSubs[i-1].classList.add("dropdown-div-hover");
          }
        }
      }
    }
    if (e.type === "mouseover") {
      selectableSubs.map(sub => sub.classList.remove("dropdown-div-hover"));
      e.target.classList.add("dropdown-div-hover");
    }
    if (e.type === "mouseleave") {
      selectableSubs.map(sub => sub.classList.remove("dropdown-div-hover"));
    }
  };

  useEffect(() => {
    window.addEventListener("onKeyDown", handleMouseAndKeySearch);
    let selectableSubContainer = document.querySelector(".dropdown-subreddits");
    selectableSubContainer.addEventListener("mouseleave", handleMouseAndKeySearch);
    let selectableSubs = Array.from(document.querySelectorAll(".dropdown-div"));
    selectableSubs.map(sub => sub.addEventListener("mouseover", handleMouseAndKeySearch));
    return () => {
      window.removeEventListener("onKeyDown", handleMouseAndKeySearch);
      selectableSubContainer.removeEventListener("mouseleave", handleMouseAndKeySearch);
      selectableSubs.map(sub => sub.removeEventListener("mouseover", handleMouseAndKeySearch));
    }
  }, [selectedSubreddit]);

  useEffect(() => {
    window.addEventListener("click", toggleSearchDropdown);
    return () => {
      window.removeEventListener("click", toggleSearchDropdown);
    }
  });

  const handleReturnToHome = () => {
    setSelectedSubreddit("r/popular");
    document.querySelector(".popular-location").classList.remove("hide");
    setSearch("home");
  };

  // currentSubredditWidth takes the value of the width of the subreddit text in the search bar, whenever a subreddit has been selected
  let currentSubredditWidth = 0;
  if (document.querySelector(".current-subreddit")) currentSubredditWidth = document.querySelector(".current-subreddit").clientWidth

  return (
    <div className="Navbar">
      <div className="logo-container" onClick={handleReturnToHome}>
        <div className="logo"></div>
      </div>
      <form className="searchbar-container">
        <img src={SearchIcon} className="search-icon" alt="search-icon" />
        <input className="searchbar-subreddits" placeholder="Search Reddit" onChange={handleSearchInput} onKeyDown={handleMouseAndKeySearch} style={{paddingLeft: currentSubredditWidth + 50 + "px"}} />
        {search.startsWith("r/") && <div className="current-subreddit">{search}</div>}
        <div className="dropdown-subreddits" style={document.querySelector(".current-subreddit") && {bottom: "25px"}}>
          {searchResults.slice(0, 5).map(sub => <div className="dropdown-div" onClick={() => handleSearch(sub)} key={sub}>{sub}</div>)}
        </div>
        <button type="submit" onClick={determineChosenSubreddit} style={{display:"none"}}></button>
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