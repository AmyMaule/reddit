import React, { useEffect } from 'react';
import UpArrow from "../../images/up-arrow.png";
import DownArrow from "../../images/down-arrow.png";
import SpeechBubble from "../../images/speech.png";
import ShareArrow from "../../images/share-arrow.png";
import SaveBanner from "../../images/save.png";
import x from "../../images/x.png";
import Hide from "../../images/hide.png";
import Report from "../../images/report.png";
import Comment from './Comment';
import SingleGalleryPost from './SingleGalleryPost';
import SingleImagePost from './SingleImagePost';
import SingleLinkPost from './SingleLinkPost';
import SinglePostSideBar from './SinglePostSideBar';
import SinglePostTopBar from './SinglePostTopBar';
import SingleTextPost from './SingleTextPost';
import SingleVideoPost from './SingleVideoPost';
import SideBarLinks from '../SideBarLinks';
import PostTitleFlair from '../homepage/PostTitleFlair';

export default function SinglePost({ clickedPost, cachedPostData, page, setPage, setSelectedSubreddit, comments, onClose, setSearch, setSelectedTimeText, setSortTop, setScrollPosition }) {

  useEffect(() => {
    window.addEventListener("click", onClose);
    return () => {
      window.removeEventListener("click", onClose);
    }
  });

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
          {clickedPost.link_flair_text &&
            <PostTitleFlair handlePostClick={null} post={clickedPost} isShortened={false} singlePost={true} isTopBar={true} />
          }
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
                setSelectedSubreddit={setSelectedSubreddit}
                setSearch={setSearch}
                setPage={setPage}
                setSortTop={setSortTop}
                setSelectedTimeText={setSelectedTimeText}
                setScrollPosition={setScrollPosition}
              />

              {clickedPost.is_video || cachedPostData.post_hint === "rich:video"
                ? <SingleVideoPost clickedPost={clickedPost} />
                : cachedPostData.post_hint === "image"
                  ? <SingleImagePost clickedPost={clickedPost} />
                  : cachedPostData.post_hint === "link"
                  ? <SingleLinkPost clickedPost={clickedPost} />
                  : clickedPost.is_gallery
                    ? <SingleGalleryPost clickedPost={clickedPost} />
                    : <SingleTextPost clickedPost={clickedPost} />
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
                  <img src={Hide} className="singlepost-hide-banner" alt="" />
                  <h4 className="singlepost-save-text">Hide</h4>
                </div>
                <div className="singlepost-report">
                  <img src={Report} className="singlepost-report-banner" alt="" />
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
                {comments && comments.map(comment => {
                  return <Comment comment={comment.data} key={comment.data.name} />
                })}
              </div>

              <div className="after-comment-box"></div>

            </div>
          </div>
          <div className="sidebar-container">
            <SinglePostSideBar
              setSelectedSubreddit={setSelectedSubreddit}
              cachedPostData={cachedPostData}
              setSearch={setSearch}
              page={page}
              setPage={setPage}
              subreddit={clickedPost.subreddit}
              setSortTop={setSortTop}
              setSelectedTimeText={setSelectedTimeText}
              setScrollPosition={setScrollPosition}
            />
            <SideBarLinks />
          </div>
      </div>
    </div>
    </>
  )
}
