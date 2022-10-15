import React from 'react'
import PostTitleFlair from '../homepage/PostTitleFlair'

export default function SingleTextPost({ clickedPost }) {
  const { thumbnail, thumbnail_height, url_overridden_by_dest } = clickedPost;
  return (
    <>
      <PostTitleFlair
        handlePostClick={null}
        post={clickedPost}
        isShortened={false}
        singlePost={true}
      />
      <div className="singlepost-img-center">
        {thumbnail_height && 
          <img 
            className={thumbnail === "spoiler" ? "singlepost-image spoiler" : "singlepost-image"}
            src={thumbnail !== "spoiler" ? url_overridden_by_dest : null }
            alt="" 
          />
        }
      </div>
    </>
  )
}
