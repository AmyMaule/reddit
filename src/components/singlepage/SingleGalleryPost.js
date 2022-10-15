import React, { useState, useEffect } from 'react';
import PostTitleFlair from '../homepage/PostTitleFlair';

export default function SingleGalleryPost({ clickedPost }) {
  const [currentImageClicked, setCurrentImageClicked] = useState(0);

  let galleryData = Object.entries(clickedPost.media_metadata);
  let validGalleryData = galleryData.filter(item => item[1].status === "valid")
  let galleryImages = validGalleryData.map(item => item[1].p[item[1].p.length-1].u.replaceAll("&amp;", "&"));

  // To make sure the post renders at the correct height, scale it based on the largest height in the gallery
  let postHeight = 0;
  validGalleryData.forEach(item => {
    if (item[1].p[item[1].p.length-1].y > postHeight) {
      postHeight = item[1].p[item[1].p.length-1].y;
    }
  })

  useEffect(() => {
    // rerender component when currentImage changes
  }, [currentImageClicked])

  return (
    <>
      <PostTitleFlair handlePostClick={null} post={clickedPost} isShortened={false} singlePost={true} />
      <div className="singlepost-img-center">
        <div className="singlepost-gallery-btn-container">
          {currentImageClicked !== 0 && 
            <button
              className="singlepost-gallery-button singlepost-gallery-button-left"
              onClick={() => setCurrentImageClicked(prev => prev-1)}
            >
              <span>&#x2039;</span>
            </button>
          }
        </div>
        <img
          className="singlepost-image" // singlepost-gallery-image
          src={galleryImages[currentImageClicked]}
          alt=""
        />
        <div className="singlepost-gallery-btn-container">
          {currentImageClicked !== galleryImages.length-1 && 
            <button 
              className="singlepost-gallery-button singlepost-gallery-button-right"
              onClick={() => setCurrentImageClicked(prev => prev+1)}
            >
              <span>&#x203A;</span>
            </button>
          }
        </div>
      </div>
    </>
  )
}
