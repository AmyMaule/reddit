import React, { useEffect } from 'react';
import SinglePostSideBar from './SinglePostSideBar';
import UpArrow from "../../images/up-arrow.png";
import DownArrow from "../../images/down-arrow.png";
import SpeechBubble from "../../images/speech.png";
import ShareArrow from "../../images/share-arrow.png";
import SaveBanner from "../../images/save.png";
import x from "../../images/x.png";
import SinglePostTopBar from './SinglePostTopBar';
import SingleTextPost from './SingleTextPost';
import SingleVideoPost from './SingleVideoPost';
import SingleImagePost from './SingleImagePost';
import SingleGalleryPost from './SingleGalleryPost';
import SingleLinkPost from './SingleLinkPost';
import CommentsContainer from './CommentsContainer';
import SideBarLinks from '../SideBarLinks';

// TODO: sort the thumbnails loading slowly and showing before they are ready
export default function SinglePost({ clickedPost, cachedPostData, page, setPage, setClickedPost, setSelectedSubreddit, comments, setClickedPostComments, scrollPosition, onClose }) {
  const flairStyle = {
    backgroundColor: cachedPostData.link_flair_background_color || "rgb(237, 239, 241)",
    color: cachedPostData.link_flair_text_color === "dark" ? "#000" : "#FFF",
  }

  const flairDisplay = clickedPost ? clickedPost.link_flair_richtext.map((part, i) => {
    if (part.t) return <span key={i+part.a}>{part.t}</span>;
    if (part.u) return <img key={i+part.a} src={part.u } style={{height: "16px", width: "16px", verticalAlign: "bottom"}} alt="" />;
  }) : "";

  useEffect(() => {
    window.addEventListener("click", onClose);
    return () => {
      window.removeEventListener('click', onClose);
    }
  });

  // check if they came from home page or subreddit page, then reset whichever they came from to scrollPosition, or send them to 0,0 for the other
  useEffect(() => {
    // console.log(page, prevPage)
    if (page === "home") {
      // console.log("scroll position is:", scrollPosition);
      window.scrollTo(0, scrollPosition);
    } else {
      if (document.querySelector(".SinglePost-page")) document.querySelector(".SinglePost-page").scrollTop = 0;
      window.scrollTo(0, 0);
    }
  }, [page, scrollPosition]);
  // not sure about dependencies, re-evaluate after subhome page is functioning

  if (page === "home") {
    return <></>
  } else return (
    <>
    <div className="SinglePost-page">
      <div className="singlepost-close">
        <div className="top-bar-votes-container">
          <img src={UpArrow} className="top-bar-up-arrow" alt="up-arrow" />
          <span className="top-bar-votes">{cachedPostData.votes}</span>
          <img src={DownArrow} className="top-bar-down-arrow" alt="down-arrow" />
        </div>
        <div className="top-bar-title-container">
          <h3 className="top-bar-title">{cachedPostData.title}</h3>
          {cachedPostData.link_flair_text && <span className="singlepost-flair" style={flairStyle}>{flairDisplay.length > 0 ? flairDisplay : clickedPost.link_flair_text}</span>}
        </div>
        <div className="top-bar-btn-container">
          <div className="top-bar-btn-pointer">
            <img src={x} className="btn-x" alt="x" />
            <button className="top-bar-close">Close</button>
          </div>
        </div>
      </div>
      <div className="singlepost-container">
          <div className="singlepost-post">
            <div className="singlepost-votes">
              <div>
                <img className="singlepost-votes-up" src={UpArrow} alt="up-arrow" />
              </div>
              <div className="singlepost-votes-count">{cachedPostData.votes}</div>
              <div>
                <img className="singlepost-votes-down" src={DownArrow} alt="down-arrow" />
              </div>
            </div>
            <div className="singlepost-right">
              <SinglePostTopBar
                clickedPost={clickedPost}
                cachedPostData={cachedPostData}
              />

              {clickedPost.is_video || clickedPost.post_hint === "rich:video"
                ? <SingleVideoPost
                    clickedPost={clickedPost}
                    flairStyle={flairStyle}
                    flairDisplay={flairDisplay}
                  />
                : clickedPost.post_hint === "image"
                  ? <SingleImagePost
                      clickedPost={clickedPost}
                      flairStyle={flairStyle}
                      flairDisplay={flairDisplay}
                    />
                  : clickedPost.post_hint === "link"
                  ? <SingleLinkPost
                      clickedPost={clickedPost}
                      flairStyle={flairStyle}
                      flairDisplay={flairDisplay}
                    />
                  : clickedPost.is_gallery
                    ? <SingleGalleryPost
                        clickedPost={clickedPost}
                        flairStyle={flairStyle}
                        flairDisplay={flairDisplay}
                      />
                    : <SingleTextPost
                        clickedPost={clickedPost}
                        flairStyle={flairStyle}
                        flairDisplay={flairDisplay}
                      />
              }

              <div className="singlepost-bottom-bar">
                <div className="singlepost-comments">
                  <img src={SpeechBubble} className="singlepost-comments-speechbubble" alt="" />
                  <h4 className="singlepost-comments-text">
                    {cachedPostData.num_comments < 1000 ? cachedPostData.num_comments : (cachedPostData.num_comments/1000).toFixed(1) + "k"} comments
                  </h4>
                </div>
                <div className="singlepost-share-link">
                  <img src={ShareArrow} className="singlepost-share-arrow" alt="" />
                  <h4 className="singlepost-share-text">Share</h4>
                </div>
                <div className="singlepost-save">
                  <img src={SaveBanner} className="singlepost-save-banner" alt="" />
                  <h4 className="singlepost-save-text">Save</h4>
                </div>
                <div className="singlepost-hide">
                  <img src={SaveBanner} className="singlepost-save-banner" alt="" />
                  <h4 className="singlepost-save-text">Hide</h4>
                </div>
                <div className="singlepost-report">
                  <img src={SaveBanner} className="singlepost-save-banner" alt="" />
                  <h4 className="singlepost-save-text">Report</h4>
                </div>
              </div>

              <div className="signup-bar">
                  <span className="signup-text">Log in or sign up to leave a comment</span>
                  <span>
                    <button className="btn btn-white post-btn-login">Log In</button>
                    <button className="btn btn-blue post-btn-signup">Sign Up</button>
                  </span>
              </div>

              <div className="singlepost-comment-container">
                <CommentsContainer comments={comments} />
              </div>

              <div className="after-comment-box"></div>

            </div>
          </div>
          <div className="sidebar-container">
            <SinglePostSideBar
              clickedPost={clickedPost}
              setSelectedSubreddit={setSelectedSubreddit}
              cachedPostData={cachedPostData}
            />
            <SideBarLinks />
          </div>
      </div>
    </div>
    </>
  )
}
