import React, { useEffect } from 'react';
import CommentSideBar from './CommentSideBar';
import UpArrow from "../images/up-arrow.png";
import DownArrow from "../images/down-arrow.png";
import SpeechBubble from "../images/speech.png";
import ShareArrow from "../images/share-arrow.png";
import SaveBanner from "../images/save.png";
import x from "../images/x.png"
import SinglePostTopBar from './SinglePostTopBar';
import SingleTextPost from './SingleTextPost';
import SingleVideoPost from './SingleVideoPost';
import SingleImagePost from './SingleImagePost';
import SingleLinkPost from './SingleLinkPost';
import CommentsContainer from './CommentsContainer';
import SideBarLinks from './SideBarLinks';

export default function SinglePost({ clickedPost, setClickedPost, setClickedPostURL, setSelectedSubreddit, comments, setClickedPostComments, cachedClickedPostData, scrollPosition, page, setPage, prevPage, setPrevPage }) {

  const showHomepage = e => {
    if (e.target.classList.contains("SinglePost-page") || e.target.classList.contains("top-bar-btn-pointer") || e.target.classList.contains("top-bar-close") || e.target.classList.contains("btn-x")) {
      setPrevPage(page);
      setPage("home");
      setClickedPost("");
      setClickedPostComments([]);
      // setClickedPostURL must be called in order for the clickedPost to return to an empty string, otherwise the clickedPostURL doesn't reset when the post is closed, and then the same post can't be reopened
      setClickedPostURL("");
      document.querySelector(".SinglePost-page").style.display = "hidden";
      document.querySelector(".CommentSideBar").style.display = "hidden";
    }
  }

  // check if they came from home page or subreddit page, then reset whichever they came from to scrollPosition, or send them to 0,0 for the other
  useEffect(() => {
    // console.log(page, prevPage)
    if (page === "home" && prevPage === "home" || page === "subhome" && prevPage === "subhome") {
      // console.log("scroll position is:", scrollPosition);
      window.scrollTo(0, scrollPosition);
    } else {
      if (document.querySelector(".SinglePost-page")) document.querySelector(".SinglePost-page").scrollTop = 0;
      window.scrollTo(0, 0);
    }
  }, [page])

  useEffect(() => {
    document.body.addEventListener("click", e => {
        showHomepage(e);
    });
    return function cleanupSinglePost() {
      window.removeEventListener('click', showHomepage);
    }
  }, []);

  return (
    <>
    <div className="SinglePost-page">
      <div className="singlepost-close">
        <div className="top-bar-votes-container">
          <img src={UpArrow} className="top-bar-up-arrow" />
          <span className="top-bar-votes">{cachedClickedPostData.votes}</span>
          <img src={DownArrow} className="top-bar-down-arrow" />
        </div>
        <div className="top-bar-title-container">
          <h3 className="top-bar-title">{cachedClickedPostData.title}</h3>
          {cachedClickedPostData.link_flair_text && <span className="singlepost-flair" style={cachedClickedPostData.flairStyle}>{cachedClickedPostData.flairDisplay.length > 0 ? cachedClickedPostData.flairDisplay : cachedClickedPostData.link_flair_text}</span>}
        </div>
        <div className="top-bar-btn-container">
          <div className="top-bar-btn-pointer">
            <img src={x} className="btn-x" />
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
              <div className="singlepost-votes-count">{cachedClickedPostData.votes}</div>
              <div>
                <img className="singlepost-votes-down" src={DownArrow} alt="down-arrow" />
              </div>
            </div>
            <div className="singlepost-right">
              <SinglePostTopBar clickedPost={clickedPost} subredditThumbnail={cachedClickedPostData.subredditThumbnail} timePosted={cachedClickedPostData.timePosted}  />

              {clickedPost.is_video || clickedPost.post_hint === "rich:video"
                ? <SingleVideoPost
                    clickedPost={clickedPost}
                    flairStyle={cachedClickedPostData.flairStyle}
                    flairDisplay={cachedClickedPostData.flairDisplay}
                  />
                : clickedPost.post_hint === "image"
                  ? <SingleImagePost
                      clickedPost={clickedPost}
                      flairStyle={cachedClickedPostData.flairStyle}
                      flairDisplay={cachedClickedPostData.flairDisplay}
                    />
                  : clickedPost.post_hint === "link"
                  ? <SingleLinkPost
                      clickedPost={clickedPost}
                      flairStyle={cachedClickedPostData.flairStyle}
                      flairDisplay={cachedClickedPostData.flairDisplay}
                    />
                  : <SingleTextPost
                      clickedPost={clickedPost}
                      flairStyle={cachedClickedPostData.flairStyle}
                      flairDisplay={cachedClickedPostData.flairDisplay}
                    />
              }

              <div className="singlepost-bottom-bar">
                <div className="singlepost-comments">
                  <img src={SpeechBubble} className="singlepost-comments-speechbubble" alt="" />
                  <h4 className="singlepost-comments-text">
                    {cachedClickedPostData.num_comments < 1000 ? cachedClickedPostData.num_comments : (cachedClickedPostData.num_comments/1000).toFixed(1) + "k"} comments
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
                    <button className="btn-white post-btn-login">Log In</button>
                    <button className="btn-blue post-btn-signup">Sign Up</button>
                  </span>
              </div>

              <div className="singlepost-comment-container">
                <CommentsContainer comments={comments} />
              </div>

              <div className="after-comment-box"></div>

            </div>
          </div>
          <div className="sidebar-container">
            <CommentSideBar
              subreddit={cachedClickedPostData.subreddit}
              subredditThumbnail={cachedClickedPostData.subredditThumbnail}
              setSelectedSubreddit={setSelectedSubreddit}
            />
            <SideBarLinks />
          </div>
      </div>
    </div>
    </>
  )
}
