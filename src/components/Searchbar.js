import React, { useState, useEffect } from 'react';
import AllSubs from "../allsubs.json";

// TODO: add default trending subs to the search bar, which also show if you type characters that don't match any subreddits

export default function Searchbar({ selectedSubreddit, setSelectedSubreddit, search, setSearch, setPage, setCachedPostData, setSelectedTimeText, setSortTop, setScrollPosition }) {
  const [searchResults, setSearchResults] = useState([]);

  // sortedSubs takes allsubs.json and orders them by subscriber count
  const sortedSubs = Object.fromEntries(
    Object.entries(AllSubs).sort(([,a],[,b]) => b-a)
  );

  // Object.keys creates an array of all the subreddits from sortedSubs, so that when filter is called while searching, they appear in order of most to least popular
  const allSubreddits = Object.keys(sortedSubs).map(sub => sub.toLowerCase());

  const handleSearchInput = e => {
    document.querySelector(".dropdown-subreddits").style.display = "block";
    // searchHistory is emptied at the beginning of each function call to remove previous values that may no longer be correct
    const searchHistory = [];
    // if selectedSubreddit isn't set here, the mouse can't be used to hover over any of the suggested subs in the dropdown, though they can still be selected (dependency in useEffect for handleMouseAndKeySearch?)
    setSelectedSubreddit(e.target.value);
    const query = e.target.value;
    allSubreddits.forEach(sub => {
      // when default values are added later, query will no longer need to have a value
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
    const hoveredSubreddit = Array.from(document.querySelectorAll(".dropdown-div")).find(sub => sub.classList.contains("dropdown-div-hover")).innerText;
    handleSearch(hoveredSubreddit);
  };

  // handleSearch performs the search
  const handleSearch = sub => {
    // document.querySelector(".dropdown-subreddits").style.display = "none";
    setSelectedSubreddit(sub);
    document.querySelector(".searchbar-subreddits").value = "";
    setSearch(sub);
    setScrollPosition(0);
    const wait1500 = setTimeout(() => {
      document.querySelector(".popular-hot").classList.add("clicked");
      document.querySelector(".popular-top").classList.remove("clicked");
      document.querySelector(".popular-new").classList.remove("clicked");
      document.querySelector(".hot-icon").classList.add("hot-blue");
      document.querySelector(".top-icon").classList.remove("top-blue");
      document.querySelector(".new-icon").classList.remove("new-blue");
      if (document.querySelector(".popular-today")) document.querySelector(".popular-today").classList.add("hide");
      setSortTop("");
      setSelectedTimeText("Today");
      setPage("subhome");
      setSearchResults([]);
    }, 1500);
    return () => clearTimeout(wait1500);
  };

  useEffect(() => {
    if (!searchResults.length) return;
    if (!search.startsWith("r/")) search = "r/" + search;
    const abortSearch = new AbortController();
    fetch(`https://www.reddit.com/${search}/about/.json`, { signal: abortSearch.signal })
    .then(res => res.json())
    .then(data => {
      if (data) {
        setCachedPostData({
          subreddit_title: data.data.title,
          thumbnail: data.data.icon_img,
          subscribers: data.data.subscribers,
          active_user_count: data.data.active_user_count,
          primary_color: data.data.primary_color,
          banner_background_color: data.data.banner_background_color,
          key_color: data.data.key_color,
          public_description_html: data.data.public_description_html,
          created_utc: data.data.created_utc,
          header_img: data.data.header_img,
          icon_img: data.data.icon_img,
          display_name_prefixed: data.data.display_name_prefixed,
          community_icon: data.data.community_icon,
          banner_background_image: data.data.banner_background_image,
          banner_size: data.data.banner_size,
          banner_img: data.data.banner_img
        });
      }
    })
    .catch(err => {
      if (err.name !== "AbortError") {
        console.log(err);
      }
    })
    return () => abortSearch.abort();
  }, [search]);

  const toggleSearchDropdown = e => {
    document.querySelector(".dropdown-subreddits").style.display = e.target.classList.contains("searchbar-subreddits")
      ? "block"
      : "none";
  };

  // handleMouseAndKeySearch allows subreddits to be selected and hovered while the dropdown subreddits bar is open
  const handleMouseAndKeySearch = e => {
    let selectableSubs = Array.from(document.querySelectorAll(".dropdown-div"));
    let hovered = false;
    // 40 is the down arrow, 38 is the up arrow
    if (e.keyCode === 40 || e.keyCode === 38) {
      for (let i = 0; i < selectableSubs.length; i++) {
        if (hovered) break;
        // if at the end of the loop, no item was hovered, hover the first item for a down arrow press or last item for an up arrow press
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
          // if at the end of the loop, the last item is hovered on, remove the hover
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
    if (e.type === "mouseover" || e.type === "mouseleave") {
      selectableSubs.map(sub => sub.classList.remove("dropdown-div-hover"));
      e.target.classList.add("dropdown-div-hover");
    }
  };

  useEffect(() => {
    window.addEventListener("onKeyDown", handleMouseAndKeySearch);
    const selectableSubContainer = document.querySelector(".dropdown-subreddits");
    selectableSubContainer.addEventListener("mouseleave", handleMouseAndKeySearch);
    const selectableSubs = Array.from(document.querySelectorAll(".dropdown-div"));
    selectableSubs.map(sub => sub.addEventListener("mouseover", handleMouseAndKeySearch));
    
    return () => {
      window.removeEventListener("onKeyDown", handleMouseAndKeySearch);
      selectableSubContainer.removeEventListener("mouseleave", handleMouseAndKeySearch);
      selectableSubs.map(sub => sub.removeEventListener("mouseover", handleMouseAndKeySearch));
    }
  }, [selectedSubreddit]);

  useEffect(() => {
    window.addEventListener("click", toggleSearchDropdown);
    return () => window.removeEventListener("click", toggleSearchDropdown);
  }, []);

  // currentSubredditWidth takes the value of the width of the subreddit text in the search bar, whenever a subreddit has been selected, to make sure the search text appears in the right place
  let currentSubredditWidth = (document.querySelector(".current-subreddit")) ? document.querySelector(".current-subreddit").clientWidth : 0;

  return (
    <form className="searchbar-container">
      <img src="images/search-icon.png" className="search-icon" alt="search-icon" />
      <input 
        className="searchbar-subreddits"
        placeholder="Search Reddit"
        onChange={handleSearchInput}
        onKeyDown={handleMouseAndKeySearch}
        style={{paddingLeft: currentSubredditWidth + 50 + "px"}}
      />
      {search.startsWith("r/") && !search.startsWith("r/popular")
        ? search.indexOf("/") !== search.lastIndexOf("/") && search.indexOf("/") !== -1
          ? <div className="current-subreddit">{search.slice(0, search.lastIndexOf("/"))}</div>
          : <div className="current-subreddit">{search}</div>
        : <></>}
      <div className="dropdown-subreddits" style={document.querySelector(".current-subreddit") && {bottom: "25px"}}>
        {searchResults.slice(0, 5).map(sub => 
          <div className="dropdown-div" onClick={() => handleSearch(sub)} key={sub}>{sub}</div>
        )}
      </div>
      <button type="submit" onClick={determineChosenSubreddit} className="hide" />
    </form>
  )
}
