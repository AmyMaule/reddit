import React from 'react'
import PostTitleFlair from '../homepage/PostTitleFlair';

export default function SingleLinkPost({ clickedPost }) {
  // slicing at position 12 works for almost all URLs, but not those that start with en.xxx
  let startSlice = 12;
  if (clickedPost.url_overridden_by_dest.startsWith("https://en.")) startSlice = 8;

  return (
    <>
      <div style={{display: "flex"}}>
      <PostTitleFlair handlePostClick={null} post={clickedPost} isShortened={true} singlePost={true} />
      <div className="singlepost-link-image-container">
        <img className="singlepost-link-image" src={clickedPost.thumbnail} alt="" />
      </div>
      </div>

      <div className="post-link-container">
        {clickedPost.url_overridden_by_dest &&
          <a className={clickedPost.title.length < 200 ? "singlepost-link" : "singlepost-link-long"} href={clickedPost.url_overridden_by_dest} target="_blank" rel="noreferrer">{clickedPost.url_overridden_by_dest.slice(startSlice, 36)}...</a>
        }
      </div>
    </>
  )
}
