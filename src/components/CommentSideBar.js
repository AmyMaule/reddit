import React from 'react';

export default function CommentSideBar({ subreddit, clickedPostSubredditThumbnail, setSelectedSubreddit }) {
  return (
    <div className="CommentSideBar">
      <div className="comment-sidebar-community"></div>
      <div className="comment-sidebar-community-container">
        <img
          src={clickedPostSubredditThumbnail}
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
