import React from 'react'

export default function SingleVideoPost({ clickedPost, flairStyle, flairDisplay }) {
  return (
    <>
      <div className="singlepost-title">
        <span>{clickedPost.title}</span>
        {clickedPost.link_flair_text && <span className="singlepost-flair" style={flairStyle}>{flairDisplay.length > 0 ? flairDisplay : clickedPost.link_flair_text}</span>}
      </div>
      <div className="singlepost-video-background">
        {/*  previously used clickedPost.thumbnail_height as well, test to see if necessary*/}
        {clickedPost.secure_media?.reddit_video?.fallback_url || clickedPost.media?.reddit_video?.fallback_url || clickedPost.preview?.reddit_video_preview?.fallback_url
          ? <video className={clickedPost.thumbnail === "spoiler" ? "singlepost-video spoiler" : "singlepost-video"} controls>
              <source
                src={clickedPost.thumbnail !== "spoiler"
                    ? clickedPost.secure_media?.reddit_video?.fallback_url
                    || clickedPost.media?.reddit_video?.fallback_url
                    || clickedPost.preview?.reddit_video_preview?.fallback_url
                    // || clickedPost.url_overridden_by_dest
                    : undefined} type="video/mp4" />
            </video>
          /* sometimes the API stores video posts as links, in which case all 3 video sources above are empty, and just a thumbnail is available, so in this case it renders as an image instead */
          : <img className="singlepost-image" src={clickedPost.media?.oembed?.thumbnail_url} alt="" />
        }
      </div>
    </>
  )
}
