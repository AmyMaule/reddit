import React from 'react';
import Post from "./Post";
import SortPosts from "./SortPosts";

export default function PostContainer({ posts, linkPosts, setLinkPosts, setSelectedSubreddit, setSearch, setClickedPostURL, setSortTop, setCachedClickedPostData, setScrollPosition, page, setPage, setPrevPage, selectedSubreddit }) {
  return (
    <div className="PostContainer">
      <SortPosts
        setSelectedSubreddit={setSelectedSubreddit}
        setSearch={setSearch}
        setSortTop={setSortTop}
        page={page}
        selectedSubreddit={selectedSubreddit}
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
            page={page}
            setPage={setPage}
            setPrevPage={setPrevPage}
            setSearch={setSearch}
          />
      }
      )}
    </div>
  )
}
