import React from 'react';

export default function SideBarPremium() {
  return (
    <div className="SideBarPremium">
      <div className="sidebar-premium-container">
        <img src="images/premium.png" className="premium-icon" alt="" />
        <div className="premium-text-container">
          <h4 className="premium-title">Reddit Premium</h4>
          <p className="premium-text">The best Reddit experience, with monthly Coins</p>
        </div>
      </div>
      <div className="btn-try-now-container">
        <button className="btn btn-red btn-try-now">Try Now</button>
      </div>
    </div>
  )
}
