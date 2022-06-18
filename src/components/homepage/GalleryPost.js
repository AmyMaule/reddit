import React, { useEffect, useState } from 'react';
import PostTitleFlair from './PostTitleFlair';

export default function GalleryPost({ post, handlePostClick }) {
  const [currentImage, setCurrentImage] = useState(0);

  // The gallery from the API is stored as an object with random keys for each item, so Object.entries creates an array containing all the gallery items
  let galleryData = Object.entries(post.media_metadata);

  // The gallery items aren't always valid, so .filter() returns the useable items, then .map() takes the last item in the p array (p.length-1) which is the highest quality image (p is an array of the same image of increasing quality), then removes the the &amp; encoding
  const validGalleryData = galleryData.filter(item => item[1].status === "valid");
  const galleryImages = validGalleryData.map(item => item[1].p[item[1].p.length-1].u.replaceAll("&amp;", "&"));

  // To make sure the post renders at the correct height, scale it based on the largest height in the gallery
  let postHeight = 0;
  validGalleryData.forEach(item => {
    if (item[1].p[item[1].p.length-1].y > postHeight) {
      postHeight = item[1].p[item[1].p.length-1].y;
    }
  })

  useEffect(() => {
    // rerender component when currentImage changes
  }, [currentImage])

  return (
    <>
      <PostTitleFlair handlePostClick={handlePostClick} post={post} isShortened={false} singlePost={false} />
      <div className="img-center" style={{maxHeight: postHeight > 510 ? "510px" : postHeight + "px"}}>
        {currentImage !== 0 && <button className="gallery-button gallery-button-left" onClick={() => setCurrentImage(prev => prev-1)}>
          <span>&#x2039;</span>
        </button>}
          <img
            className="post-gallery-image"
            src={galleryImages[currentImage]}
            onClick={() => handlePostClick("post")}
            alt=""
          />
        {currentImage !== galleryImages.length-1 && <button className="gallery-button gallery-button-right" onClick={() => setCurrentImage(prev => prev+1)}>
          <span>&#x203A;</span></button>}
      </div>
    </>
  )
}