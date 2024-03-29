import React from 'react';
import PostTitleFlair from './PostTitleFlair';

export default function ImagePost({ post, handlePostClick }) {
  return (
    <>
      <PostTitleFlair handlePostClick={handlePostClick} post={post} isShortened={false} singlePost={false} />
      <div className="img-center" onClick={() => handlePostClick("post")}>
          {post.thumbnail_height &&
            <img
              className={post.thumbnail === "spoiler" ? "post-image spoiler" : "post-image"}
              src={post.thumbnail === "spoiler" ? null : post.url_overridden_by_dest }
              alt=""
            />
          }
      </div>
    </>
  )
}
