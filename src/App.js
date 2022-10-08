import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Trending from './components/homepage/Trending';
import SideBar from './components/homepage/SideBar';
import PostContainer from "./components/PostContainer";
import SinglePost from './components/singlepage/SinglePost';
import SideBarPremium from './components/homepage/SideBarPremium';
import SideBarLinks from './components/SideBarLinks';
import Subhome from './components/Subhome';
import SinglePostSideBar from './components/singlepage/SinglePostSideBar';
import SubhomeRules from './components/SubhomeRules';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedSubreddit, setSelectedSubreddit] = useState("");
  const [clickedPostId, setClickedPostId] = useState();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("home");
  const [subredditInfo, setSubredditInfo] = useState("");
  // cachedPostData stores data from the original fetch request and from the fetch request in Post.js for faster loading
  const [cachedPostData, setCachedPostData] = useState({});
  // clickedPost stores the data from fetching the individual post's json data
  const [clickedPost, setClickedPost] = useState("");
  const [clickedPostComments, setClickedPostComments] = useState([]);
  // sortTop determines whether or not an extra sorting string is added to the fetch request to get the posts (e.g. sort by top of today)
  const [sortTop, setSortTop] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  // selectedTimeText is the text that shows in the "top" section of SortPosts ("Today", "This Week", etc)
  const [selectedTimeText, setSelectedTimeText] = useState("Today");

  // useCallback?
  const onClose = e => {
    if (e.target.classList.contains("SinglePost-page") || e.target.classList.contains("top-bar-btn-pointer") || e.target.classList.contains("top-bar-close") || e.target.classList.contains("btn-x")) {
      document.querySelector(".popular-hot").classList.add("clicked");
      document.querySelector(".popular-top").classList.remove("clicked");
      document.querySelector(".popular-new").classList.remove("clicked");
      document.querySelector(".hot-icon").classList.add("hot-blue");
      document.querySelector(".top-icon").classList.remove("top-blue");
      document.querySelector(".new-icon").classList.remove("new-blue");
      if (document.querySelector(".popular-today")) document.querySelector(".popular-today").classList.add("hide");
      setSortTop("");
      setSelectedTimeText("Today");
      setPage("home");
      setClickedPost("");
      setClickedPostComments([]);
      setClickedPostId("");
    }
  }
  
  //rerender to correct scroll position on page change
  useEffect(() => {
    if (page !== "comment") window.scrollTo(0, scrollPosition);
  }, [page]);

  // this fetches the posts for the homepage or subreddit home page
  useEffect(() => {
    const abortApp = new AbortController();
    fetch(`https://www.reddit.com/${selectedSubreddit ? selectedSubreddit : "r/popular"}/.json?limit=50${sortTop}`, { signal: abortApp.signal })
    .then(res => {
      if (res.status === 200) {
      return res.json();
      } else console.log("Status error");
    })
    .then(data => {
      if (data) setPosts(data.data.children);
    })
    .catch(err => {
      if (err.name !== "AbortError") {
        console.log("Error 66:", err);
      }
    })
    return () => abortApp.abort();
  }, [search, sortTop]);
  // selectedSubreddit no longer a dependency due to search bar problems

  // this hides the main scrollbar when the comment page is shown
  useEffect(() => {
    document.body.style.overflow = page === "comment" 
      ? "hidden" 
      : "auto";
  }, [page]);

  // this fetches the data for the post itself including comments
  useEffect(() => {
    const abortClickedPostApp = new AbortController();
    let postData;
    posts.forEach(post => {
      if (post.data.id === clickedPostId) {
        postData = post.data;
        return postData;
      }
    });
    if (postData) {
      fetch(`https://www.reddit.com${postData.permalink}.json`, { signal: abortClickedPostApp.signal })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        }
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
        }
      })

      const wait2200 = setTimeout(() => {
        setPage("comment");
      }, 2200);
      return () => clearTimeout(wait2200);
    }
    return () => abortClickedPostApp.abort();
  }, [clickedPostId]);

  return (
    <div className="App">
      <Navbar
        selectedSubreddit={selectedSubreddit}
        setSelectedSubreddit={setSelectedSubreddit}
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        setCachedPostData={setCachedPostData}
        setSelectedTimeText={setSelectedTimeText}
        setSortTop={setSortTop}
        setScrollPosition={setScrollPosition}
      />
      {/* Trending and the div with className main-container need to hide when SinglePost is shown but not demount, because otherwise they re-render from scratch which causes lag and doesn't save the scroll position */}
      <Trending page={page} />
      {page === "subhome" && <Subhome cachedPostData={cachedPostData} />}
      <div className={page !== "comment" ? "main-container" : "main-container hide"}>
        <PostContainer
          setSubredditInfo={setSubredditInfo}
          posts={posts}
          setClickedPostId={setClickedPostId}
          setSelectedSubreddit={setSelectedSubreddit}
          search={search}
          setSearch={setSearch}
          selectedSubreddit={selectedSubreddit}
          setSortTop={setSortTop}
          setScrollPosition={setScrollPosition}
          setCachedPostData={setCachedPostData}
          page={page}
          setPage={setPage}
          selectedTimeText={selectedTimeText}
          setSelectedTimeText={setSelectedTimeText}
        />
        <div className="sidebar-container">
          {page === "home" && 
            <>
              <SideBar
                subredditInfo={subredditInfo}
                setSubredditInfo={setSubredditInfo}
                setCachedPostData={setCachedPostData}
                setSelectedSubreddit={setSelectedSubreddit}
                setSearch={setSearch}
                setSortTop={setSortTop}
                setSelectedTimeText={setSelectedTimeText}
                setScrollPosition={setScrollPosition}
                setPage={setPage}
              />
              <SideBarPremium />
            </>
          }
          {page === "subhome" && 
            <>
              <SinglePostSideBar
                cachedPostData={cachedPostData}
                clickedPost={clickedPost}
                setSelectedSubreddit={setSelectedSubreddit}
                setScrollPosition={setScrollPosition}
              />
              <SubhomeRules cachedPostData={cachedPostData} />
            </>
          }
          <SideBarLinks page={page} />
        </div>
      </div>
      {page === "comment" &&
        <div className="main-container">
          <SinglePost
            clickedPost={clickedPost}
            posts={posts}
            page={page}
            setPage={setPage}
            setSelectedSubreddit={setSelectedSubreddit}
            comments={clickedPostComments}
            clickedPostId={clickedPostId}
            cachedPostData={cachedPostData}
            onClose={onClose}
            setSearch={setSearch}
            setSortTop={setSortTop}
            setSelectedTimeText={setSelectedTimeText}
            setScrollPosition={setScrollPosition}
        />
        </div>
      }
    </div>
  );
}
export default App;
