import React from 'react'

export default function SingleLinkPost({ clickedPost, flairStyle, flairDisplay }) {
  return (
    <>
      <div style={{display: "flex"}}>
      <div className="singlepost-title-shortened">
        <span>{clickedPost.title}</span>
        {clickedPost.link_flair_text && <span className="singlepost-flair" style={flairStyle}>{flairDisplay.length > 0 ? flairDisplay : clickedPost.link_flair_text}</span>}
      </div>
      <div className="singlepost-link-image-container">
        <img className="singlepost-link-image" src={clickedPost.thumbnail} alt="" />
      </div>
      </div>

      <div className="post-link-container">
        {clickedPost.url_overridden_by_dest && <a className="singlepost-link" href={clickedPost.url_overridden_by_dest} target="_blank" rel="noreferrer">{clickedPost.url_overridden_by_dest.slice(12, 36)}...</a>}
      </div>
    </>
  )
}
