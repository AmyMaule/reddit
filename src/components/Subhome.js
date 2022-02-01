import React from 'react';
import DefaultThumbnail from "../images/logo-small.png";

export default function Subhome({ cachedPostData }) {
  // If a banner image is given in the API, it is encoded so the amp; must be removed before it can be used
  let bannerImg;
  if (cachedPostData.banner_background_image) {
    bannerImg = cachedPostData.banner_background_image.replace("&amp;", "&");
  } else if (cachedPostData.banner_img) {
    bannerImg = cachedPostData.banner_img;
  }

  // If the subreddit icon is in community_icon, it also needs to be decoded
  if (cachedPostData.community_icon) cachedPostData.community_icon = cachedPostData.community_icon.replace("&amp;", "&");

  // Default bannerHeight to 180px and if one exists in the API and it is less than 200px, use the API size instead
  let bannerHeight = "180px";
  if (cachedPostData.banner_size && cachedPostData.banner_size < 200) bannerHeight = cachedPostData.banner_size[1];

  // If the title of the subreddit is greater than 30 characters, the join button needs to shrink to accommodate it all on one line
  let btnWidth = 96;
  if (cachedPostData?.subreddit_title?.length > 30) btnWidth = 58;

  let titleWidth = "640px";
  let positioningWidth = "310px";
  if (cachedPostData?.subreddit_title?.length > 46) {
    titleWidth = "1050px";
    positioningWidth = "0px";
  } else if (cachedPostData?.subreddit_title?.length > 40) {
    titleWidth = "850px";
    positioningWidth = "100px";
  } else if (cachedPostData?.subreddit_title?.length > 36) {
    titleWidth = "750px";
    positioningWidth = "200px";
  }

  return (
    <div className="Subhome">
      <div className="subhome-header">
        <div className="subhome-banner" style={{height: bannerHeight, backgroundColor: cachedPostData.banner_background_color || cachedPostData.key_color || "#444e59", backgroundImage: `url(${bannerImg})` }}></div>
        <div className="subhome-r-bar">
          <div className="subhome-r-bar-content" style={{width: titleWidth}}>
            <div className="subhome-r-bar-top">
              <img className="subhome-icon" src={cachedPostData.thumbnail || cachedPostData.header_img || cachedPostData.icon_img || cachedPostData.community_icon || DefaultThumbnail} alt="" />
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
          <div className="subhome-r-bar-positioning" style={{width: positioningWidth}}></div>
        </div>
      </div>
    </div>
  )
}