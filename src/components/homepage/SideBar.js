import React from 'react';
import UpV from "../../images/up-v.png";
import MadeMeSmile from "../../images/mademesmile.png";
import RareInsults from "../../images/rareinsults.png";
import CoolGuides from "../../images/coolguides.png";
import LifeProTips from "../../images/lifeprotips.png";
import AskMen from "../../images/askmen.png";

export default function SideBar({ setCachedPostData, setSelectedSubreddit, setSearch, setSortTop, setSelectedTimeText, setScrollPosition, setPage }) {
  const setNewSub = (sub) => {
    // fetches the subreddit data and adds appropriate data to cachedPostData
    fetch(`https://www.reddit.com/${sub}/about/.json`)
    .then(res => res.json())
    .then(data => {
      if (data) {
        setCachedPostData({
            subreddit_title: data.data.title,
            thumbnail: data.data.icon_img,
            subscribers: data.data.subscribers,
            active_user_count: data.data.active_user_count,
            primary_color: data.data.primary_color, // color for banner
            banner_background_color: data.data.banner_background_color, // color for top banner in actual subreddit
            key_color: data.data.key_color, // color for join buttons, but not always correct
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
        } else {
          console.log("something went wrong fetching from /about/.json");
          return;
        }
      })
      .catch(err => {
        console.log(err);
      }
    )
    // set the selectedSubreddit and search to the clicked subreddit, triggering a fetch request for that subreddit's posts from App.js
    setSelectedSubreddit(sub);
    setSearch(sub);
    setTimeout(() => {
      setSortTop("");
      setSelectedTimeText("Today");
      setScrollPosition(0);
      setPage("subhome");
      document.querySelector(".popular-top").classList.remove("clicked");
      document.querySelector(".popular-new").classList.remove("clicked");
      document.querySelector(".popular-hot").classList.add("clicked");
      document.querySelector(".hot-icon").classList.add("hot-blue")
      document.querySelector(".top-icon").classList.remove("top-blue");
      document.querySelector(".new-icon").classList.remove("new-blue");
      if (document.querySelector(".popular-today")) document.querySelector(".popular-today").classList.add("hide");
    }, 1000);
  }

  return (
    <div className="SideBar">
      <div className="top-community">
        <h2 className="top-community-title">Today's Top Growing Communities</h2>
      </div>
      <div className="community-container">
        <div className="community" onClick={() => setNewSub("r/mademesmile")}>
          <span>1</span>
          <img src={UpV} className="up-v" alt="" />
          <img src={MadeMeSmile} alt="" className="sidebar-subreddit-logo" />
          <span className="sidebar-subreddit-name">r/MadeMeSmile</span>
        </div>
        <div className="community" onClick={() => setNewSub("r/rareinsults")}>
          <span>2</span>
          <img src={UpV} className="up-v" alt="" />
          <img src={RareInsults} alt="" className="sidebar-subreddit-logo" />
          <span className="sidebar-subreddit-name">r/rareinsults</span>
        </div>
        <div className="community" onClick={() => setNewSub("r/coolguides")}>
          <span>3</span>
          <img src={UpV} className="up-v" alt="" />
          <img src={CoolGuides} alt="" className="sidebar-subreddit-logo" />
          <span className="sidebar-subreddit-name">r/coolguides</span>
        </div>
        <div className="community" onClick={() => setNewSub("r/lifeprotips")}>
          <span>4</span>
          <img src={UpV} className="up-v" alt="" />
          <img src={LifeProTips} alt="" className="sidebar-subreddit-logo" />
          <span className="sidebar-subreddit-name">r/LifeProTips</span>
        </div>
        <div className="community" onClick={() => setNewSub("r/askmen")}>
          <span>5</span>
          <img src={UpV} className="up-v" alt="" />
          <img src={AskMen} alt="" className="sidebar-subreddit-logo" />
          <span className="sidebar-subreddit-name">r/AskMen</span>
        </div>
      </div>
      <button className="btn btn-blue view-all-communities">View All</button>
      <div className="small-btns">
        <button className="btn-community-small" onClick={() => setNewSub("r/gaming")}>Gaming</button>
        <button className="btn-community-small" onClick={() => setNewSub("r/news")}>News</button>
        <button className="btn-community-small" onClick={() => setNewSub("r/music")}>Music</button>
        <button className="btn-community-small" onClick={() => setNewSub("r/aww")}>Aww</button>
      </div>
    </div>
  )
}
