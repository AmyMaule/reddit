import React from 'react';
import DefaultThumbnail from "../images/logo-small.png";

export default function PostTopBar({ setSelectedSubreddit, subredditThumbnail, subreddit, author, all_awardings, created_utc }) {
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

  // determine how long ago the post was created
  let timeNow = Date.now();
  const postedMsAgo = (timeNow/1000 - created_utc);
  let posted;
  if (postedMsAgo < 60) {
    posted = "A few seconds";
  } else if (postedMsAgo < 120) {
    posted = "1 minute";
  } else if (postedMsAgo < 3600) {
    posted = (postedMsAgo/60).toFixed(0) + " minutes";
  } else if (postedMsAgo < 5400) { // 5400 is 1.5 hours
    posted = "1 hour";
  } else if (postedMsAgo < 86400) { // 86400 is 24 hours
    posted = (postedMsAgo/3600).toFixed(0) + " hours";
  } else if (postedMsAgo < 129600) {  // 129600 is 1.5 days
    posted = "1 day";
  } else if (postedMsAgo < 2.592e+6) {  // 2.592e+6 is 30 days
    posted = (postedMsAgo/86400).toFixed(0) + " days";
  } else if (postedMsAgo < 3.942e+6) {  // 3.942e+6 is 1.5 months
    posted = "1 month";
  } else if (postedMsAgo < 3.154e+7) {  // 3.154e+7 is 1 year
    posted = (postedMsAgo/2.592e+6).toFixed(0) + " months";
  } else if (postedMsAgo < 4.73e+7) {  // 4.73e+7 is 1.5 years
    posted = "1 year";
  } else {
    posted = (postedMsAgo/3.154e+7).toFixed(0) + " years";
  }

  return (
    <div className="post-top">
    {/* tons of subreddits don't have icon links in the API even though they do have their own thumbnails, so they just get the default logo instead */}
      <span className="subreddit-thumbnail"><img src={subredditThumbnail ? subredditThumbnail : DefaultThumbnail} style={{height: "20px", width: "20px", borderRadius: "50%", marginRight: "5px"}} /></span>
      <span className="post-subreddit" onClick={() => setSelectedSubreddit(`r/${subreddit}`)}>r/{subreddit}</span>
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
