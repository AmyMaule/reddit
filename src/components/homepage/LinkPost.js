import React from 'react';
import PostTitleFlair from './PostTitleFlair';

export default function LinkPost({ post, handlePostClick }) {
  const URL = post.url_overridden_by_dest;

  return (
    <>
      <PostTitleFlair 
        handlePostClick={handlePostClick}
        post={post}
        isShortened={true}
        singlePost={false}
      />
      {!post.is_gallery && 
        <div className="post-link-container">
          <a className="post-link" href={URL} target="_blank" rel="noreferrer">{URL.slice(8, 27) + "..."}</a>
        </div>
      }
      <img className="link-image" src={post.thumbnail} onClick={() => handlePostClick("post")} alt="" />
    </>
  )
}
