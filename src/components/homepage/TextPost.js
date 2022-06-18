import React from 'react';
import PostTitleFlair from './PostTitleFlair';

export default function TextPost({ post, handlePostClick }) {
  return (
    <PostTitleFlair handlePostClick={handlePostClick} post={post} isShortened={false} />
  )
}