import React from 'react';
import DefaultThumbnail from "../images/logo-small.png";

export default function SinglePostTopBar({ clickedPost, clickedPostSubredditThumbnail, timePosted }) {
  const awardStyle = {
    height: "16px",
    width: "16px",
    lineHeight: "16px",
    verticalAlign: "middle",
    paddingRight: "3px",
    paddingLeft: "3px"
  }

  // as clickedPost is undefined on startup (as no post has been clicked), the map can't run, so the ternary operator has to check to see if clickedPost.all_awardings returns undefined before trying to map over it
  let awards = clickedPost.all_awardings ? clickedPost.all_awardings.map((award, i) => {
    if (award.icon_url) {
      return <span key={award.id}><img key={award.id} src={award.icon_url} style={awardStyle} />{award.count > 1 && award.count}</span>;
    }
  }) : "";

  return (
    <div className="singlepost-top">
      <span className="subreddit-thumbnail"><img src={clickedPostSubredditThumbnail ? clickedPostSubredditThumbnail : DefaultThumbnail} style={{height: "20px", width: "20px", borderRadius: "50%", marginRight: "5px"}} /></span>
      <span className="singlepost-subreddit">r/{clickedPost.subreddit}</span>
      <span className="singlepost-separator-dot">•</span>
      <div className="singlepost-posted-by">Posted by u/{clickedPost.author} {timePosted} ago</div>
      <span className="singlepost-awards">{awards}</span>
    </div>
  )
}
