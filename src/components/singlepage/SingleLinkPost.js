import React from 'react'
import PostTitleFlair from '../homepage/PostTitleFlair';

export default function SingleLinkPost({ clickedPost }) {
  const URL = clickedPost.url_overridden_by_dest;
  // slicing at position 12 works for most URLs, but not those that start with en.xxx
  const startSlice = URL?.startsWith("https://en.") ? 8 : 12;

  console.log(clickedPost)
  return (
    <>
      <div className="singlepost-content-container">
        <PostTitleFlair
          handlePostClick={null}
          post={clickedPost}
          isShortened={true}
          singlePost={true}
        />
        <img className="singlepost-link-image" src={clickedPost.thumbnail} alt="" />
      </div>
      <div className="post-link-container">
        {URL &&
          <a className={clickedPost.title.length < 200 ? "singlepost-link" : "singlepost-link-long"} href={URL} target="_blank" rel="noreferrer">
            {URL?.slice(startSlice, 36) + "..."}
          </a>
        }
      </div>
    </>
  )
}
