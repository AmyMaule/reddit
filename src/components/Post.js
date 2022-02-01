import React, { useEffect, useState } from 'react';
import UpArrow from "../images/up-arrow.png";
import DownArrow from "../images/down-arrow.png";
import SpeechBubble from "../images/speech.png";
import ShareArrow from "../images/share-arrow.png";
import SaveBanner from "../images/save.png";
import VideoPost from "./homepage/VideoPost";
import ImagePost from './homepage/ImagePost';
import LinkPost from './homepage/LinkPost';
import PostTopBar from './homepage/PostTopBar';
import TextPost from './homepage/TextPost';
import GalleryPost from './homepage/GalleryPost';

export default function Post({ setSelectedSubreddit, post, setScrollPosition, setClickedPostId, setCachedPostData, setPage, setSearch, setSelectedTimeText, setSortTop }) {
  const [subredditInfo, setSubredditInfo] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // determine how long ago the post was created
  let timeNow = Date.now();
  const postedMsAgo = (timeNow/1000 - post.created_utc);
  let posted;
  if (postedMsAgo < 60) {
    posted = "A few seconds";
  } else if (postedMsAgo < 120) {
    posted = "1 minute";
  } else if (postedMsAgo < 3600) {
    posted = (postedMsAgo/60).toFixed(0) + " minutes";
  } else if (postedMsAgo < 5400) { // 5400 is 1.5 hours
    posted = "1 hour";
  } else if (postedMsAgo < 86400) { // 86400 is 24 hours
    posted = (postedMsAgo/3600).toFixed(0) + " hours";
  } else if (postedMsAgo < 129600) {  // 129600 is 1.5 days
    posted = "1 day";
  } else if (postedMsAgo < 2.592e+6) {  // 2.592e+6 is 30 days
    posted = (postedMsAgo/86400).toFixed(0) + " days";
  } else if (postedMsAgo < 3.942e+6) {  // 3.942e+6 is 1.5 months
    posted = "1 month";
  } else if (postedMsAgo < 3.154e+7) {  // 3.154e+7 is 1 year
    posted = (postedMsAgo/2.592e+6).toFixed(0) + " months";
  } else if (postedMsAgo < 4.73e+7) {  // 4.73e+7 is 1.5 years
    posted = "1 year";
  } else {
    posted = (postedMsAgo/3.154e+7).toFixed(0) + " years";
  }

  // if a post has fewer than 0 upvotes, post.ups is 0 and post.downs keeps the vote tally, otherwise post.ups keeps the tally and post.downs is 0
  let votes;
  if (post.ups > 0) {
    if (post.ups < 1000) {
      votes = post.ups;
    } else if (post.ups > 100000) {
      votes = `${(post.ups/1000).toFixed(0)}k`;
    } else votes = `${(post.ups/1000).toFixed(1)}k`;
  } else if (post.downs < 1000) {
      votes = post.downs;
  } else votes = `-${(post.downs/1000).toFixed(1)}k`;

  const flairStyle = {
    backgroundColor: post.link_flair_background_color || "rgb(237, 239, 241)",
    color: post.link_flair_text_color === "dark" ? "#000" : "#FFF",
    fontSize: "0.75rem",
    fontWeight: "500"
  }

  // Some flair text is encoded (so & shows as &amp; for example) so each flair text is run through htmlDecode before displaying
  function htmlDecode(flairText){
    let flairTextContainer = document.createElement("div");
    flairTextContainer.innerHTML = flairText;
    let result = flairTextContainer.childNodes.length === 0 ? "" : flairTextContainer.childNodes[0].nodeValue;
    return result;
  }

  const flairDisplay = post.link_flair_richtext.map((part, i) => {
    if (part.t) return <span key={i+part.a || i+part.t}>{htmlDecode(part.t)}</span>;
    if (part.u) return <img key={i+part.a} src={part.u} style={{height: "16px", width: "16px", verticalAlign: "bottom"}} alt="" />;
  })

  // this useEffect fetches the subreddit data for each post, in order to get the subreddit thumbnail that isn't in the inital post data - it also stores data for the singlepost sidebar
  useEffect(() => {
    const abortPost = new AbortController();
    fetch(`https://www.reddit.com/r/${post.subreddit}/about/.json`, { signal: abortPost.signal })
    .then(res => res.json())
    .then(data => {
      if (data) {
        setSubredditInfo({
            subreddit_title: data.data.title,
            thumbnail: data.data.icon_img,
            subscribers: data.data.subscribers,
            active_user_count: data.data.active_user_count,
            primary_color: data.data.primary_color, // color for banner
            banner_background_color: data.data.banner_background_color, // color for top banner in actual subreddit
            key_color: data.data.key_color, // color for join buttons, but not always correct
            public_description_html: data.data.public_description_html,
            created_utc: data.data.created_utc,
            header_img: data.data.header_img,
            icon_img: data.data.icon_img,
            display_name_prefixed: data.data.display_name_prefixed,
            community_icon: data.data.community_icon,
            banner_background_image: data.data.banner_background_image,
            banner_size: data.data.banner_size,
            banner_img: data.data.banner_img
          });
          setIsLoaded(true);
        } else {
          console.log("something went wrong fetching the thumbnail from /about/.json");
          return;
        }
      })
      .catch(err => {
        if (err.name !== "AbortError" && err.name !== "TypeError") {
          console.log(err);
        }
      })
    return () => {
      abortPost.abort();
    }
  }, [post.subreddit])

  const handlePostClick = (postId) => {
    // this sets the subreddit thumbnail and other data for the clicked post without having to do another fetch request
    if (postId) setClickedPostId(post.id);
    setCachedPostData({
      ...subredditInfo,
      posted: posted,
      votes: votes,
      num_comments: post.num_comments,
      title: post.title,
      post_hint: post.post_hint
    })
    setScrollPosition(window.pageYOffset);
  }

  return (
    <div className={post.is_video
      ? "Post video-post"
      : post.post_hint === "image"
        ? "Post image-post"
        : post.post_hint === "link" || post.is_gallery
          ? "Post link-post"
          : "Post text-post"} id={post.id}
    >
      <div className="post-votes">
        <div>
          <img className="post-votes-up" src={UpArrow} alt="up-arrow" />
        </div>
        <div className="post-votes-count">{votes}</div>
        <div>
        <img className="post-votes-down" src={DownArrow} alt="down-arrow" />
        </div>
      </div>
      <div className="post-right">
        {isLoaded &&
          <PostTopBar
            setSelectedSubreddit={setSelectedSubreddit}
            thumbnail={subredditInfo.thumbnail}
            all_awardings={post.all_awardings}
            subreddit={post.subreddit}
            author={post.author}
            posted={posted}
            setPage={setPage}
            setSearch={setSearch}
            handlePostClick={handlePostClick}
            setSelectedTimeText={setSelectedTimeText}
            setSortTop={setSortTop}
            setScrollPosition={setScrollPosition}
          />}

        {/* Render different types of post based on the media it contains */}
        {post.is_video || post.post_hint === "rich:video"
          ? <VideoPost
              post={post}
              flairStyle={flairStyle}
              flairDisplay={flairDisplay}
              handlePostClick={handlePostClick}
            />
          : post.post_hint === "image"
            ? <ImagePost
                post={post}
                flairStyle={flairStyle}
                flairDisplay={flairDisplay}
                handlePostClick={handlePostClick}
              />
            : post.post_hint === "link"
            ? <LinkPost
                post={post}
                flairStyle={flairStyle}
                flairDisplay={flairDisplay}
                handlePostClick={handlePostClick}
              />
            : post.is_gallery
              ? <GalleryPost
                  post={post}
                  flairStyle={flairStyle}
                  flairDisplay={flairDisplay}
                  handlePostClick={handlePostClick}
                />
              : <TextPost
                post={post}
                flairStyle={flairStyle}
                flairDisplay={flairDisplay}
                handlePostClick={handlePostClick}
              />
        }

        <div className="post-bottom-bar" >
          <div className="post-comments" onClick={() => handlePostClick("post")}>
            <img src={SpeechBubble} className="comments-speechbubble" alt="" />
            <h4 className="comments">{post.num_comments < 1000 ? post.num_comments : (post.num_comments/1000).toFixed(1) + "k"} comments</h4>
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
      </div>
    </div>
  )
}
