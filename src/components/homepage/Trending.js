import React, { useState, useEffect } from 'react';
import DefaultThumbnail from "../../images/logo-small.png";

export default function Trending({ page }) {
  const [isLoading, setIsLoading] = useState(true);
  // trendingLinks stores the top trending link posts to use in the Trending component
  const [trendingLinks, setTrendingLinks] = useState([]);
  // numLinks is the number of trending links that will be displayed - 4 by default, unless the screen is too small, then 3 will be displayed
  const [numLinks, setNumLinks] = useState(4);

  // These subs contain popular non-news link posts - these should not be in the trending blocks
  let notTrendingSubs = ["Eyebleach", "youseeingthisshit", "me_irl", "gifs", "educationalgifs", "BeAmazed", "WatchPeopleDieInside", "PublicFreakout", "instantkarma", "KDRAMA", "CozyPlaces", "Whatcouldgowrong", "BetterEveryLoop", "NatureIsFuckingLit", "antiwork", "MadeMeSmile", "dankmemes", "maybemaybemaybe", "aww"];

  useEffect(() => {
    const abortTrending = new AbortController();
    // reddit has recently updated the algorithm that chooses which trending posts to display, so t=hour gives a more accurate display than the previous t=day
    fetch("https://www.reddit.com/r/popular/top/.json?t=hour&limit=100", { signal: abortTrending.signal })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else console.log("Status error Trending");
    })
    .then(data => {
      if (data) {
        data.data.children.forEach((post, i) => {
          // If the post hint is "link" and the notTrendingSubs array doesn't contain the current subreddit
          if (trendingLinks.length < 5 && post.data.post_hint === "link" && notTrendingSubs.indexOf(post.data.subreddit) === -1 ) {
            setTrendingLinks(prevLinks => {
              if (!prevLinks) return post.data;
              return [...prevLinks, post.data];
            });
          }
        });
        return trendingLinks;
      }
    })
    .catch(err => {
      if (err.name !== "AbortError" && err.name !== "TypeError")
        console.log("Trending error:", err);
    });
    return () => {
      abortTrending.abort();
    };
  }, [isLoading, notTrendingSubs]);

  // In order for the trending blocks to load the data, isLoading sets to false once trendingLinks has enough data to render
  useEffect(() => {
    if (trendingLinks.length > 3) {
      trendingLinks.forEach((link, i) => {
        fetch(`https://www.reddit.com/r/${link.subreddit}/about/.json`)
        .then(res => res.json())
        .then(data => {
          trendingLinks[i].iconImg = data.data.icon_img;
        })
        .catch(err => console.log(err));
        setIsLoading(false);
        // the image from the API is encoded using &amp; so needs to be removed in order to display
        link.img = link.preview.images[0].source.url.replace("&amp;", "&");
      });
    }
  }, [trendingLinks]);

  // This useEffect checks the window's innerWidth property, and returns 4 if the innerWidth is at least 1010px, or 3 if it is below 1010px, which will display 4 or 3 trending links
  useEffect(() => {
    function handleResize() {
      setNumLinks(() => {
        if (window.innerWidth >= 1010) {
          return 4;
        } else return 3;
      });
    }
    window.addEventListener("resize", handleResize);
    // Call handleResize immediately so state is updated with initial window size
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    // Trending needs to hide when SinglePost is shown but not demount - otherwise it re-renders from scratch which causes a huge lag and doesn't save the page scroll position
    <div className={page === "home" ? "Trending" : "Trending hide"}>
      <h2 className="trending-title">Trending today</h2>
        <div className="trending-blocks">
        {isLoading
        ? <>
            <div className="trending-block-img"></div>
          </>
        : <>
            {trendingLinks.slice(0, numLinks).map(link => {
              return (
              <a href={link.url_overridden_by_dest} target="_blank" rel="noreferrer" className="trending-link" key={link.url_overridden_by_dest}>
                <img className="trending-block-img" src={link.img} alt="" />
                <div className="trending-block-dark">
                  <div className="trending-links-title">{link.title.slice(0, 50)}{link.title.length > 50 && "..."}</div>
                  <div className="trending-block-subreddit-container">
                    <img src={link.iconImg || DefaultThumbnail} className="trending-block-subreddit-icon" alt="" />
                    <div className="trending-links-subreddit">r/{link.subreddit} {link.subreddit.length < 19 && "and more"}</div>
                  </div>
                </div>
              </a>)
            })}
          </>
      }
      </div>
    </div>
  )
}

