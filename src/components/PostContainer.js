import React from 'react';
import Post from "./Post";
import SortPosts from "./SortPosts";

export default function PostContainer({ posts, setSelectedSubreddit, setSearch, selectedSubreddit, setClickedPostURL, setSortTop, setCachedClickedPostData, setScrollPosition }) {
  // let links = [];
  // posts.map(post => {
  //   if (post.data.post_hint === "link") {
  //     links.push(post);
  //   }
  // })

  return (
    <div className="PostContainer">
      <SortPosts
        setSelectedSubreddit={setSelectedSubreddit}
        setSearch={setSearch}
        selectedSubreddit={selectedSubreddit}
        setSortTop={setSortTop}
      />
      {posts.map(post => {
        return post.data.whitelist_status !== "promo_adult_nsfw" &&
          <Post
            key={post.data.id}
            post={post.data}
            setClickedPostURL={setClickedPostURL}
            setSelectedSubreddit={setSelectedSubreddit}
            setCachedClickedPostData={setCachedClickedPostData}
            setScrollPosition={setScrollPosition}
          />
      }
      )}
    </div>
  )
}
