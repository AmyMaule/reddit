import React, { useEffect, useState } from 'react';
import GalleryPost from './homepage/GalleryPost';
import ImagePost from './homepage/ImagePost';
import LinkPost from './homepage/LinkPost';
import PostTopBar from './homepage/PostTopBar';
import TextPost from './homepage/TextPost';
import VideoPost from "./homepage/VideoPost";

export default function Post({ post, setSelectedSubreddit, setScrollPosition, setClickedPostId, setCachedPostData, setPage, setSearch, setSelectedTimeText, setSortTop }) {
  const [subredditInfo, setSubredditInfo] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // determine how long ago the post was created
  const determineTimePosted = () => {
    const timeNow = Date.now();
    const postedMsAgo = (timeNow/1000 - post.created_utc);
    // Reddit uses "m" for minutes and for months
    if (postedMsAgo < 60) {
      return "A few seconds";
    } else if (postedMsAgo < 120) {
      return "1 minute";
    } else if (postedMsAgo < 3600) {
      return (postedMsAgo/60).toFixed(0) + " minutes";
    } else if (postedMsAgo < 5400) { // 5400 is 1.5 hours
      return "1 hour";
    } else if (postedMsAgo < 86400) { // 86400 is 24 hours
      return (postedMsAgo/3600).toFixed(0) + " hours";
    } else if (postedMsAgo < 129600) {  // 129600 is 1.5 days
      return "1 day";
    } else if (postedMsAgo < 2.592e+6) {  // 2.592e+6 is 30 days
      return (postedMsAgo/86400).toFixed(0) + " days";
    } else if (postedMsAgo < 3.942e+6) {  // 3.942e+6 is 1.5 months
      return "1 month";
    } else if (postedMsAgo < 3.154e+7) {  // 3.154e+7 is 1 year
      return (postedMsAgo/2.592e+6).toFixed(0) + " months";
    } else if (postedMsAgo < 4.73e+7) {  // 4.73e+7 is 1.5 years
      return "1 year";
    } else {
      return (postedMsAgo/3.154e+7).toFixed(0) + " years";
    }
  }
  const posted = determineTimePosted();

  // if a post has fewer than 0 upvotes, post.ups is 0 and post.downs keeps the vote tally, otherwise post.ups keeps the tally and post.downs is 0
  const determineNumVotes = () => {
    if (post.ups > 0) {
      if (post.ups < 1000) {
        return post.ups;
      } else if (post.ups > 100000) {
        return `${(post.ups/1000).toFixed(0)}k`;
      } else return `${(post.ups/1000).toFixed(1)}k`;
    } else if (post.downs < 1000) {
      return post.downs;
    } else return `-${(post.downs/1000).toFixed(1)}k`;
  }
  const votes = determineNumVotes();

  // fetch the subreddit data for each post in order to get the subreddit thumbnail - it also stores data for the singlepost sidebar
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
        console.log("Error fetching subreddit data");
        return;
      }
      })
      .catch(err => {
        if (err.name !== "AbortError") {
          console.log(err);
        }
      });
    return () => abortPost.abort();
  }, [post.subreddit]);

  const handlePostClick = postId => {
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
    <div 
      className={post.is_video
        ? "Post video-post"
        : post.post_hint === "image"
          ? "Post image-post"
          : post.post_hint === "link" || post.is_gallery
            ? "Post link-post"
            : "Post text-post"} 
      id={post.id}
    >
      <div className="post-votes">
        <div>
          <img className="post-votes-up" src="images/up-arrow.png"s alt="up-arrow" />
        </div>
        <div className="post-votes-count">{votes}</div>
        <div>
          <img className="post-votes-down" src="images/down-arrow.png" alt="down-arrow" />
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
          ? <VideoPost post={post} handlePostClick={handlePostClick} />
          : post.post_hint === "image"
            ? <ImagePost post={post} handlePostClick={handlePostClick} />
            : post.post_hint === "link"
            ? <LinkPost post={post} handlePostClick={handlePostClick} />
            : post.is_gallery
              ? <GalleryPost post={post} handlePostClick={handlePostClick} />
              : <TextPost post={post} handlePostClick={handlePostClick} />
        }

        <div className="post-bottom-bar" >
          <div className="post-comments" onClick={() => handlePostClick("post")}>
            <img src="images/speech.png" className="comments-speechbubble" alt="" />
            <h4 className="comments">{post.num_comments < 1000 ? post.num_comments : (post.num_comments/1000).toFixed(1) + "k"} comments</h4>
          </div>
          <div className="post-share-link">
            <img src="images/share-arrow.png" className="share-arrow" alt="" />
            <h4 className="share">Share</h4>
          </div>
          <div className="post-save">
            <img src="images/save.png" className="save-banner" alt="" />
            <h4 className="save">Save</h4>
          </div>
          <div className="post-more">...</div>
        </div>
      </div>
    </div>
  )
}
