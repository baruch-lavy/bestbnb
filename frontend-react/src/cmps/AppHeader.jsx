import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle, FaGlobe } from "react-icons/fa";
import { SearchBar } from "./SearchBar";
import {StickySearchBar} from "./StickySearchBar";

export const AppHeader = () => {
  const [showSticky, setShowSticky] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchData, setSearchData] = useState({
    destination: "Anywhere",
    startDate: null,
    endDate: null,
    guests: "Add guests",
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // console.log("Scroll Position:", scrollTop); // ✅ Debugging: Check scroll value
      setShowSticky(scrollTop > 50);
      // console.log("showSticky State:", scrollTop > 150); // ✅ Debugging: See if state updates
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownOpen = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };
  

  return (
    <>
      {/* HEADER */}
      <header className="header">
        {/* Left Section */}
        <div className="left-section">
<<<<<<< HEAD
          <img src="public/img/stays/logo.png" alt="Airbnb Logo" className="logo" />
=======
          <img src="/img/stays/logo.png" alt="Airbnb Logo" className="logo" />
>>>>>>> 01e4c08dd6910bd5bb34e9fcea30952b4acba46f
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

      {/* FULL SEARCH BAR (Visible at top) */}
      <div className={`full-search-bar ${showSticky ? "hidden" : ""}`}>
        <SearchBar setSearchData={setSearchData}  openDropdown={openDropdown} handleDropdownOpen={handleDropdownOpen} />
      </div>

      {/* STICKY SEARCH BAR (Appears when scrolling down) */}
      {showSticky && (
        <div className="sticky-search-container">
          <StickySearchBar
            destination={searchData.destination}
            startDate={searchData.startDate}
            endDate={searchData.endDate}
            guests={searchData.guests}
            handleDropdownOpen={handleDropdownOpen}
          />
        </div>
      )}
    </>
  );
};
