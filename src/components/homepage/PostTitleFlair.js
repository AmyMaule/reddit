import React from 'react';
import { htmlDecode } from '../../utilities';

const PostTitleFlair = ({ handlePostClick, post, isShortened, singlePost, isTopBar }) => {
  const { link_flair_text } = post;
  const containerClass = singlePost 
    ? isShortened
      ? "singlepost-title singlepost-title-shortened"  
      : "singlepost-title"
    : isShortened
      ? "post-title post-title-shortened"
      : "post-title";

  const flairStyle = {
    backgroundColor: post.link_flair_background_color || "rgb(237, 239, 241)",
    color: post.link_flair_text_color === "dark" ? "#000" : "#FFF"
  }

  const flairDisplay = post 
    ? post.link_flair_richtext?.map((part, i) => {
      // Some flair text is encoded (so & shows as &amp; for example) so each flair text is run through htmlDecode before displaying
      if (part.t) return <span key={i+part.a || i+part.t}>{htmlDecode(part.t)}</span>;
      if (part.u) return <img key={i+part.a} src={part.u} className="flair-image" alt="" />;
      return null;
    }) 
    : "";

  // the top bar is the black bar that runs at the top of the page for each SinglePost
  if (isTopBar) {
    return <span className="singlepost-flair" style={flairStyle}>{flairDisplay.length ? flairDisplay : link_flair_text}</span>
  }

  return (
    <div className={containerClass} onClick={() => handlePostClick("post")}>
      <span>{post.title}</span>
      {link_flair_text && 
        <span className={singlePost ? "singlepost-flair" : "flair"} style={flairStyle}>
          {flairDisplay.length ? flairDisplay : htmlDecode(link_flair_text)}
        </span>
      }
      {post.is_original_content && <span className="flair-oc">OC</span>}
    </div>
  )
}

export default PostTitleFlair;
