import React from 'react'

export default function SingleLinkPost({ clickedPost, flairStyle, flairDisplay }) {
  return (
    <>
      <div className="singlepost-title-shortened">
        <span>{clickedPost.title}</span>
        {clickedPost.link_flair_text && <span className="singlepost-flair" style={flairStyle}>{flairDisplay.length > 0 ? flairDisplay : clickedPost.link_flair_text}</span>}
      </div>
      <div class="singlepost-link-image-container">
        {clickedPost.thumbnail_height && <img className="singlepost-link-image" src={clickedPost.thumbnail} alt="" /> }
      </div>
      <div className="post-link-container">
        <a className="singlepost-link" href={clickedPost.url_overridden_by_dest} target="_blank" rel="noreferrer">{clickedPost.url_overridden_by_dest.slice(12, 36)}...</a>
      </div>
    </>
  )
}
