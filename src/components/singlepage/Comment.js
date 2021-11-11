import React, { useState, useEffect } from 'react';
import SpeechBubble from "../../images/speech.png";
import UpArrow from "../../images/up-arrow.png";
import DownArrow from "../../images/down-arrow.png";
import DefaultThumbnail from "../../images/logo-small.png";

export default function Comment({ comment }) {
  const [profileImage, setProfileImage] = useState();

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

  // if a post has fewer than 0 upvotes, comment.ups is 0 and post.downs keeps the vote tally, otherwise post.ups keeps the tally and post.downs is 0
  let votes;
  if (comment.ups > 0) {
    if (comment.ups < 1000) {
      votes = comment.ups;
    } else if (comment.ups > 100000) {
      votes = `${(comment.ups/1000).toFixed(0)}k`;
    } else votes = `${(comment.ups/1000).toFixed(1)}k`;
  } else if (comment.downs < 1000) {
      votes = comment.downs;
  } else votes = `-${(comment.downs/1000).toFixed(1)}k`;


  // Fetch the user's avatar separately as it isn't in the main comment data
  useEffect(() => {
    const abortComment = new AbortController();
    // If the post has been deleted or the author has removed their account, the author will be undefined of "[deleted]" so no need to fetch
    if (!comment.author || comment.author === "[deleted]") {
      setProfileImage(DefaultThumbnail);
    } else fetch(`https://www.reddit.com/user/${comment.author}/about/.json`, { signal: abortComment.signal })
    .then(res => res.json())
    .then(data => {
        if (!data?.data?.icon_img) {
          setProfileImage(DefaultThumbnail);
        } else {
        // remove the encoding
        data.data.icon_img = data.data.icon_img.replaceAll("amp;", "");
        setProfileImage(data.data.icon_img);
      }
    })
    .catch(err => {
      if (err.name !== "AbortError" && err.name !== "TypeError") {
        console.log(err.name);
      }
    });
    return () => {
      abortComment.abort();
    };
  }, [comment.author]);

  // TODO - figure out when the comment borders are being hovered over to make them collapsible
  // const mouseBorder = (e) => {
  //   console.log(e.target);
  //
  // }

  // let commentBorders;
  // if (document.querySelector(".comment-border")) commentBorders = Array.from(document.querySelectorAll(".comment-border"));
  // useEffect(() => {
  //   if (!commentBorders) return;
  //   // console.log(commentBorders.length);
  //   commentBorders.map(border => {
  //     border.addEventListener("mouseover", mouseBorder)
  //   })
  //   return () => {
  //     commentBorders.map(border => {
  //     border.removeEventListener("mouseover", mouseBorder)
  //     })
  //   }
  // }, [commentBorders])

  // the last in the series has an undefined body_html so make sure that doesn't render
  if (!comment.body_html) {
    return <></>
  } else return (
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
              <img className="comment-votes-up" src={UpArrow} alt="up-arrow" />
              <div className="comment-votes-count">{votes}</div>
              <img className="comment-votes-down" src={DownArrow} alt="down-arrow" />
            </div>
            <div className="comment-reply-container comment-link">
              <img src={SpeechBubble} className="comment-speechbubble" alt="" />
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
        /* the last object in the children array isn't a comment so make sure it doesn't render */
        if (comment.replies.data.children.length !== 1 && i === comment.replies.data.children.length - 1) return <></>;
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