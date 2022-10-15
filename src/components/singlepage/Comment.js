import React, { useState, useEffect, Fragment } from 'react';

import { 
  determineNumVotes,
  determineTimePosted,
  htmlDecode 
} from '../../utilities';

// TODO - figure out when the comment borders are being hovered over and make them collapsible

export default function Comment({ comment }) {
  const [profileImage, setProfileImage] = useState();
  const posted = determineTimePosted(comment.created_utc, true);
  const votes = determineNumVotes(comment.ups, comment.downs);
  
  // Fetch the user's avatar separately as it isn't in the main comment data
  useEffect(() => {
    const abortComment = new AbortController();
    // If the post has been deleted or the author has removed their account, the author will be undefined or "[deleted]"
    if (!comment.author || comment.author === "[deleted]") {
      setProfileImage("images/logo-small.png");
    } else {
      fetch(`https://www.reddit.com/user/${comment.author}/about/.json`, { signal: abortComment.signal })
        .then(res => res.json())
        .then(data => {
            if (!data?.data?.icon_img) {
              setProfileImage("images/logo-small.png");
            } else {
            // remove the encoding
            data.data.icon_img = data.data.icon_img.replaceAll("&amp;", "&");
            setProfileImage(data.data.icon_img);
          }
        })
        .catch(err => {
          if (err.name !== "AbortError") console.log(err);
        });
    }
    return () => abortComment.abort();
  }, [comment.author]);


  // the last in the series has an undefined body_html so make sure that doesn't render
  if (!comment.body_html) return null;

  return (
    <div className="Comment">
      <ul>
        <li className="base-comment" key={comment.id}>
          <div className="comment-details-container">
            <img src={profileImage} className="comment-avatar" alt="" />
            <div className="comment-details">
              <div className="comment-author">{comment.author}</div>
              <div className="comment-separator-dot">.</div>
              <div className="comment-time-posted">{posted}</div>
            </div>
          </div>
          <div className="comment-border">
            <div className="comment-body" dangerouslySetInnerHTML={{__html: htmlDecode(comment.body_html)}}></div>
            <div className="comment-bottom-bar">
              <div className="comment-votes">
                <img className="comment-votes-up" src="images/up-arrow.png" alt="up-arrow" />
                <div className="comment-votes-count">{votes}</div>
                <img className="comment-votes-down" src="images/down-arrow.png" alt="down-arrow" />
              </div>
              <div className="comment-reply-container comment-link">
                <img src="images/speech.png" className="comment-speechbubble" alt="" />
                <h4 className="comment-reply">Reply</h4>
              </div>
              <h4 className="comment-link comment-share">Share</h4>
              <h4 className="comment-link comment-report">Report</h4>
              <h4 className="comment-link comment-save">Save</h4>
            </div>
          </div>
        </li>
      </ul>
      <ul>
      {comment.replies && comment.replies.data.children.map((subcomment, i) => {
        /* the last object in the children array isn't a comment so shouldn't render */
        if (comment.replies.data.children.length !== 1 && i === comment.replies.data.children.length - 1) {
          return <Fragment key={i}></Fragment>;
        }
        return (
          <li className="subcomment" key={subcomment.data.id}>
            <Comment comment={subcomment.data} />
          </li>
        )
        })}
      </ul>
    </div>
  )
}
