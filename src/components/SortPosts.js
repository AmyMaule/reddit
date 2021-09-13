import React, { useState, useEffect } from 'react';
// import Hot from "../images/hot.png";
// import HotBlue from "../images/hot-blue.png";
import Rectangle from "../images/rectangle.png";
// import New from "../images/star.png";
// import NewBlue from "../images/star-blue.png";
// import Top from "../images/top.png";
// import TopBlue from "../images/top-blue.png";
import VBlue from "../images/v-blue.png";
import blank from "../images/blank.png";
import GeoFilter from "../geofilter.json";

// TODO: empty the search bar after clicking on one of these buttons

export default function SortPosts({ selectedSubreddit, setSelectedSubreddit, setSearch, setSortTop }) {
  let allCountries = Object.keys(GeoFilter);
  const [selectedCountry, setSelectedCountry] = useState("Everywhere");
  const [selectedTimeText, setSelectedTimeText] = useState("Today");

  // handleSort sets the subreddit and search to be hot, new, top or rising, triggering a new fetch request
  const handleSort = sub => {
    setSelectedSubreddit(sub);
    setSearch(sub);
  }

  const handleBtnColorChange = (sub, clickedClass) => {
    // "new" and "top" hide the location button, "hot" shows the location button (so does the reddit logo in Navbar.js)
    clickedClass === "hot"
      ? document.querySelector(".popular-location").classList.remove("hide")
      : document.querySelector(".popular-location").classList.add("hide");
    let popularBtns = Array.from(document.querySelectorAll(".popular-btn"));
    popularBtns.map(btn => btn.classList.remove("clicked"));
    let clickedItem = document.querySelector(`.popular-${clickedClass}`);
    clickedItem.classList.add("clicked");
    let allIcons = Array.from(document.querySelectorAll(".hot-icon, .top-icon, .new-icon"));
    allIcons.map(icon => icon.classList.remove("hot-blue", "top-blue", "new-blue"));
    clickedItem.firstChild.classList.add(`${clickedClass}-blue`);
    handleSort(sub);
    // if "top" has been clicked, show the dropdown to select the time period, otherwise hide it
    if (document.querySelector(".popular-top").classList.contains("clicked")) {
      document.querySelector(".popular-today").classList.remove("hide");
    } else document.querySelector(".popular-today").classList.add("hide");
  }

  const toggleCountriesMenu = e => {
    let dropdownCountries = document.querySelector(".dropdown-location-container");
    if (e.target.classList.contains("popular-location")) {
      dropdownCountries.classList.contains("show") ? dropdownCountries.classList.remove("show") : dropdownCountries.classList.add("show");
    } else {
      dropdownCountries.classList.remove("show");
    }
  }

  const toggleSortMenu = e => {
    let dropdownTop = document.querySelector(".dropdown-top-container");
    if (e.target.classList.contains("popular-today")) {
      dropdownTop.classList.contains("hide") ? dropdownTop.classList.remove("hide") : dropdownTop.classList.add("hide");
    } else {
      dropdownTop.classList.add("hide");
    }
  }

  // fetch("http://www.reddit.com/top/.json?sort=top&t=XXX")
  // /top?t= hour, day, week, month, year, all
  // within the API, Now = hour, Today = day, This Week/Month/Year = week/month/year, All Time = all
  const handleTimeSort = e => {
    // this slices the end of the .dropdown-top- class to give the time period selected
    let selectedTime = e.target.classList[0].slice(13);
    setSortTop(`&sort=top&t=${selectedTime}`);
    setSearch(selectedTime);
    setSelectedTimeText(e.target.textContent);
    const timeDropdowns = Array.from(document.querySelectorAll(".dropdown-top"));
    // remove clicked from all of the dropdown buttons, then re-add it to the time period that has been selected
    timeDropdowns.map(timeDropdown => timeDropdown.classList.remove("clicked"));
    e.target.classList.add("clicked");
  }

  useEffect(() => {
    document.body.addEventListener("click", e => {
      toggleCountriesMenu(e);
      toggleSortMenu(e);
    });
    return function cleanupToggleMenus() {
        window.removeEventListener("click", toggleCountriesMenu);
        window.removeEventListener("click", toggleSortMenu);
    }
  }, []);

  return (
    <>
    <div className="SortPosts">
      <div className="popular-container">
        <div className="popular-btn popular-hot clicked" onClick={() => handleBtnColorChange("r/popular/hot", "hot")}>
        {/* hot is blue by default, so needs the class hot-blue, but also needs the class hot-grey as the grey classes are never removed */}
          <img src={blank} className="hot-icon hot-blue hot-grey" alt="" />
          Hot
        </div>
        <div className="popular-location">
          {selectedCountry}
          <img src={VBlue} className="v-location" alt="" />
          <div className="dropdown-location-container">
            {allCountries.map(country => <div className="dropdown-location" key={country} onClick={() => setSelectedCountry(country)}>{country}</div>)}
          </div>
        </div>
        {/* r/popular/new updates so quickly there will always be something different on refresh */}
        <div className="popular-btn popular-new" onClick={() => handleBtnColorChange("r/popular/new", "new")}>
          <img src={blank} className="new-icon new-grey" alt="" />
          New
        </div>
        <div className="popular-btn popular-top" onClick={() => handleBtnColorChange("r/popular/top", "top")}>
          <img src={blank} className="top-icon top-grey" alt="" />
          Top
        </div>
        <div className="popular-today hide">
          {selectedTimeText}
          <img src={VBlue} className="v-location" alt="" />
          <div className="dropdown-top-container">
            <div className="dropdown-top-hour dropdown-top" onClick={e => handleTimeSort(e)}>Now</div>
            <div className="dropdown-top-day dropdown-top clicked" onClick={e => handleTimeSort(e)}>Today</div>
            <div className="dropdown-top-week dropdown-top" onClick={e => handleTimeSort(e)}>This Week</div>
            <div className="dropdown-top-month dropdown-top" onClick={e => handleTimeSort(e)}>This Month</div>
            <div className="dropdown-top-year dropdown-top" onClick={e => handleTimeSort(e)}>This Year</div>
            <div className="dropdown-top-all dropdown-top" onClick={e => handleTimeSort(e)}>All Time</div>
          </div>
        </div>
        {/* rising should actually appear as a button which when clicked does this: */}
        <div className="popular-more" onClick={() => handleSort("rising")}>...</div>
        <div className="popular-view">
          <img src={Rectangle} className="rectangle-icon" alt="" />
        </div>
      </div>
    </div>

    </>
  )
}
