import React from 'react';

export default function Subhome({ cachedPostData }) {
  // If a banner image is given in the API, it is encoded so the amp; must be removed before it can be used
  let bannerImg;
  if (cachedPostData.banner_background_image) {
    bannerImg = cachedPostData.banner_background_image.replace("&amp;", "&");
  } else if (cachedPostData.banner_img) {
    bannerImg = cachedPostData.banner_img;
  }
  let bannerHeight = "220px";
  if (cachedPostData.banner_size) bannerHeight = cachedPostData.banner_size[1];

  // If the title of the subreddit is greater than 30 characters, the join button needs to shrink to accommodate it all on one line
  let btnWidth = 96;
  if (document.querySelector(".subhome-title")?.innerText.length > 30) btnWidth = 58;

  return (
    <div className="Subhome">
      <div className="subhome-header">
        <div className="subhome-banner" style={{height: bannerHeight, backgroundColor: cachedPostData.banner_background_color || cachedPostData.key_color || "#444e59", backgroundImage: `url(${bannerImg})` }}></div>
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