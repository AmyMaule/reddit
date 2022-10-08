import React, { useState, useEffect } from 'react';

export default function Trending({ page }) {
  const [isLoading, setIsLoading] = useState(true);
  const [trendingLinks, setTrendingLinks] = useState([]);
  // numLinks is the number of trending links that will be displayed - 4 by default on larger screens
  const [numLinks, setNumLinks] = useState(4);

  // These subs contain popular non-news link posts - these should not be in the trending blocks
  const notTrendingSubs = ["Eyebleach", "youseeingthisshit", "me_irl", "gifs", "educationalgifs", "BeAmazed", "WatchPeopleDieInside", "PublicFreakout", "instantkarma", "KDRAMA", "CozyPlaces", "Whatcouldgowrong", "BetterEveryLoop", "NatureIsFuckingLit", "antiwork", "MadeMeSmile", "dankmemes", "maybemaybemaybe", "aww", "leagueoflegends", "oddlysatisfying"];

  useEffect(() => {
    const abortTrending = new AbortController();
    fetch("https://www.reddit.com/r/popular/top/.json?t=day&limit=100", { signal: abortTrending.signal })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else console.log("Status error Trending");
    })
    .then(data => {
      if (data) {
        data.data.children.forEach(post => {
          // TODO: add extra error check to make sure the same link isn't already in trendingLinks from another subreddit
          // TODO: add extra error check to make sure there are 4 links that qualify, if not, either fetch posts from news subreddit directly or trigger  second fetch request for /popular/top/.json?t=hour
          if (trendingLinks.length < 5 && post.data.post_hint === "link" && notTrendingSubs.indexOf(post.data.subreddit) === -1) {
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
      if (err.name !== "AbortError") {
        console.log("Trending error:", err);
      }
    });

    return () => abortTrending.abort();
  }, [isLoading, notTrendingSubs, trendingLinks]);

  // In order for the trending blocks to load the data, isLoading sets to false once trendingLinks has enough data to render
  useEffect(() => {
    if (trendingLinks.length > 3) {
      trendingLinks.forEach((link, i) => {
        fetch(`https://www.reddit.com/r/${link.subreddit}/about/.json`)
          .then(res => res.json())
          .then(data => trendingLinks[i].iconImg = data.data.icon_img)
          .catch(err => console.log(err));
        setIsLoading(false);
        // remove encoding from the image from the API
        link.img = link.preview.images[0].source.url.replace("&amp;", "&");
      });
    }
  }, [trendingLinks]);

  // determine how many links to show
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
    // Trending hides when SinglePost is shown but does not demount to reduce lag and save the scroll position
    <div className={page === "home" ? "Trending" : "Trending hide"}>
      <h2 className="trending-title">Trending today</h2>
        <div className="trending-blocks">
        {isLoading
          ? <div className="trending-block-img"></div>
          : <>
              {trendingLinks.slice(0, numLinks).map((link, i) => {
                const URL = link.url_overridden_by_dest;
                return (
                <a href={URL} target="_blank" rel="noreferrer" className="trending-link" key={i + URL}>
                  <img className="trending-block-img" src={link.img} alt="" />
                  <div className="trending-block-dark">
                    <div className="trending-links-title">{link.title.slice(0, 50)}{link.title.length > 50 && "..."}</div>
                    <div className="trending-block-subreddit-container">
                      <img src={link.iconImg || "images/logo-small.png"} className="trending-block-subreddit-icon" alt="" />
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
