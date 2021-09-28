import React, { useState, useEffect } from 'react';
import DefaultThumbnail from "../../images/logo-small.png";

export default function Trending({ page }) {
  const [isLoading, setIsLoading] = useState(true);
  // trendingLinks stores the top trending link posts to use in the Trending component
  const [trendingLinks, setTrendingLinks] = useState([]);

  // These subs contain popular non-news link posts - these should not be put in the trending blocks
  let notTrendingSubs = ["Eyebleach", "todayilearned", "youseeingthisshit", "me_irl"];
  useEffect(() => {
    fetch("https://www.reddit.com/r/popular/top/.json?t=day&limit=100")
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else console.log("Status error fetching top 100");
    })
    .then(data => {
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
    })
    .catch(err => {
      console.log("trending 26:", err);
    })
  }, [isLoading]);

  // In order for the trending blocks to load the data, isLoading sets to false once trendingLinks has enough data to render
  useEffect(() => {
    // console.log(trendingLinks[0]);
    if (trendingLinks.length === 4) {
      trendingLinks.map(link => {
        // the image from the API is encoded using &amp; so needs to be removed in order to display
        link.img = link.preview.images[0].source.url.replace("&amp;", "&");
      })
    }
  }, [trendingLinks]);

  useEffect(() => {
    if (trendingLinks.length > 3) {
      trendingLinks.map((link, i) => {
        fetch(`https://www.reddit.com/r/${link.subreddit}/about/.json`)
        .then(res => res.json())
        .then(data => {
          // console.log("1", data.data.icon_img)
          trendingLinks[i].iconImg = data.data.icon_img;
          // console.log("2", trendingLinks[i].iconImg)
        });
        setIsLoading(false);
      })
    }
    // if (trendingLinks) console.log(trendingLinks.iconImg)
  }, [trendingLinks])

  return (
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
              <a href={link.url_overridden_by_dest} target="_blank" className="trending-link">
                {/* <div className="black-overlay"> */}
                  <img className="trending-block-img" src={link.img} />
                {/* </div> */}
                <div className="trending-block-dark">
                  <div className="trending-links-title">{link.title.slice(0, 55)}{link.title.length > 55 && "..."}</div>
                  <div className="trending-block-subreddit-container">
                    <img src={link.iconImg || DefaultThumbnail} className="trending-block-subreddit-icon" />
                    <div className="trending-links-subreddit">r/{link.subreddit} and more</div>
                  </div>
                </div>
              </a>)
            })}
            {/* style={{background: `url(${trendingLinks[i].thumbnail})`, backgroundSize: "cover", backgroundRepeat: "no-repeat"}} */}

            {/* <div className="trending-block">{trendingLinks[1].subreddit}</div>
            <div className="trending-block">{trendingLinks[2].subreddit}</div>
            <div className="trending-block">{trendingLinks[3].subreddit}</div> */}
            {/* subreddit name, title, background thumbnail, link, subreddit image, url_overridden_by_dest */}
          </>
      }
      </div>
    </div>
  )
}

