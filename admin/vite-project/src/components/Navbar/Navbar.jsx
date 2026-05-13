import React, { useState } from 'react'
import './navBar.css'
import { assets } from '../../../../../carebridge/src/assets/assets/assets'    

const Navbar = ({ setToken }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    if (setToken) {
      setToken("");
    }
  };

  return (
    <div className="navbar">
        <div className="logo-container">
          <span className="logo-text">Care<span className="logo-highlight">Bridge</span></span>
          <span className="admin-badge">Admin</span>
        </div>
        <div className="navbar-right">
          <div className="profile-wrapper" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img src={assets.profile_image} alt="Profile" className="profile" />
            {dropdownOpen && (
              <div className="profile-dropdown">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
    </div>
  )
}

export default Navbar
