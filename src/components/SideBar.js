import React from 'react';
import UpV from "../images/up-v.png";
import MadeMeSmile from "../images/mademesmile.png";
import RareInsults from "../images/rareinsults.png";
import CoolGuides from "../images/coolguides.png";
import LifeProTips from "../images/lifeprotips.png";
import AskMen from "../images/askmen.png";

export default function SideBar({ selectedSubreddit, setSelectedSubreddit, setSearch, page, setPage, setPrevPage }) {
  const handleSubredditChange = sub => {
    setSelectedSubreddit(sub);
    setSearch(selectedSubreddit);
    // setSelectedSubreddit("");
    setPrevPage(page);
    setPage("subhome");
  }

  return (
    <div className="SideBar">
      <div className="top-community">
        <h2 className="top-community-title">Today's Top Growing Communities</h2>
      </div>
      <div className="community-container">
        <div className="community" onClick={() => handleSubredditChange("r/mademesmile")}>
          <span>1</span>
          <img src={UpV} className="up-v" alt="" />
          <img src={MadeMeSmile} alt="" className="sidebar-subreddit-logo" />
          <span className="sidebar-subreddit-name">r/MadeMeSmile</span>
        </div>
        <div className="community" onClick={() => handleSubredditChange("r/rareinsults")}>
          <span>2</span>
          <img src={UpV} className="up-v" alt="" />
          <img src={RareInsults} alt="" className="sidebar-subreddit-logo" />
          <span className="sidebar-subreddit-name">r/rareinsults</span>
        </div>
        <div className="community" onClick={() => handleSubredditChange("r/coolguides")}>
          <span>3</span>
          <img src={UpV} className="up-v" alt="" />
          <img src={CoolGuides} alt="" className="sidebar-subreddit-logo" />
          <span className="sidebar-subreddit-name">r/coolguides</span>
        </div>
        <div className="community" onClick={() => handleSubredditChange("r/lifeprotips")}>
          <span>4</span>
          <img src={UpV} className="up-v" alt="" />
          <img src={LifeProTips} alt="" className="sidebar-subreddit-logo" />
          <span className="sidebar-subreddit-name">r/LifeProTips</span>
        </div>
        <div className="community" onClick={() => handleSubredditChange("r/askmen")}>
          <span>5</span>
          <img src={UpV} className="up-v" alt="" />
          <img src={AskMen} alt="" className="sidebar-subreddit-logo" />
          <span className="sidebar-subreddit-name">r/AskMen</span>
        </div>
      </div>
      <button className="btn-blue view-all-communities">View All</button>
      <div className="small-btns">
        <button className="btn-community-small" onClick={() => handleSubredditChange("r/videos")}>Videos</button>
        <button className="btn-community-small" onClick={() => handleSubredditChange("r/news")}>News</button>
        <button className="btn-community-small" onClick={() => handleSubredditChange("r/music")}>Music</button>
        <button className="btn-community-small" onClick={() => handleSubredditChange("r/aww")}>Aww</button>
      </div>
    </div>
  )
}
