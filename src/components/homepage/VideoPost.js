import React from 'react';
import PostFlair from './PostFlair';

export default function VideoPost({ post, handlePostClick }) {
  return (
    <>
      <PostFlair handlePostClick={handlePostClick} post={post} isShortened={false} />
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
