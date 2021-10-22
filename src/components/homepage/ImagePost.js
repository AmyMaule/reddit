import React from 'react';

export default function ImagePost({ post, flairStyle, flairDisplay, handlePostClick }) {
  return (
    <>
      <div className="post-title" onClick={() => handlePostClick("post")}>
        <span>{post.title}</span>
        {post.link_flair_text && <span className="flair" style={flairStyle}>{flairDisplay.length > 0 ? flairDisplay : post.link_flair_text}</span>}
        {post.is_original_content && <span className="flair-oc">OC</span>}
      </div>
      <div className="img-center" onClick={() => handlePostClick("post")}>
          {post.thumbnail_height &&
          <img
            className={post.thumbnail === "spoiler" ? "post-image spoiler" : "post-image"}
            src={post.thumbnail !== "spoiler" ? post.url_overridden_by_dest : undefined }
            alt=""
          />}
      </div>
    </>
  )
}