import React from "react";
import { FaBars, FaUserCircle, FaGlobe } from "react-icons/fa";
import { SearchBar } from "./SearchBar";
// import "./Header.scss"; // Import styles

export const AppHeader = () => {
  return (
    <>
      {/* HEADER */}
      <header className="header">
        {/* Left Section */}
        <div className="left-section">
          {/* FIXED: Logo Path Updated */}
          <img src="/assets/img/airbnb-logo.svg" alt="Airbnb Logo" className="logo" />
          <nav className="nav-links">
            <a href="#">Stays</a>
            <a href="#">Experiences</a>
          </nav>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <span className="host">Airbnb your home</span>
          <FaGlobe className="icon" />
          <div className="profile-menu">
            <FaBars className="menu-icon" />
            <FaUserCircle className="user-icon" />
          </div>
        </div>
      </header>

      {/* SEARCH BAR COMPONENT */}
      <SearchBar />
    </>
  );
};
