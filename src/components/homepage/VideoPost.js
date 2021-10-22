import React from 'react';

export default function VideoPost({ post, flairStyle, flairDisplay, handlePostClick }) {
  return (
    <>
      <div className="post-title" onClick={() => handlePostClick("post")}>
        <span>{post.title}</span>
        {post.link_flair_text && <span className="flair" style={flairStyle}>{flairDisplay.length > 0 ? flairDisplay : post.link_flair_text}</span>}
        {post.is_original_content && <span className="flair-oc">OC</span>}
      </div>
      <div className="video-background" onClick={() => handlePostClick("post")}>
        {/* For the test cases I ran, if post.is_video was false but post.post_hint === "rich:video", then secure_media was empty */}
        {post.secure_media?.reddit_video?.fallback_url || post.media?.reddit_video?.fallback_url || post.preview?.reddit_video_preview?.fallback_url
          ? <video className={post.thumbnail === "spoiler" ? "post-video spoiler" : "post-video"} controls>
              <source src={post.is_video ? post.secure_media?.reddit_video.fallback_url : post.preview.reddit_video_preview?.fallback_url} type="video/mp4" />
            </video>

          /* sometimes the API stores video posts as links, in which case all 3 video sources above are empty, and just a thumbnail is available, so in this case it renders as an image instead */
          : <img className="post-image" src={post.media?.oembed?.thumbnail_url} alt="" />
        }
      </div>
    </>
  )
}
