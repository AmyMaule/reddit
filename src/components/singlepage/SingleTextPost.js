import React from 'react'
import PostTitleFlair from '../homepage/PostTitleFlair'

export default function SingleTextPost({ clickedPost }) {
  return (
    <>
      <PostTitleFlair
        handlePostClick={null}
        post={clickedPost}
        isShortened={false}
        singlePost={true}
      />
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
