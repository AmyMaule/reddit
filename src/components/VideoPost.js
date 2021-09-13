import React from 'react';

export default function VideoPost({ post, flairStyle, flairDisplay, handlePostClick }) {
  return (
    <>
      <div className="post-title" onClick={handlePostClick}>
        <span>{post.title}</span>
        {post.link_flair_text && <span className="flair" style={flairStyle}>{flairDisplay.length > 0 ? flairDisplay : post.link_flair_text}</span>}
        {post.is_original_content && <span className="flair-oc">OC</span>}
      </div>
      <div className="video-background" onClick={handlePostClick}>
        {/* For the test cases I ran, if post.is_video was false but post.post_hint === "rich:video", then secure_media was empty */}
        <video className={post.thumbnail === "spoiler" ? "post-video spoiler" : "post-video"}  src={post.is_video ? post.secure_media?.reddit_video.fallback_url : post.preview.reddit_video_preview?.fallback_url}> </video>
      </div>
    </>
  )
}
