import React from 'react';
import SpeechBubble from "../../images/speech.png";
import ShareArrow from "../../images/share-arrow.png";
import SaveBanner from "../../images/save.png";

export default function Comment({ comment }) {
  function htmlDecode(commentBody){
    let commentContainer = document.createElement("div");
    commentContainer.innerHTML = commentBody;
    let result = commentContainer.childNodes.length === 0 ? "" : commentContainer.childNodes[0].nodeValue;
    return result;
  }

  // determine how long ago the comment was posted
  let timeNow = Date.now();
  const postedMsAgo = (timeNow/1000 - comment.created_utc);
  let posted;
  // Reddit uses "m" for minutes and months
  if (postedMsAgo < 3600) {
    posted = (postedMsAgo/60).toFixed(0) + "m";
  } else if (postedMsAgo < 86400) { // 86400 is 24 hours
    posted = (postedMsAgo/3600).toFixed(0) + "h";
  } else if (postedMsAgo < 2.592e+6) {  // 2.592e+6 is 30 days
    posted = (postedMsAgo/86400).toFixed(0) + "d";
  } else if (postedMsAgo < 3.154e+7) {  // 3.154e+7 is 1 year
    posted = (postedMsAgo/2.592e+6).toFixed(0) + "m";
  } else {
    posted = (postedMsAgo/3.154e+7).toFixed(0) + "y";
  }

  // the last in the series has an undefined body_html so make sure that doesn't render
  if (!comment.body_html) {
    return <></>
  } else return (
    <div className="Comment">
    <div className="comment-details">
      <div>{comment.author}</div>
      <div>{posted}</div>
    </div>
      <ul>
        <li className="base-comment">
          <div dangerouslySetInnerHTML={{__html: htmlDecode(comment.body_html)}}></div>
          <div className="post-bottom-bar" >
          <div className="post-comments">
            <img src={SpeechBubble} className="comments-speechbubble" alt="" />
            <h4 className="comments">Reply</h4>
          </div>
          <div className="post-share-link">
            <img src={ShareArrow} className="share-arrow" alt="" />
            <h4 className="share">Share</h4>
          </div>
          <div className="post-save">
            <img src={SaveBanner} className="save-banner" alt="" />
            <h4 className="save">Save</h4>
          </div>
          <div className="post-more">...</div>
        </div>
        </li>
      </ul>
      <ul>
      {comment.replies && comment.replies.data.children.map((subcomment, i) => {
        /* the last object in the children array isn't a comment so make sure it doesn't render */
        if (comment.replies.data.children.length !== 1 && i === comment.replies.data.children.length - 1) return;
        return (
          <li>
            <Comment key={subcomment.data} comment={subcomment.data} />
          </li>
        )
        })}
        </ul>
    </div>
  )
}




// function displayComment(element) {
//   if (element.hasChildNodes()) {
//     element.childNodes.forEach(displayComment);
//   } else if (element is a comment) {
//     // do something to display it
//   }
// }


// works with first 2 comments
//     <div className="Comment">
    //   {/* the last in the series has an undefined body_html so make sure that doesn't render */}
    //   {comment.body_html && <h6 dangerouslySetInnerHTML={{__html: htmlDecode(comment.body_html)}} className="base-comment"></h6>}
    //   <div>
    //     {comment.replies && comment.replies.data.children.map((subcomment, i) => {
    //       /* the last object in the children array isn't a comment so make sure it doesn't render */
    //       if (comment.replies.data.children.length !== 1 && i === comment.replies.data.children.length - 1) return;
    //       /* there may be a problem with some comments with null data, that somehow still have children - edit the return when you know why */
    //       /* return subcomment.data.body && (... .map() return <h6 key={subcomment.data.id} className="second-comment">{subcomment.data.body}</h6> */
    //       return subcomment.data.body && <h6 key={subcomment.data.id} className="second-comment">{subcomment.data.body}</h6>
    //       /* subcomment.replies && <h6 className="third-comment">{subcomment.replies.data.children[0]}</h6> */
    //       })}
    //   </div>
    // </div>