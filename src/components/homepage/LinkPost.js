import React from 'react'

export default function LinkPost({ post, flairStyle, flairDisplay, handlePostClick }) {
  return (
    <>
      <div className="post-title post-title-shortened" onClick={handlePostClick}>
        <span>{post.title}</span>
        {post.link_flair_text && <span className="flair" style={flairStyle}>{flairDisplay.length > 0 ? flairDisplay : post.link_flair_text}</span>}
        {post.is_original_content && <span className="flair-oc">OC</span>}
      </div>
      {!post.is_gallery && <div className="post-link-container">
        <a className="post-link" href={post.url_overridden_by_dest} target="_blank" rel="noreferrer">{post.url_overridden_by_dest.slice(8, 27)}...</a>
      </div>}
      <img className="link-image" src={post.thumbnail} onClick={handlePostClick} alt=""/>
    </>
  )
}
