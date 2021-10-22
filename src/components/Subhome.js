import React from 'react';

export default function Subhome({ cachedPostData }) {
  // If a banner image is given in the API, it is encoded so the amp; must be removed before it can be used
  let bannerImg;
  if (cachedPostData.banner_background_image) bannerImg = cachedPostData.banner_background_image.replace("&amp;", "&");

  // If the title of the subreddit is greater than 30 characters, the join button needs to shrink to accommodate it all on one line
  let btnWidth = 96;
  if (document.querySelector(".subhome-title")?.innerText.length > 30) btnWidth = 58;

  return (
    <div className="Subhome">
      <div className="subhome-header">
        {bannerImg
          ? <img className="subhome-banner" src={bannerImg} style={cachedPostData.banner_size && {height: cachedPostData.banner_size[1]}}/>
          : <div className="subhome-banner" style={{backgroundColor: cachedPostData.banner_background_color || cachedPostData.key_color || "#444e59"}}></div>}
        <div className="subhome-r-bar">
          <div className="subhome-r-bar-content">
            <div className="subhome-r-bar-top">
              <img className="subhome-icon" src={cachedPostData.thumbnail || cachedPostData.header_img || cachedPostData.icon_img} />
              <div className="subhome-title-container">
                <div className="subhome-title">{cachedPostData.subreddit_title}</div>
                <div className="subhome-title-small">{cachedPostData.display_name_prefixed}</div>
              </div>
              <button className="btn btn-sub-join" style={{color: "white", backgroundColor: cachedPostData.key_color || cachedPostData.primary_color ||  "#444e59", width: btnWidth + "px"}}>Join</button>
            </div>
            <div className="subhome-r-bar-bottom">
              <div className="r-bar-link">Posts</div>
              <div className="r-bar-link">Wiki</div>
              <div className="r-bar-link">Best of</div>
            </div>
          </div>
          <div className="subhome-r-bar-positioning"></div>
        </div>
      </div>
    </div>
  )
}


// rules available at:
// https://www.reddit.com/r/AskReddit/about/rules/.json

// reuse Singlepostsidebar