import React, { useState, useEffect } from 'react';
import Rectangle from "../images/rectangle.png";
import VBlue from "../images/v-blue.png";
import blank from "../images/blank.png";
import GeoFilter from "../geofilter.json";

export default function SortPosts({ setSelectedSubreddit, setSearch, setSortTop, page, selectedSubreddit }) {
  // console.log("page is", page);
  let allCountries = Object.keys(GeoFilter);
  const [selectedCountry, setSelectedCountry] = useState("Everywhere");
  const [selectedTimeText, setSelectedTimeText] = useState("Today");

  const resetButtonColors = (clickedClass) => {
    let clickedItem = document.querySelector(`.popular-${clickedClass}`);
    // remove the clicked class from each of the buttons to remove the blue color, then add the blue color back to whichever button was clicked
    Array.from(document.querySelectorAll(".popular-btn")).map(btn => btn.classList.remove("clicked"));
    clickedItem.classList.add("clicked");
    // remove the blue class from the icons within the buttons, then add the blue class back to whichever icon was clicked
    Array.from(document.querySelectorAll(".hot-icon, .top-icon, .new-icon")).map(icon => icon.classList.remove("hot-blue", "top-blue", "new-blue"));
    clickedItem.firstChild.classList.add(`${clickedClass}-blue`);
  }

  // performSort sets the subreddit and search to be hot, new, top or rising, triggering a new fetch request
  const performSort = sub => {
    setSelectedSubreddit(sub);
    setSearch(sub);
  }

  const handleSelectSort = (sub, clickedClass) => {
    console.log(selectedSubreddit)
    resetButtonColors(clickedClass);
    performSort(sub);
    // "new" and "top" hide the location button, "hot" shows the location button (so does the reddit logo in Navbar.js)
    if (document.querySelector(".popular-location")) {
      clickedClass === "hot"
      ? document.querySelector(".popular-location").classList.remove("hide")
      : document.querySelector(".popular-location").classList.add("hide");
    }
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

  // fetch("http://www.reddit.com/r/aww/top/.json?sort=top") // THIS WORKS
  // fetch("http://www.reddit.com/top/.json?sort=top&t=XXX")
  // t = hour, day, week, month, year, all
  // within the API, Now = hour, Today = day, This Week/Month/Year = week/month/year, All Time = all
  const handleTimeSort = e => {
    console.log(selectedSubreddit)
    // this slices the end of the .dropdown-top- class to give the time period selected
    let selectedTime = e.target.classList[0].slice(13);
    setSortTop(`&sort=top&t=${selectedTime}`);
    // setSortTop(`&sort=${page === "home" ? "" : "r/aww"}&t=${selectedTime}`);
    setSearch(selectedTime);
    setSelectedTimeText(e.target.textContent);
    const timeDropdowns = Array.from(document.querySelectorAll(".dropdown-top"));
    // remove clicked from all of the dropdown buttons, then re-add it to the time period that has been selected
    timeDropdowns.map(timeDropdown => timeDropdown.classList.remove("clicked"));
    e.target.classList.add("clicked");
  }

  useEffect(() => {
    document.body.addEventListener("click", e => {
      // temp solution to the functions firing twice, thereby not allowing the toggleSortMenu to open the time sort menu is to use the if statement, but seems buggy some of the time (and console logging page here logs it twice, once as "home" and once as undefined without any other changes)
      if (page === "home") toggleCountriesMenu(e);
      if (page === "home" || page === "subhome") toggleSortMenu(e);
    });
    return () => {
        window.removeEventListener("click", toggleCountriesMenu);
        window.removeEventListener("click", toggleSortMenu);
    }
  }, []);

  return (
    <div className="SortPosts" style={{marginTop: page === "home" ? "60px" : "0px"}}>
      <div className="popular-container">
        <div className="popular-btn popular-hot clicked" onClick={() => handleSelectSort("r/popular/hot", "hot")}>
        {/* hot is blue by default, so needs the class hot-blue, but also needs the class hot-grey as the grey classes are never removed */}
          <img src={blank} className="hot-icon hot-blue hot-grey" alt="" />
          Hot
        </div>
        <div className={page === "home" ? "popular-location" : "hide"}>
          {selectedCountry}
          <img src={VBlue} className="v-location" alt="" />
          <div className="dropdown-location-container">
            {allCountries.map(country => <div className="dropdown-location" key={country} onClick={() => setSelectedCountry(country)}>{country}</div>)}
          </div>
        </div>
        <div
          className="popular-btn popular-new"
          style={{right: page === "home" ? "10px" : "0px"}}
          onClick={() => handleSelectSort("r/popular/new", "new")}
        >
          <img src={blank} className="new-icon new-grey" alt="" />
          New
        </div>
        <div className="popular-btn popular-top" onClick={() => handleSelectSort("r/popular/top", "top")}>
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
        <div className="popular-more">...</div>
        <div className="popular-view" style={{paddingLeft: page === "home" ? "15px" : "270px"}}>
          <img src={Rectangle} className="rectangle-icon" alt="" />
        </div>
      </div>
    </div>
  )
}