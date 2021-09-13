import React from 'react';
import Post from "./Post";
import SortPosts from "./SortPosts";

export default function PostContainer({ posts, setSelectedSubreddit, setSearch, selectedSubreddit, setClickedPostURL, setClickedPostSubredditThumbnail, setClickedPostVotes, setGeoFilter, setSortTop, setTimePosted }) {
  return (
    <div className="PostContainer">
      <SortPosts
        setSelectedSubreddit={setSelectedSubreddit}
        setSearch={setSearch}
        selectedSubreddit={selectedSubreddit}
        setGeoFilter={setGeoFilter}
        setSortTop={setSortTop}
      />
      {posts.map(post => {
        return post.data.whitelist_status !== "promo_adult_nsfw" &&
          <Post
            key={post.data.id}
            post={post.data}
            setClickedPostURL={setClickedPostURL}
            setSelectedSubreddit={setSelectedSubreddit}
            setClickedPostSubredditThumbnail={setClickedPostSubredditThumbnail}
            setClickedPostVotes={setClickedPostVotes}
            setTimePosted={setTimePosted}
          />
      }
      )}
    </div>
  )
}
