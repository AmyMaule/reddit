import React from 'react';
import PostFlair from './PostFlair';

export default function TextPost({ post, handlePostClick }) {
  return (
    <PostFlair handlePostClick={handlePostClick} post={post} isShortened={false} />
  )
}