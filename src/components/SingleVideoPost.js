import React from 'react'

export default function SingleVideoPost({ clickedPost, flairStyle, flairDisplay }) {
  return (
    <>
      <div className="singlepost-title">
        <span>{clickedPost.title}</span>
        {clickedPost.link_flair_text && <span className="singlepost-flair" style={flairStyle}>{flairDisplay.length > 0 ? flairDisplay : clickedPost.link_flair_text}</span>}
      </div>
      <div className="singlepost-img-center">
        {clickedPost.thumbnail_height &&
          <video
            className={clickedPost.thumbnail === "spoiler" ? "singlepost-video spoiler" : "singlepost-video"}
            src={clickedPost.thumbnail !== "spoiler" ? clickedPost.media?.reddit_video?.fallback_url || clickedPost.preview?.reddit_video_preview?.fallback_url || clickedPost.url_overridden_by_dest : undefined }
            alt=""
          ></video>}
      </div>
    </>
  )
}
