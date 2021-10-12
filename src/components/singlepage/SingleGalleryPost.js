import React, { useState, useEffect } from 'react';

export default function SingleGalleryPost({ clickedPost, flairStyle, flairDisplay }) {
  const [currentImageClicked, setCurrentImageClicked] = useState(0);

  let galleryData = Object.entries(clickedPost.media_metadata);
  let validGalleryData = galleryData.filter(item => item[1].status === "valid")
  let galleryImages = validGalleryData.map(item => item[1].p[item[1].p.length-1].u.replaceAll("&amp;", "&"));

  // To make sure the post renders at the correct height, scale it based on the largest height in the gallery
  let postHeight = 0;
  validGalleryData.map(item => {
    if (item[1].p[item[1].p.length-1].y > postHeight) {
      postHeight = item[1].p[item[1].p.length-1].y;
    }
  })

  useEffect(() => {
    console.log(currentImageClicked);
    // rerender component when currentImage changes
  }, [currentImageClicked])

  return (
    <>
      <div className="singlepost-title">
        <span>{clickedPost.title}</span>
        {clickedPost.link_flair_text && <span className="singlepost-flair" style={flairStyle}>{flairDisplay.length > 0 ? flairDisplay : clickedPost.link_flair_text}</span>}
        {clickedPost.is_original_content && <span className="flair-oc">OC</span>}
      </div>
      {/* style={{height: postHeight > 510 ? "510px" : postHeight + "px"}} */}
      <div className="singlepost-img-center">
      {/* <div className="singlepost-gallery-container"> */}
        <div className="singlepost-gallery-btn-container">
          {currentImageClicked !== 0 && <button className="singlepost-gallery-button singlepost-gallery-button-left" onClick={() => setCurrentImageClicked(prev => prev-1)}>
            <span>&#x2039;</span>
          </button>}
        </div>
          <img
            className="singlepost-image" // singlepost-gallery-image
            src={galleryImages[currentImageClicked]}
            alt=""
          />
          <div className="singlepost-gallery-btn-container">
        {currentImageClicked !== galleryImages.length-1 && <button className="singlepost-gallery-button singlepost-gallery-button-right" onClick={() => setCurrentImageClicked(prev => prev+1)}>
          <span>&#x203A;</span></button>}
          </div>
      </div>
    </>
  )
}
