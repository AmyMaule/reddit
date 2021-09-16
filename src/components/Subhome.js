import React from 'react';
import PostContainer from './PostContainer';
import SubhomeSideBar from './SubhomeSideBar';

export default function Subhome({ posts }) {
  return (
    <div className="Subhome">
      <div className="subhome-header">
      <div className="subhome-banner"></div>
      <div className="subhome-r-bar"></div>
      </div>
      <div className="subhome-content-container">
        <PostContainer
          posts={posts}
        />
        <SubhomeSideBar />
      </div>
    </div>
  )
}
