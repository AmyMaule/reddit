import React from 'react';

export default function TextPost({ post, flairStyle, flairDisplay, handlePostClick }) {
  return (
    <div className="post-title" onClick={handlePostClick}>
      <span>{post.title}</span>
      {post.link_flair_text && <span className="flair" style={flairStyle}>{flairDisplay.length > 0 ? flairDisplay : post.link_flair_text}</span>}
      {post.is_original_content && <span className="flair-oc">OC</span>}
    </div>
  )
}
