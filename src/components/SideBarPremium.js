import React from 'react';
import PremiumIcon from "../images/premium.png";

export default function SideBarPremium() {
  return (
    <div className="SideBarPremium">
    <div className="sidebar-premium-container">
      <img src={PremiumIcon} className="premium-icon" />
      <div className="premium-text-container">
        <h4 className="premium-title">Reddit Premium</h4>
        <p className="premium-text">The best Reddit experience, with monthly Coins</p>
      </div>
    </div>
    <div className="btn-try-now-container">
      <button className="btn-red btn-try-now">Try Now</button>
    </div>
    </div>
  )
}
