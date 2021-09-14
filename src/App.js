import React, { useState, useEffect } from 'react';
import './App.css';
import AllSubs from "./allsubs.json";
import Navbar from './components/Navbar';
import Trending from './components/Trending';
import SideBar from './components/SideBar';
import PostContainer from './components/PostContainer';
import SinglePost from './components/SinglePost';
import SideBarPremium from './components/SideBarPremium';
import SideBarLinks from './components/SideBarLinks';

// TODO load 10 more posts when you're near the bottom of the page - use document.documentElement.scrollHeight - window.innerHeight ?
// TODO: Subreddit home page, add top/hot fetch("http://www.reddit.com/r/aww/top/.json?sort=top") // THIS WORKS

function App() {
  // sortedSubs takes allsubs.json and orders them by subscriber count
  const sortedSubs = Object.fromEntries(
    Object.entries(AllSubs).sort(([,a],[,b]) => b-a)
  );
  // Object.keys creates an array of all the subreddits from sortedSubs, so that when filter is called while searching, they appear in order of most to least popular
  let allSubreddits = Object.keys(sortedSubs)
  allSubreddits = allSubreddits.map(sub => sub.toLowerCase());

  const [posts, setPosts] = useState([]);
  // const [after, setAfter] = useState("");
  const [linkPosts, setLinkPosts] = useState();
  const [selectedSubreddit, setSelectedSubreddit] = useState("");
  const [search, setSearch] = useState("none");
  const [page, setPage] = useState("home");
  const [prevPage, setPrevPage] = useState("");
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
    // console.log(`https://www.reddit.com/${selectedSubreddit ? selectedSubreddit : "r/popular"}/.json?limit=10${sortTop}`);
    // if (selectedSubreddit === "r/popular/hot" || selectedSubreddit === "r/popular")
    fetch(`https://www.reddit.com/${selectedSubreddit ? selectedSubreddit : "r/popular"}/.json?limit=50${sortTop}`)
    .then(res => {
      if (res.status === 200) {
      return res.json();
      } else console.log("Status error");
    })
    .then(data => {
      if (data) {
        setPosts(data.data.children);
        // try checking for new posts every 30 seconds
        // const checkForNewPosts = setInterval(() => {
        //   if (data.data.before !== null) console.log("There's a before")
        //   if (after !== data.data.after) setAfter(data.data.after);
        // }, 30000);
        // return () => clearInterval(checkForNewPosts);
      } else console.log("oh dear");
    })
  }, [search])
  // selectedSubreddit no longer a dependency

  useEffect(() => {
    if (page !== "home") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [page])

  useEffect(() => {
    if (clickedPostURL) {
      fetch(`${clickedPostURL}.json`)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else console.log("Status error fetching post");
      })
      .then(data => {
        if (data) {
          setClickedPost(data[0].data.children[0].data);
          setClickedPostComments(data[1].data.children);
        } else console.log("data error fetching post");
      })
      // wait2000 waits 2 seconds before loading the comment page to give the fetch request time to get all the data
      const wait2000 = setTimeout(() => {
        setPrevPage(page);
        setPage("comment");
      }, 2000);
      return () => clearTimeout(wait2000);
    }
  }, [clickedPostURL])

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
        linkPosts={linkPosts}
        setLinkPosts={setLinkPosts}
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
          setPage={setPage}
          setPrevPage={setPrevPage}
          setClickedPost={setClickedPost}
          setSelectedSubreddit={setSelectedSubreddit}
          comments={clickedPostComments}
          setClickedPostComments={setClickedPostComments}
          cachedClickedPostData={cachedClickedPostData}
          scrollPosition={scrollPosition}
          page={page}
          prevPage={prevPage}
        />
      </div>
    </div>
  );
}

export default App;

// if (data.before) - display a little popup or add a bar or something that says "new posts" or console.log("new posts")

// setTimeout(function() {
//     getThreads(token, before, limit);
// }, 60000);


  // useEffect(() => {
  //   const dateNow = new Date();
  //   console.log("NEW POSTS!", dateNow.toTimeString())
  // }, [after])

  // check for new posts every 30 seconds, if the "before" property of the data changes, there are new posts ????
