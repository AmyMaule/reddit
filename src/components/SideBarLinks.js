import React from 'react';

export default function SideBarLinks({ page }) {
  const sideBarLinksStyle = {
    marginLeft: page === "home" || page === "subhome" ? "25px" : "12px"
  }
  return (
    <div className="SideBarLinks" style={sideBarLinksStyle}>
      <div className="sidebar-links-container">
        <div className="sidebar-links-left">
          <a href="https://www.reddithelp.com/hc/en-us" target="blank">Help</a>
          <a href="https://www.reddit.com/coins" target="blank">Reddit Coins</a>
          <a href="https://www.reddit.com/premium" target="blank">Reddit Premium</a>
          <a href="https://redditgifts.com/" target="blank">Reddit Gifts</a>
          <a href="https://www.reddit.com/subreddits/a-1/" target="blank">Communities</a>
          <a href="https://www.reddit.com/posts/2020/" target="blank">Rereddit</a>
          <a href="https://www.reddit.com/topics/a-1/" target="blank">Topics</a>
        </div>
        <div className="sidebar-links-right">
          <a href="https://about.reddit.com/" target="blank">About</a>
          <a href="https://about.reddit.com/careers/" target="blank">Careers</a>
          <a href="https://about.reddit.com/press/" target="blank">Press</a>
          <a href="https://www.redditinc.com/advertising" target="blank">Advertise</a>
          <a href="http://www.redditblog.com/" target="blank">Blog</a>
          <a href="https://www.redditinc.com/policies/user-agreement" target="blank">Terms</a>
          <a href="https://www.redditinc.com/policies/content-policy" target="blank">Content policy</a>
          <a href="https://www.redditinc.com/policies/privacy-policy" target="blank">Privacy policy</a>
          <a href="https://www.reddit.com/help/healthycommunities/" target="blank">Mod policy</a>
        </div>
      </div>
      <p className="sidebar-copyright">Reddit Inc © 2022. All rights reserved</p>
    </div>
  )
}
