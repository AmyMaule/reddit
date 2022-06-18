import React from 'react';
import { htmlDecode } from '../../utilities';

const PostTitleFlair = ({ handlePostClick, post, isShortened }) => {
  const flairStyle = {
    backgroundColor: post.link_flair_background_color || "rgb(237, 239, 241)",
    color: post.link_flair_text_color === "dark" ? "#000" : "#FFF",
    fontSize: "0.75rem",
    fontWeight: "500"
  }

  const flairDisplay = post.link_flair_richtext?.map((part, i) => {
    // Some flair text is encoded (so & shows as &amp; for example) so each flair text is run through htmlDecode before displaying
    if (part.t) return <span key={i+part.a || i+part.t}>{htmlDecode(part.t)}</span>;
    if (part.u) return <img key={i+part.a} src={part.u} style={{height: "16px", width: "16px", verticalAlign: "bottom"}} alt="" />;
    return null;
  })

  return (
    <div className={isShortened ? "post-title post-title-shortened" : "post-title"} onClick={() => handlePostClick("post")}>
      <span>{post.title}</span>
      {post.link_flair_text && <span className="flair" style={flairStyle}>{flairDisplay.length > 0 ? flairDisplay : htmlDecode(post.link_flair_text)}</span>}
      {post.is_original_content && <span className="flair-oc">OC</span>}
    </div>
  )
}

export default PostTitleFlair;