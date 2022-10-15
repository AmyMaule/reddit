import React, { useState, useEffect } from 'react';
import GeoFilter from "../geofilter.json";

export default function SortPosts({ setSelectedSubreddit, search, setSearch, setSortTop, page, selectedTimeText, setSelectedTimeText }) {
  const [selectedCountry, setSelectedCountry] = useState("Everywhere");
  const allCountries = Object.keys(GeoFilter);

  // handleSort sets the subreddit and search to be hot, new, top or rising, triggering a new fetch request
  const handleSort = sub => {
    setSelectedSubreddit(sub);
    setSearch(sub);
  }

  const handleBtnColorChange = (sub, clickedClass) => {
    // "popular-location" is only accessible from the homepage
    if (page === "home") {
      // "new" and "top" hide the location button, "hot" shows the location button (so does the reddit logo in Navbar.js)
      clickedClass === "hot"
        ? document.querySelector(".popular-location").classList.remove("hide")
        : document.querySelector(".popular-location").classList.add("hide");
    }

    const popularBtns = Array.from(document.querySelectorAll(".popular-btn"));
    popularBtns.forEach(btn => btn.classList.remove("clicked"));

    const clickedItem = document.querySelector(`.popular-${clickedClass}`);
    clickedItem.classList.add("clicked");
    clickedItem.firstChild.classList.add(`${clickedClass}-blue`);

    const allIcons = Array.from(document.querySelectorAll(".hot-icon, .top-icon, .new-icon"));
    allIcons.map(icon => icon.classList.remove("hot-blue", "top-blue", "new-blue"));

    // if "top" has been clicked, show the dropdown to select the time period, otherwise hide it
    if (document.querySelector(".popular-top").classList.contains("clicked")) {
      document.querySelector(".popular-today").classList.remove("hide");
    } else document.querySelector(".popular-today").classList.add("hide");

    // handleSort triggers the fetch request to update the state to reflect the changes made here and in trimSearchQuery
    handleSort(sub);
  }

  const trimSearchQuery = (sub, clickedClass) => {
    // use .slice() to remove the r/ and /hot from search, if they are there
    if (search.indexOf("/") !== -1 && search.indexOf("/") !== search.lastIndexOf("/")) {
      let firstSlash = search.indexOf("/") + 1;
      let secondSlash = search.lastIndexOf("/");
      search = search.slice(firstSlash, secondSlash);
    }

    // if there's an r/ but no second slash, just remove the r/
    if (search.indexOf("/") !== -1 && search.indexOf("/") === search.lastIndexOf("/")) search = search.slice(2);

    // if on the homepage, the sub is r/popular/hot for example, so if in subhome, sub becomes the name of the subreddit
    if (page === "subhome") sub = `r/${search}/${clickedClass}`;

    // call handleBtnColorChange to reset to default the blue/gray color for the text and icon for each button
    handleBtnColorChange(sub, clickedClass);
  }

  const toggleCountriesMenu = e => {
    const dropdownCountries = document.querySelector(".dropdown-location-container");
    if (e.target.classList.contains("popular-location")) {
      dropdownCountries.classList.contains("show") ? dropdownCountries.classList.remove("show") : dropdownCountries.classList.add("show");
    } else {
      dropdownCountries.classList.remove("show");
    }
  }

  const toggleSortMenu = e => {
    const dropdownTop = document.querySelector(".dropdown-top-container");
    if (e.target.classList.contains("popular-today")) {
      dropdownTop.classList.toggle("hide");
    } else {
      dropdownTop.classList.add("hide");
    }
  }

  // fetch("http://www.reddit.com/top/.json?sort=top&t=XXX") t = hour, day, week, month, year, all
  // within the API, Now = hour, Today = day, This Week/Month/Year = week/month/year, All Time = all
  const handleTimeSort = e => {
    // this slices the end of the .dropdown-top- class to give the time period selected
    let selectedTime = e.target.classList[0].slice(13);

    // sortTop adds this extra string to the end of the URL to be fetched to get the posts in App.js
    setSortTop(`&sort=top&t=${selectedTime}`);
    setSearch(selectedTime);
    setSelectedTimeText(e.target.textContent);
    const timeDropdowns = Array.from(document.querySelectorAll(".dropdown-top"));
    // remove clicked from all of the dropdown buttons, then re-add it to the time period that has been selected
    timeDropdowns.forEach(timeDropdown => timeDropdown.classList.remove("clicked"));
    e.target.classList.add("clicked");
  }

  const handleToggles = e => {
    toggleCountriesMenu(e);
    toggleSortMenu(e);
  }

  useEffect(() => {
    window.addEventListener("click", handleToggles);
    return () => window.removeEventListener("click", handleToggles);
  });

  return (
    <>
      {page === "home" && <h2 className="popular-title">Popular posts</h2>}
      <div className="SortPosts" style={page === "home" ? {marginTop: "10px"} : {marginTop: "20px"}}>
        <div className="popular-container">
          <div className="popular-btn popular-hot clicked" onClick={() => trimSearchQuery("r/popular/hot", "hot")}>
          {/* hot is blue by default, so needs the class hot-blue, but also needs the class hot-grey as the grey classes are never removed */}
            <img src="images/blank.png" className="hot-icon hot-blue hot-grey" alt="" />
            Hot
          </div>
          <div className={page === "home" ? "popular-location" : "hide"}>
            {selectedCountry}
            <img src="images/v-blue.png" className="v-location" alt="" />
            <div className="dropdown-location-container">
              {allCountries.map(country => (
                <div className="dropdown-location" key={country} onClick={() => setSelectedCountry(country)}>{country}</div>
              ))}
            </div>
          </div>
          {/* r/popular/new updates so quickly there will always be something different on refresh */}
          <div className="popular-btn popular-new" onClick={() => trimSearchQuery("r/popular/new", "new")}>
            <img src="images/blank.png" className="new-icon new-grey" alt="" />
            New
          </div>
          <div className="popular-btn popular-top" onClick={() => trimSearchQuery("r/popular/top", "top")}>
            <img src="images/blank.png" className="top-icon top-grey" alt="" />
            Top
          </div>
          <div className="popular-today hide">
            {selectedTimeText}
            <img src="images/v-blue.png" className="v-location" alt="" />
            <div className="dropdown-top-container">
              <div className="dropdown-top-hour dropdown-top" onClick={handleTimeSort}>Now</div>
              <div className="dropdown-top-day dropdown-top clicked" onClick={handleTimeSort}>Today</div>
              <div className="dropdown-top-week dropdown-top" onClick={handleTimeSort}>This Week</div>
              <div className="dropdown-top-month dropdown-top" onClick={handleTimeSort}>This Month</div>
              <div className="dropdown-top-year dropdown-top" onClick={handleTimeSort}>This Year</div>
              <div className="dropdown-top-all dropdown-top" onClick={handleTimeSort}>All Time</div>
            </div>
          </div>
          {/* rising should actually appear as a button which when clicked does this: */}
          <div className="popular-more" onClick={() => handleSort("rising")}>...</div>
          <div className="popular-view">
            <img src="images/rectangle.png" className="rectangle-icon" alt="" />
          </div>
        </div>
      </div>
    </>
  )
}
