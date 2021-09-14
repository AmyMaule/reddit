import React from 'react';
import DefaultThumbnail from "../images/logo-small.png";

export default function CommentSideBar({ subreddit, subredditThumbnail, setSelectedSubreddit }) {
  return (
    <div className="CommentSideBar">
      <div className="comment-sidebar-community"></div>
      <div className="comment-sidebar-community-container">
        <img
          src={subredditThumbnail ? subredditThumbnail : DefaultThumbnail}
          alt=""
          className="comment-sidebar-subreddit-thumbnail"
          onClick={() => setSelectedSubreddit(`r/${subreddit}`)}
        />
        <h2 className="comment-sidebar-subreddit" onClick={() => setSelectedSubreddit(`r/${subreddit}`)}>r/{subreddit}</h2>
      </div>
      <button className="btn-blue view-all-communities">Join</button>
    </div>
  )
}
