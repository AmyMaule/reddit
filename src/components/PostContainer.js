import React from 'react';
import Post from './Post';
import SortPosts from "./SortPosts";

export default function PostContainer({ posts, setSelectedSubreddit, search, setSearch, selectedSubreddit, setSortTop, setCachedClickedPostData, setScrollPosition, setClickedPostId, setCachedPostData, page, setPage, selectedTimeText, setSelectedTimeText }) {
  return (
    <div className="PostContainer">
      <SortPosts
        setSelectedSubreddit={setSelectedSubreddit}
        setSearch={setSearch}
        selectedSubreddit={selectedSubreddit}
        setSortTop={setSortTop}
        page={page}
        search={search}
        selectedTimeText={selectedTimeText}
        setSelectedTimeText={setSelectedTimeText}
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
            setSortTop={setSortTop}
            setSelectedTimeText={setSelectedTimeText}
          />
      }
      )}
    </div>
  )
}
