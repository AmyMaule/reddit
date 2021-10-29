import React, { useState, useEffect } from 'react';
import DefaultThumbnail from "../../images/logo-small.png";

export default function Trending({ page }) {
  const [isLoading, setIsLoading] = useState(true);
  // trendingLinks stores the top trending link posts to use in the Trending component
  const [trendingLinks, setTrendingLinks] = useState([]);

  // These subs contain popular non-news link posts - these should not be in the trending blocks
  let notTrendingSubs = ["Eyebleach", "todayilearned", "youseeingthisshit", "me_irl", "gifs", "educationalgifs", "BeAmazed", "WatchPeopleDieInside", "PublicFreakout", "instantkarma", "GetMotivated", "pcgaming", "KDRAMA", "CozyPlaces", "Damnthatsinteresting", "Whatcouldgowrong", "BetterEveryLoop", "NatureIsFuckingLit", "antiwork", "MadeMeSmile", "aww", "dankmemes"];

  useEffect(() => {
    fetch("https://www.reddit.com/r/popular/top/.json?t=day&limit=100")
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else console.log("Status error fetching top 100");
    })
    .then(data => {
      if (data) {
        data.data.children.map((post, i) => {
          // If the post hint is "link" and the notTrendingSubs array doesn't contain the current subreddit
          if (trendingLinks.length < 5 && post.data.post_hint === "link" && notTrendingSubs.indexOf(post.data.subreddit) === -1 ) {
            setTrendingLinks(prevLinks => {
              if (!prevLinks) return post.data;
              return [...prevLinks, post.data];
            })
          }
        })
        return trendingLinks;
      }
    })
    .catch(err => {
      console.log("trending 26:", err);
    })
  }, [isLoading]);

  // In order for the trending blocks to load the data, isLoading sets to false once trendingLinks has enough data to render
  useEffect(() => {
    if (trendingLinks.length > 3) {
      trendingLinks.map((link, i) => {
        fetch(`https://www.reddit.com/r/${link.subreddit}/about/.json`)
        .then(res => res.json())
        .then(data => {
          trendingLinks[i].iconImg = data.data.icon_img;
        })
        .catch(err => console.log(err))
        setIsLoading(false);
        // the image from the API is encoded using &amp; so needs to be removed in order to display
        link.img = link.preview.images[0].source.url.replace("&amp;", "&");
      })
    }
  }, [trendingLinks])

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
            {trendingLinks.slice(0, 4).map(link => {
              return (
              <a href={link.url_overridden_by_dest} target="_blank" rel="noreferrer" className="trending-link" key={link.url_overridden_by_dest}>
                <img className="trending-block-img" src={link.img} />
                <div className="trending-block-dark">
                  <div className="trending-links-title">{link.title.slice(0, 50)}{link.title.length > 50 && "..."}</div>
                  <div className="trending-block-subreddit-container">
                    <img src={link.iconImg || DefaultThumbnail} className="trending-block-subreddit-icon" />
                    <div className="trending-links-subreddit">r/{link.subreddit} and more</div>
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

