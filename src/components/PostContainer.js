import React from 'react';
import Post from "./Post";
import SortPosts from "./SortPosts";

export default function PostContainer({ posts, linkPosts, setLinkPosts, setSelectedSubreddit, setSearch, selectedSubreddit, setClickedPostURL, setSortTop, setCachedClickedPostData, setScrollPosition }) {
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
            linkPosts={linkPosts}
            setLinkPosts={setLinkPosts}
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
