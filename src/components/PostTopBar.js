import React from 'react';
import DefaultThumbnail from "../images/logo-small.png";

export default function PostTopBar({ page, setPage, setPrevPage, setSelectedSubreddit, subredditThumbnail, subreddit, author, all_awardings, posted, setSearch }) {
  const awardStyle = {
    height: "16px",
    width: "16px",
    lineHeight: "16px",
    verticalAlign: "middle",
    paddingRight: "3px",
    paddingLeft: "3px"
  }

  // Show awards - only show first 4, then the rest as a "& __ more"
  let remainingAwards = 0;
  const awards = all_awardings.map((award, i) => {
    if (award.icon_url && i < 4) {
      return <span key={award.id}><img key={award.id} src={award.icon_url} style={awardStyle} />{award.count > 1 && award.count}</span>;
    }
    if (i >= 4) remainingAwards += award.count;
    if (i === all_awardings.length - 1 && all_awardings.length > 4) return <span key={award.id}> & {remainingAwards} more</span>
  })

  const handleSubredditClick = () => {
    setSelectedSubreddit(`r/${subreddit}`);
    setPrevPage(page);
    setPage("subhome");
    setSearch(subreddit);
  }

  return (
    <div className="post-top">
    {/* tons of subreddits don't have icon links in the API even though they do have their own thumbnails, so they just get the default logo instead */}
      <span className="subreddit-thumbnail"><img src={subredditThumbnail ? subredditThumbnail : DefaultThumbnail} style={{height: "20px", width: "20px", borderRadius: "50%", marginRight: "5px"}} /></span>
      <span className="post-subreddit" onClick={handleSubredditClick}>r/{subreddit}</span>
      <span className="separator-dot">•</span>
      <span className="post-posted-by">Posted by u/{author} {posted} ago</span>
      <span className="post-awards">{awards}</span>
      <button className="btn-blue btn-join">
        <span className="plus">+</span>
        <span className="join">Join</span>
      </button>
  </div>
  )
}
