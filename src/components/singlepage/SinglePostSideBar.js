import React from 'react';

import { htmlDecodeWithReplace } from '../../utilities';

export default function SinglePostSideBar({ cachedPostData, setSelectedSubreddit, setSearch, page, setPage, subreddit, setSelectedTimeText, setSortTop, setScrollPosition }) {
  const { active_user_count, display_name_prefixed, subscribers } = cachedPostData;
  const aboutCommunityHeight = page === "comment" ? "34px" : "44px";
  const bannerBackgroundColor = cachedPostData.primary_color || cachedPostData.key_color || "#444e59";

  // If there are a million+ members, round to 1 decimal place and add "m" otherwise if there are 1000+, round to 1 decimal place and add "k"
  const totalMembers = subscribers > 999999
    ? (subscribers/1000000).toFixed(1) + "m"
    : subscribers > 999
      ? (subscribers/1000).toFixed(1) + "k"
      : subscribers;

  // If there are more than 999 active users, round to 1 decimal place and add k (so 18130 becomes 18.1k)
  const activeUsers = active_user_count > 999
    ? (active_user_count/1000).toFixed(1) + "k"
    : active_user_count;

  const created = new Date(cachedPostData.created_utc * 1000).toDateString();

  const btnStyle = {
    backgroundColor: cachedPostData.primary_color || cachedPostData.banner_background_color || cachedPostData.key_color || "#0079d3",
    color: "#FFF"
  }

  const singlePostSetSubhome = () => {
    setSelectedSubreddit("r/" + subreddit);
    setSearch("r/" + subreddit);
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
    <div className={`single-post-sidebar ${page === "comment" ? "sidebar-height" : "subhome-sidebar-margin"}`}>
      <div 
        className="singlepostsidebar-banner"
        style={{color: "white", backgroundColor: bannerBackgroundColor, height: aboutCommunityHeight}}
      >
        {page !== "subhome" && <div className="about-community">About Community</div>}
      </div>
      <div className="singlepostsidebar-container">
        {page === "comment" && 
          <img
            src={cachedPostData.thumbnail || "images/logo-small.png"}
            alt=""
            className="singlepostsidebar-subreddit-thumbnail"
            onClick={() => setSelectedSubreddit(display_name_prefixed)}
          />
        }
        {page === "comment" && 
          <h2 
            className="singlepostsidebar-subreddit"
            onClick={singlePostSetSubhome}
          >
            {display_name_prefixed}
          </h2>
        }
      </div>
      <div 
        className="singlepostsidebar-description"
        dangerouslySetInnerHTML={{__html: htmlDecodeWithReplace(cachedPostData)}}
      ></div>
      <div className="singlepostsidebar-member-info-container">
        <div className="singlepostsidebar-members-container">
          <h6 className="singlepostsidebar-num-members">{totalMembers}</h6>
          <h6 className="singlepostsidebar-members-text">Members</h6>
        </div>
        <div className="singlepostsidebar-online-container">
          <h6 className="singlepostsidebar-num-online">{activeUsers}</h6>
          <h6 className="singlepostsidebar-online-text">Online</h6>
        </div>
      </div>
      <div className="singlepostsidebar-border"></div>
      <div className="singlepostsidebar-created-container">
        <img src="images/cake.png" className="singlepostsidebar-cake" alt="" />
        <h6>Created {created.slice(3)}</h6>
      </div>
      <button className="btn singlepostsidebar-view-all-communities" style={btnStyle}>Join</button>
    </div>
  )
}
