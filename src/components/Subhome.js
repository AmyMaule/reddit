import React from 'react';
import PostContainer from './PostContainer';
import SubhomeSideBar from './SubhomeSideBar';

export default function Subhome({ posts }) {
  return (
    <div className="Subhome">
      <div className="subhome-header">
        <div className="subhome-banner">Put the banner_img or header_img here</div>
        <div className="subhome-r-bar">
          <div className="subhome-r-bar-content">
            <div className="subhome-r-bar-top">
              <div className="subhome-icon">icon_img</div>
              <div className="subhome-title-container">
                <div className="subhome-title">Ask Reddit...</div>
                <div className="subhome-title-small">r/AskReddit</div>
              </div>
              <button className="btn">Join</button>
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