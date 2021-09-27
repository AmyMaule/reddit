import React from 'react';
import DefaultThumbnail from "../../images/logo-small.png";

export default function PostTopBar({ setSelectedSubreddit, subredditInfo, subreddit, author, all_awardings, posted }) {
  const awardStyle = {
    height: "16px",
    width: "16px",
    lineHeight: "16px",
    verticalAlign: "middle",
    paddingRight: "3px",
    paddingLeft: "3px"
  }

  // Show awards - as default, only show first 4, then the rest as a "& __ more"
  // if a user clicks on the awards, it should show all of them, not just the first 4
   let showAll;
   let remainingAwards = 0;
   let awards = all_awardings.map((award, i) => {
     if (award.icon_url && i < 4) {
       return <span key={award.id}><img key={award.id} src={award.icon_url} style={awardStyle} />{award.count > 1 && award.count}</span>;
     }
     if (i >= 4) remainingAwards += award.count;
     if (i === all_awardings.length - 1 && all_awardings.length > 4) return <span key={award.id}> & {remainingAwards} more</span>
  })

   let allAwards = all_awardings.map(award => {
    if (award.icon_url) {
      return <span key={award.id}><img key={award.id} src={award.icon_url} style={awardStyle} />{award.count > 1 && award.count}</span>;
    }
  });

  return (
    <div className="post-top">
    {/* tons of subreddits don't have icon links in the API even though they do have their own thumbnails, so they just get the default logo instead */}
      <span className="subreddit-thumbnail"><img src={subredditInfo.thumbnail ? subredditInfo.thumbnail : DefaultThumbnail} style={{height: "20px", width: "20px", borderRadius: "50%", marginRight: "5px"}} /></span>
      <span className="post-subreddit" onClick={() => setSelectedSubreddit(`r/${subreddit}`)}>r/{subreddit}</span>
      <span className="separator-dot">•</span>
      <span className="post-posted-by">Posted by u/{author} {posted} ago</span>
      <span className="post-awards" onClick={() => showAll = true}>{awards}</span>
      <button className="btn btn-blue btn-join">
        <span className="plus">+</span>
        <span className="join">Join</span>
      </button>
  </div>
  )
}
