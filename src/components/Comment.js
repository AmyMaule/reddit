import React from 'react';

export default function Comment({ comment }) {
  // if (comment.replies) console.log(comment.replies.data.children)

  function htmlDecode(commentBody){
    let commentContainer = document.createElement("div");
    commentContainer.innerHTML = commentBody;
    return commentContainer.childNodes.length === 0 ? "" : commentContainer.childNodes[0].nodeValue;
  }

  // try to return each comment as its own component

  return (
    <div className="Comment">
      {/* the last in the series has an undefined body_html so make sure that doesn't render */}
      {comment.body_html && <h6 dangerouslySetInnerHTML={{__html: htmlDecode(comment.body_html)}} className="base-comment"></h6>}
      <div>
        {comment.replies && comment.replies.data.children.map((subcomment, i) => {
          /* the last object in the children array isn't a comment so make sure it doesn't render */
          if (comment.replies.data.children.length !== 1 && i === comment.replies.data.children.length - 1) return;
          /* there may be a problem with some comments with null data, that somehow still have children - edit the return when you know why */
          /* return subcomment.data.body && (... .map() return <h6 key={subcomment.data.id} className="second-comment">{subcomment.data.body}</h6> */
          return subcomment.data.body && <h6 key={subcomment.data.id} className="second-comment">{subcomment.data.body}</h6>
          /* subcomment.replies && <h6 className="third-comment">{subcomment.replies.data.children[0]}</h6> */
          })}
      </div>
    </div>
  )
}
