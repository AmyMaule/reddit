import React, { useEffect, useState } from 'react';

import { 
  determineNumVotes,
  determineTimePosted
} from '../utilities';

import GalleryPost from './homepage/GalleryPost';
import ImagePost from './homepage/ImagePost';
import LinkPost from './homepage/LinkPost';
import PostTopBar from './homepage/PostTopBar';
import TextPost from './homepage/TextPost';
import VideoPost from "./homepage/VideoPost";

export default function Post({ post, setSelectedSubreddit, setScrollPosition, setClickedPostId, setCachedPostData, setPage, setSearch, setSelectedTimeText, setSortTop }) {
  const { id, is_video, is_gallery, num_comments, post_hint, subreddit, title } = post;
  const [subredditInfo, setSubredditInfo] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const posted = determineTimePosted(post.created_utc, false);
  const votes = determineNumVotes(post.ups, post.downs);

  // fetch the subreddit data for each post in order to get the subreddit thumbnail - it also stores data for the singlepost sidebar
  useEffect(() => {
    const abortPost = new AbortController();
    fetch(`https://www.reddit.com/r/${subreddit}/about/.json`, { signal: abortPost.signal })
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
  }, [subreddit]);

  const handlePostClick = postId => {
    // this sets the subreddit thumbnail and other data for the clicked post without having to do another fetch request
    if (postId) setClickedPostId(id);
    setCachedPostData({
      ...subredditInfo,
      posted: posted,
      votes: votes,
      num_comments: num_comments,
      title: title,
      post_hint: post_hint
    })
    setScrollPosition(window.pageYOffset);
  }

  return (
    <div 
      className={
        is_video
          ? "post video-post"
          : post_hint === "image"
            ? "post image-post"
            : post_hint === "link" || is_gallery
              ? "post link-post"
              : "post text-post"
      }
      id={id}
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
            post={post}
            posted={posted}
            setPage={setPage}
            setSearch={setSearch}
            handlePostClick={handlePostClick}
            setSelectedTimeText={setSelectedTimeText}
            setSortTop={setSortTop}
            setScrollPosition={setScrollPosition}
          />}

        {/* Render different types of post based on the media it contains */}
        {is_video || post_hint === "rich:video"
          ? <VideoPost post={post} handlePostClick={handlePostClick} />
          : post_hint === "image"
            ? <ImagePost post={post} handlePostClick={handlePostClick} />
            : post_hint === "link"
            ? <LinkPost post={post} handlePostClick={handlePostClick} />
            : is_gallery
              ? <GalleryPost post={post} handlePostClick={handlePostClick} />
              : <TextPost post={post} handlePostClick={handlePostClick} />
        }

        <div className="post-bottom-bar" >
          <div className="post-comments" onClick={() => handlePostClick("post")}>
            <img src="images/speech.png" className="comments-speechbubble" alt="" />
            <h4 className="comments">{num_comments < 1000 ? num_comments : (num_comments/1000).toFixed(1) + "k"} comments</h4>
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
