import React, { useState, useEffect, useCallback } from 'react';

export default function PostTopBar({ setSelectedSubreddit, thumbnail, all_awardings, subreddit, author, setSearch, setPage, posted, handlePostClick, setSelectedTimeText, setSortTop, setScrollPosition }) {
  const awardStyle = {
    height: "16px",
    width: "16px",
    lineHeight: "16px",
    verticalAlign: "middle",
    paddingRight: "3px",
    paddingLeft: "3px"
  }

  const showAllAwards = useCallback(() => {
    const allAwards = all_awardings.map(award => {
      if (award.icon_url) {
        return <span key={award.id}><img key={award.id} src={award.icon_url} style={awardStyle} alt="" />{award.count > 1 && award.count}</span>;
      }
    })
    return allAwards
  }, [all_awardings]);

  // Show awards - as default, only show first 4, then the rest as a "& __ more"
  let remainingAwards = 0;
  let initialAwards = all_awardings.map((award, i) => {
    if (award.icon_url && i < 4) {
      return <span key={award.id}><img key={award.id} src={award.icon_url} style={awardStyle} alt="" />{award.count > 1 && award.count}</span>;
    }
    if (i >= 4) remainingAwards += award.count;
    if (i === all_awardings.length - 1 && all_awardings.length > 4) return <span key={award.id}> & {remainingAwards} more</span>
    return null;
  });

  const [showAll, setShowAll] = useState(false);
  const [awards, setAwards] = useState(initialAwards);

  // if a user clicks on the awards, it should show all of them, not just the first 4
  useEffect(() => {
    if (showAll) setAwards(showAllAwards)
  }, [showAll, showAllAwards]);

  // setSubhome sets the current page to subhome and makes a new fetch request from app.js for the chosen subreddit homepage
  const setSubhome = () => {
    // handlePostClick sets cachedPostData, using null if going directly to the subreddit page - if handlePostClick isn't called here, when a subreddit is clicked, it will load with data from the most recent subreddit visited (including title, background, etc) but the posts from the correct subreddit will show
    handlePostClick(null);
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
    <div className="post-top">
    {/* many subreddits don't have icon links in the API even though they do have their own thumbnails, so they just get the default logo */}
      <span className="subreddit-thumbnail">
        <img src={thumbnail || "images/logo-small.png"} style={{height: "20px", width: "20px", borderRadius: "50%", marginRight: "5px"}} alt="" />
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
