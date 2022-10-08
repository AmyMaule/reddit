import React from 'react';

export default function SinglePostTopBar({ clickedPost, cachedPostData, setSelectedSubreddit, setSearch, setPage, setSelectedTimeText, setSortTop, setScrollPosition }) {
  const awardStyle = {
    height: "16px",
    width: "16px",
    lineHeight: "16px",
    verticalAlign: "middle",
    paddingRight: "3px",
    paddingLeft: "3px"
  }

  let awards = clickedPost.all_awardings ? clickedPost.all_awardings.map((award, i) => {
    if (award.icon_url) {
      return <span key={award.id}><img key={award.id} src={award.icon_url} style={awardStyle} alt="" />{award.count > 1 && award.count}</span>;
    } else return null;
  }) : "";

  const singlePostSetSubhome = () => {
    setSelectedSubreddit("r/" + clickedPost.subreddit);
    setSearch("r/" + clickedPost.subreddit);
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
    <div className="singlepost-top">
      <span className="subreddit-thumbnail">
        <img src={cachedPostData.thumbnail || "images/logo-small.png"} style={{height: "21px", width: "21px", borderRadius: "50%", marginRight: "5px"}} alt="" />
      </span>
      <span className="singlepost-subreddit" onClick={singlePostSetSubhome}>r/{clickedPost.subreddit}</span>
      <span className="singlepost-separator-dot">•</span>
      <div className="singlepost-posted-by">Posted by u/{clickedPost.author} {cachedPostData.posted} ago</div>
      <span className="singlepost-awards">{awards}</span>
    </div>
  )
}
