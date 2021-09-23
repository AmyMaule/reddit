import React, { useState, useEffect } from 'react'

export default function Trending({ page }) {
  const [isLoading, setIsLoading] = useState(true);
  const [trendingLinks, setTrendingLinks] = useState([]);

    // trendingLinks stores the top trending link posts to use in the Trending component
  // let trendingLinks = [];
  useEffect(() => {
    fetch("https://www.reddit.com/r/popular/top/.json?t=day&limit=100")
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else console.log("Status error fetching top 100");
    })
    .then(data => {
      data.data.children.map(post => {
        if (post.data.post_hint === "link") {
          if (trendingLinks.length < 4) {
            setTrendingLinks(prevLinks => {
              if (!prevLinks) return post.data;
              // console.log("prev", prevLinks);
              // console.log("!", trendingLinks);
              setIsLoading(false);
              return [...prevLinks, post.data];
            })
          }
        }
      })
    })
    .catch(err => {
      console.log("trending 26:", err);
    })
  }, [isLoading]);



  return (
    <div className={page === "home" ? "Trending" : "Trending hide"}>
      <h2 className="trending-title">Trending today</h2>
        <div className="trending-blocks">
        {isLoading
        ? <>
            <div className="trending-block">Trending 1</div>
            <div className="trending-block">Trending 2</div>
            <div className="trending-block">Trending 3</div>
            <div className="trending-block">Trending 4</div>
          </>
        :
        <>
          <div className="trending-block">{trendingLinks[0].subreddit}</div>
          <div className="trending-block">{trendingLinks[0].subreddit}</div>
          <div className="trending-block">{trendingLinks[0].subreddit}</div>
          <div className="trending-block">{trendingLinks[0].subreddit}</div>
          {/* <div className="trending-block">{typeof trendingLinks}</div> */}
          {/* <div className="trending-block">{trendingLinks[2].subreddit}</div> */}
          {/* <div className="trending-block">{trendingLinks[3].subreddit}</div> */}
        </>
      }
      </div>
    </div>
  )
}

