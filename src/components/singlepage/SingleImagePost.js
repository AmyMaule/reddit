import React from 'react'

export default function SingleImagePost({ clickedPost, flairStyle, flairDisplay }) {
  return (
    <>
      <div className="singlepost-title">
        <span>{clickedPost.title}</span>
        {clickedPost.link_flair_text && <span className="singlepost-flair" style={flairStyle}>{flairDisplay.length > 0 ? flairDisplay : clickedPost.link_flair_text}</span>}
        {clickedPost.is_original_content && <span className="flair-oc">OC</span>}
      </div>
      <div className="singlepost-img-center">
        {clickedPost.thumbnail_height &&
          <img
            className={clickedPost.thumbnail === "spoiler" ? "singlepost-image spoiler" : "singlepost-image"}
            src={clickedPost.thumbnail !== "spoiler" ? clickedPost.url_overridden_by_dest : undefined }
            alt=""
          />
        }
      </div>
    </>
  )
}
