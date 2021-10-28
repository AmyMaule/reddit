import React from 'react';
import Comment from './Comment';

export default function CommentsContainer({ comments }) {
  return (
    <>
      {comments && comments.map(comment => {
        return <Comment comment={comment.data} key={comment.data.name} />
      })}
      {/* {comments && <Comment comment={comments[0].data} />} */}
    </>
  )
}
