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
import Subhome from './components/Subhome';
import SinglePostSideBar from './components/singlepage/SinglePostSideBar';
import SubhomeRules from './components/SubhomeRules';

// TODO load 10 more posts when you're near the bottom of the page
// Call <SortPosts /> with different parameters based on whether it is coming from home or subhome (so <SortPosts top={top} hot={hot} /> etc)

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
  const [clickedPostId, setClickedPostId] = useState();
  const [search, setSearch] = useState("none");
  const [page, setPage] = useState("home");
  // cachedPostData stores data from the original fetch request and from the fetch request in Post.js for faster loading
  const [cachedPostData, setCachedPostData] = useState({});
  // clickedPost stores the data from fetching the individual post's json data
  const [clickedPost, setClickedPost] = useState("");
  const [clickedPostComments, setClickedPostComments] = useState([]);
  const [sortTop, setSortTop] = useState("");
  const [scrollPosition, setScrollPosition] = useState();

  // useCallback?
  const onClose = e => {
    if (e.target.classList.contains("SinglePost-page") || e.target.classList.contains("top-bar-btn-pointer") || e.target.classList.contains("top-bar-close") || e.target.classList.contains("btn-x")) {
      setPage("home");
      setClickedPost("");
      setClickedPostComments([]);
      setClickedPostId("");
    }
  }

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
      }
    })
    .catch(err => {
      if (err.name !== "AbortError") {
        console.log("Error 66:", err);
      }
    })
    return () => {
      abortApp.abort();
    }
  }, [search, sortTop])
  // selectedSubreddit no longer a dependency due to search bar problems

  // this hides the main scrollbar when the comment page is shown
  useEffect(() => {
    if (page === "comment") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [page])

// this fetches the data for the post itself including comments
  useEffect(() => {
    const abortClickedPostApp = new AbortController();
    let postData;
    posts.filter(post => {
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
      const wait2000 = setTimeout(() => {
        setPage("comment");
      }, 2000);
      return () => clearTimeout(wait2000);
    }
    return () => {
      abortClickedPostApp.abort();
    }
  }, [clickedPostId])

  return (
    <div className="App">
      <Navbar
        selectedSubreddit={selectedSubreddit}
        setSelectedSubreddit={setSelectedSubreddit}
        search={search}
        setSearch={setSearch}
        allSubreddits={allSubreddits}
        setPage={setPage}
      />
      {/* Trending and the div with className main-container need to hide when SinglePost is shown but not demount, because otherwise they re-render from scratch which causes a huge lag and doesn't save the page scroll position */}
      <Trending page={page} />
      {page === "subhome" && <Subhome cachedPostData={cachedPostData} />}
      <div className={page !== "comment" ? "main-container" : "main-container hide"}>
        <PostContainer
          posts={posts}
          setClickedPostId={setClickedPostId}
          setSelectedSubreddit={setSelectedSubreddit}
          setSearch={setSearch}
          selectedSubreddit={selectedSubreddit}
          setSortTop={setSortTop}
          setScrollPosition={setScrollPosition}
          setCachedPostData={setCachedPostData}
          page={page}
          setPage={setPage}
        />
        <div className="sidebar-container">
          {page === "home" && <SideBar setSelectedSubreddit={setSelectedSubreddit} />}
          {page === "home" && <SideBarPremium />}
          {page === "subhome" && <SinglePostSideBar
                                    cachedPostData={cachedPostData}
                                    clickedPost={clickedPost}
                                    setSelectedSubreddit={setSelectedSubreddit}
                                  />}
          {page === "subhome" && <SubhomeRules cachedPostData={cachedPostData} />}
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
            scrollPosition={scrollPosition}
            clickedPostId={clickedPostId}
            cachedPostData={cachedPostData}
            onClose={onClose}
            setSearch={setSearch}
        />
        </div>
      }
    </div>
  );
}
export default App;