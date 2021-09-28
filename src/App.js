import React, { useState, useEffect } from 'react';
import './App.css';
import AllSubs from "./allsubs.json";
import Navbar from './components/Navbar';
import Trending from './components/homepage/Trending';
import SideBar from './components/homepage/SideBar';
import PostContainer from "./components/PostContainer";
import SinglePost from './components/singlepage/SinglePost';
import SideBarPremium from './components/homepage/SideBarPremium';
import SideBarLinks from './components/SideBarLinks';

// TODO load 10 more posts when you're near the bottom of the page
// TODO add keyboard functionality to search bar

function App() {
  // sortedSubs takes allsubs.json and orders them by subscriber count
  const sortedSubs = Object.fromEntries(
    Object.entries(AllSubs).sort(([,a],[,b]) => b-a)
  );
  // Object.keys creates an array of all the subreddits from sortedSubs, so that when filter is called while searching, they appear in order of most to least popular
  let allSubreddits = Object.keys(sortedSubs)
  allSubreddits = allSubreddits.map(sub => sub.toLowerCase());

  const [posts, setPosts] = useState([]);
  const [selectedSubreddit, setSelectedSubreddit] = useState("");
  const [search, setSearch] = useState("none");
  const [page, setPage] = useState("home");
  // clickedPostURL is used to fetch the post's json data
  const [clickedPostURL, setClickedPostURL] = useState("");
  // clickedPost stores the data from fetching the post's json data
  const [clickedPost, setClickedPost] = useState("");
  // cachedClickedPostData stores the post information from the inital fetch request to reuse in SinglePost, as it takes a couple of seconds to buffer if pulling directly from the clickedPost fetch request
  const [clickedPostComments, setClickedPostComments] = useState([]);
  const [cachedClickedPostData, setCachedClickedPostData] = useState({});
  const [sortTop, setSortTop] = useState("");
  const [scrollPosition, setScrollPosition] = useState();

  useEffect(() => {
    const abortApp = new AbortController();
    // console.log(`https://www.reddit.com/${selectedSubreddit ? selectedSubreddit : "r/popular"}/.json?limit=20${sortTop}`);
    fetch(`https://www.reddit.com/${selectedSubreddit ? selectedSubreddit : "r/popular"}/.json?limit=50${sortTop}`, { signal: abortApp.signal })
    .then(res => {
      if (res.status === 200) {
      return res.json();
      } else console.log("Status error");
    })
    .then(data => {
      if (data) {
        setPosts(data.data.children);
      } else console.log("oh dear");
    })
    .catch(err => {
      if (err.name !== "AbortError") {
        console.log("The error is:", err);
      } else console.log("app first fetch aborted");
    })
    return () => {
      abortApp.abort();
    }
  }, [search, sortTop])
  // selectedSubreddit no longer a dependency due to search bar problems

  useEffect(() => {
    if (page !== "home") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [page])

  useEffect(() => {
    const abortClickedPostApp = new AbortController();
    if (clickedPostURL) {
      fetch(`${clickedPostURL}.json`, { signal: abortClickedPostApp.signal })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else console.log("Status error fetching post");
      })
      .then(data => {
        if (data) {
          setClickedPost(data[0].data.children[0].data);
          setClickedPostComments(data[1].data.children);
        }
      })
      .catch(err => {
        if (err.name !== "AbortError") {
          console.log("abortClickedPostApp:", err);
        } else console.log("app fetch aborted");
      })
      const wait2000 = setTimeout(() => {
        setPage("comment");
      }, 2000);
      return () => clearTimeout(wait2000);
    }
    return () => {
      abortClickedPostApp.abort();
    }
  }, [clickedPostURL, page])

  return (
    <div className="App">
      <Navbar
        selectedSubreddit={selectedSubreddit}
        setSelectedSubreddit={setSelectedSubreddit}
        setSearch={setSearch}
        allSubreddits={allSubreddits}
      />
      <Trending page={page} />
      <div className={page === "home" ? "main-container" : "main-container hide"}>
      <PostContainer
        posts={posts}
        setSelectedSubreddit={setSelectedSubreddit}
        setSearch={setSearch}
        selectedSubreddit={selectedSubreddit}
        setClickedPostURL={setClickedPostURL}
        setSortTop={setSortTop}
        setCachedClickedPostData={setCachedClickedPostData}
        setScrollPosition={setScrollPosition}
      />
      <div className="sidebar-container">
        <SideBar setSelectedSubreddit={setSelectedSubreddit} />
        <SideBarPremium />
        <SideBarLinks page={page} />
      </div>
      </div>
      <div className={page === "home" ? "main-container hide" : "main-container"}>
        <SinglePost
          setClickedPostURL={setClickedPostURL}
          clickedPost={clickedPost}
          page={page}
          setPage={setPage}
          setClickedPost={setClickedPost}
          setSelectedSubreddit={setSelectedSubreddit}
          comments={clickedPostComments}
          setClickedPostComments={setClickedPostComments}
          cachedClickedPostData={cachedClickedPostData}
          scrollPosition={scrollPosition}
        />
      </div>
    </div>
  );
}

export default App;

// if (data.before) - display a little popup or add a bar or something that says "new posts" or console.log("new posts")
// check for new posts every 30 seconds, if the "before" property of the data changes, there are new posts?
