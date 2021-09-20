import React, { useEffect, useState } from 'react';
import UpArrow from "../images/up-arrow.png";
import DownArrow from "../images/down-arrow.png";
import SpeechBubble from "../images/speech.png";
import ShareArrow from "../images/share-arrow.png";
import SaveBanner from "../images/save.png";
import VideoPost from './VideoPost';
import ImagePost from './ImagePost';
import LinkPost from './LinkPost';
import PostTopBar from './PostTopBar';
import TextPost from './TextPost';

export default function Post({ setSelectedSubreddit, post, setClickedPostURL, setCachedClickedPostData, setScrollPosition }) {
  const [subredditInfo, setSubredditInfo] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  // const [links, setLinks] = useState([]);

  // console.log(links);
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

  useEffect(() => {
    const abortController = new AbortController();
    fetch(`https://www.reddit.com/r/${post.subreddit}/about/.json`, { signal: abortController.signal })
    .then(res => res.json())
    .catch(err => console.log(err))
    .then(data => {
      if (data) {
          setSubredditInfo({
            thumbnail: data.data.icon_img,
            subscribers: data.data.subscribers,
            active_user_count: data.data.active_user_count,
            primary_color: data.data.primary_color, // color for banner
            banner_background_color: data.data.banner_background_color, // color for top banner in actual subreddit
            key_color: data.data.key_color, // color for join buttons, but not always correct
            public_description_html: data.data.public_description_html,
            created_utc: data.data.created_utc
          });
          setIsLoaded(true);
        } else {
          console.log("something went wrong fetching the thumbnail from /about/.json");
          return;
        }
      })
    return () => {
      abortController.abort();
    };
  }, [])

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

  const flairDisplay = post.link_flair_richtext.map((part, i) => {
    if (part.t) return <span key={i+part.a || i+part.t}>{part.t}</span>;
    if (part.u) return <img key={i+part.a} src={part.u} style={{height: "16px", width: "16px", verticalAlign: "bottom"}} />;
  })

  const handlePostClick = () => {
    // this sets the subreddit thumbnail of the clicked post without having to do another fetch request
    setClickedPostURL(`https://www.reddit.com${post.permalink}`);
    setCachedClickedPostData({
      ...subredditInfo,
      posted: posted,
      votes: votes,
      num_comments: post.num_comments,
      title: post.title,
    });
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
        {isLoaded && <PostTopBar
          setSelectedSubreddit={setSelectedSubreddit}
          subredditInfo={subredditInfo}
          subreddit={post.subreddit}
          author={post.author}
          all_awardings={post.all_awardings}
          posted={posted}
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
            : post.post_hint === "link" || post.is_gallery
            ? <LinkPost
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
          <div className="post-comments" onClick={handlePostClick}>
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
