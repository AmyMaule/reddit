import React from 'react'

export default function Trending({ page }) {
  return (
    <div className={page === "home" ? "Trending" : "Trending hide"}>
      <h2 className="trending-title">Trending today</h2>
      <div className="trending-blocks">
        <div className="trending-block">Trending 1</div>
        <div className="trending-block">Trending 2</div>
        <div className="trending-block">Trending 3</div>
        <div className="trending-block">Trending 4</div>
      </div>
    </div>
  )
}

