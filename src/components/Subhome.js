import React from 'react';

export default function Subhome({ cachedPostData }) {
  const subhomeIcon = 
    cachedPostData.thumbnail || 
    cachedPostData.header_img || 
    cachedPostData.icon_img || 
    cachedPostData.community_icon || 
    "images/logo-small.png";

  const subhomeJoin = cachedPostData.key_color || cachedPostData.primary_color || "#444e59";
  
  // If a banner image is given in the API, it is encoded so the amp; must be removed before it can be used
  const getBannerImg = () => {
    if (cachedPostData.banner_background_image) {
      return cachedPostData.banner_background_image.replace("&amp;", "&");
    } else if (cachedPostData.banner_img) {
      return cachedPostData.banner_img;
    }
  }

  // If the subreddit icon is in community_icon, it also needs to be decoded
  if (cachedPostData.community_icon) cachedPostData.community_icon = cachedPostData.community_icon.replace("&amp;", "&");

  // Default bannerHeight to 180px. If a banner_size exists in the API and it is less than 200px, use the API size instead
  const getBannerHeight = () => {
    if (cachedPostData.banner_size && cachedPostData.banner_size < 200) return cachedPostData.banner_size[1];
    return "180px";
  }

  // If the title of the subreddit is greater than 30 characters, the join button needs to shrink to accommodate it all on one line
  const btnWidth = cachedPostData?.subreddit_title?.length > 30 ? 58 : 96;

  // getWidths sets the style properties of the widths object above based on how long the subreddit title is
  const getWidths = () => {
    // default widths
    const widths = {
      titleWidth: "640px",
      positioningWidth: "310px"
    }

    // edit styles for longer titles
    if (cachedPostData?.subreddit_title?.length > 46) {
      widths.titleWidth = "1050px";
      widths.positioningWidth = "0px";
    } else if (cachedPostData?.subreddit_title?.length > 40) {
      widths.titleWidth = "850px";
      widths.positioningWidth = "100px";
    } else if (cachedPostData?.subreddit_title?.length > 36) {
      widths.titleWidth = "750px";
      widths.positioningWidth = "200px";
    }
    return widths;
  }
  const widths = getWidths();

  return (
    <div className="subhome">
      <div className="subhome-header">
        <div
          className="subhome-banner"
          style={{
            height: getBannerHeight(), 
            backgroundColor: cachedPostData.banner_background_color || cachedPostData.key_color || "#444e59", 
            backgroundImage: `url(${getBannerImg()})`
          }}
        />
        <div className="subhome-r-bar">
          <div className="subhome-r-bar-content" style={{width: widths.titleWidth}}>
            <div className="subhome-r-bar-top">
              <img 
                className="subhome-icon"
                src={subhomeIcon}
                alt=""
              />
              <div className="subhome-title-container">
                <div className="subhome-title">{cachedPostData.subreddit_title}</div>
                <div className="subhome-title-small">{cachedPostData.display_name_prefixed}</div>
              </div>
              <button
                className="btn btn-sub-join"
                style={{color: "white", backgroundColor: subhomeJoin, width: btnWidth + "px"}}
              >
                Join
              </button>
            </div>
            <div className="subhome-r-bar-bottom">
              <div className="r-bar-link">Posts</div>
              <div className="r-bar-link">Wiki</div>
              <div className="r-bar-link">Best of</div>
            </div>
          </div>
          <div className="subhome-r-bar-positioning" style={{width: widths.positioningWidth}}></div>
        </div>
      </div>
    </div>
  )
}
