import React from 'react';
import Post from './Post';
import SortPosts from "./SortPosts";

export default function PostContainer({ posts, setSelectedSubreddit, setSearch, selectedSubreddit, setSortTop, setCachedClickedPostData, setScrollPosition, setClickedPostId, setCachedPostData, page, setPage }) {
  return (
    <div className="PostContainer">
      <SortPosts
        setSelectedSubreddit={setSelectedSubreddit}
        setSearch={setSearch}
        selectedSubreddit={selectedSubreddit}
        setSortTop={setSortTop}
        page={page}
      />
      {posts.map(post => {
        return post.data.whitelist_status !== "promo_adult_nsfw" &&
          <Post
            key={post.data.id}
            post={post.data}
            setClickedPostId={setClickedPostId}
            setSelectedSubreddit={setSelectedSubreddit}
            setCachedClickedPostData={setCachedClickedPostData}
            setScrollPosition={setScrollPosition}
            setCachedPostData={setCachedPostData}
            setPage={setPage}
            setSearch={setSearch}
          />
      }
      )}
    </div>
  )
}
