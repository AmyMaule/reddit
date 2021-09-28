import React from 'react';
import DefaultThumbnail from "../../images/logo-small.png";
import Cake from "../../images/cake.png";

export default function SinglePostSideBar({ subreddit, cachedClickedPostData, setSelectedSubreddit }) {
  // If there are a million or more members, round to 1 decimal place and add "m" otherwise if there are a thousand or more, round to 1 decimal place and add "k"
  const totalMembers = cachedClickedPostData.subscribers > 999999
    ? (cachedClickedPostData.subscribers/1000000).toFixed(1) + "m"
    : cachedClickedPostData.subscribers > 999
      ? (cachedClickedPostData.subscribers/1000).toFixed(0) + "k"
      : cachedClickedPostData.subscribers;

  // If there are more than 999 active users, round it to the nearest 1 decimal place and add k (so 18150 becomes 18.1k)
  const activeUsers = cachedClickedPostData.active_user_count > 999
    ? (cachedClickedPostData.active_user_count/1000).toFixed(1) + "k"
    : cachedClickedPostData.active_user_count;

  let created = new Date(cachedClickedPostData.created_utc*1000).toDateString();

  const btnStyle = {
    color: "#FFF",
    backgroundColor: cachedClickedPostData.banner_background_color || cachedClickedPostData.primary_color || cachedClickedPostData.key_color || "#0079d3"
  }

  const htmlDecode = description => {
    let descriptionContainer = document.createElement("div");
    descriptionContainer.innerHTML = description;
    return descriptionContainer.childNodes.length === 0 ? "" : descriptionContainer.childNodes[0].nodeValue;
  }

  return (
    <div className="SinglePostSideBar">
      <div className="singlepostsidebar-banner" style={{backgroundColor: cachedClickedPostData.primary_color || cachedClickedPostData.key_color || "#bbbbdf"}}></div>
      <div className="singlepostsidebar-container">
        <img
          src={cachedClickedPostData.thumbnail ? cachedClickedPostData.thumbnail : DefaultThumbnail}
          // style={{border: "3px solid " + cachedClickedPostData.primary_color}}
          alt=""
          className="singlepostsidebar-subreddit-thumbnail"
          onClick={() => setSelectedSubreddit(`r/${subreddit}`)}
        />
        <h2 className="singlepostsidebar-subreddit" onClick={() => setSelectedSubreddit(`r/${subreddit}`)}>r/{subreddit}</h2>
      </div>
      <div className="singlepostsidebar-description" dangerouslySetInnerHTML={{__html: htmlDecode(cachedClickedPostData.public_description_html)}}></div>
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
        <img src={Cake} className="singlepostsidebar-cake" alt="" />
        <h6>Created {created.slice(3)}</h6>
      </div>
      <button className="btn singlepostsidebar-view-all-communities" style={btnStyle}>Join</button>
    </div>
  )
}