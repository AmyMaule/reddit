import React, { useState, useEffect } from 'react';
import DefaultThumbnail from "../../images/logo-small.png";

export default function PostTopBar({ setSelectedSubreddit, thumbnail, all_awardings, subreddit, author,  setSearch, setPage, posted, handlePostClick }) {
  const awardStyle = {
    height: "16px",
    width: "16px",
    lineHeight: "16px",
    verticalAlign: "middle",
    paddingRight: "3px",
    paddingLeft: "3px"
  }

  let allAwards = all_awardings.map(award => {
    if (award.icon_url) {
      return <span key={award.id}><img key={award.id} src={award.icon_url} style={awardStyle} alt="" />{award.count > 1 && award.count}</span>;
    }
  });

  // Show awards - as default, only show first 4, then the rest as a "& __ more"
  let remainingAwards = 0;
  let initialAwards = all_awardings.map((award, i) => {
    if (award.icon_url && i < 4) {
      return <span key={award.id}><img key={award.id} src={award.icon_url} style={awardStyle} alt="" />{award.count > 1 && award.count}</span>;
    }
    if (i >= 4) remainingAwards += award.count;
    if (i === all_awardings.length - 1 && all_awardings.length > 4) return <span key={award.id}> & {remainingAwards} more</span>
  });

  const [showAll, setShowAll] = useState(false);
  const [awards, setAwards] = useState(initialAwards);

  // if a user clicks on the awards, it should show all of them, not just the first 4
  useEffect(() => {
    if (showAll) setAwards(allAwards)
  }, [showAll]); //allAwards

  // setSubhome sets the current page to subhome and makes a new fetch request from app.js for the chosen subreddit homepage
  const setSubhome = () => {
    // handlePostClick sets cachedPostData, using null if going directly to the subreddit page
    handlePostClick(null);
    setSelectedSubreddit("r/" + subreddit);
    setSearch(subreddit);
    setTimeout(() => {
      setPage("subhome");
    }, 1000);
  }

  return (
    <div className="post-top">
    {/* tons of subreddits don't have icon links in the API even though they do have their own thumbnails, so they just get the default logo instead */}
      <span className="subreddit-thumbnail">
        <img src={thumbnail ? thumbnail : DefaultThumbnail} style={{height: "20px", width: "20px", borderRadius: "50%", marginRight: "5px"}} alt="" />
      </span>
      <span className="post-subreddit" onClick={setSubhome}>r/{subreddit}</span>
      <span className="separator-dot">•</span>
      <span className="post-posted-by">Posted by u/{author} {posted} ago</span>
      <span className="post-awards" onClick={() => setShowAll(true)}>{awards}</span>
      <button className="btn btn-blue btn-join">
        <span className="plus">+</span>
        <span className="join">Join</span>
      </button>
  </div>
  )
}
