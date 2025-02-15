import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle, FaGlobe } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setSearchData } from "../store/actions/stay.actions.js"; // Import Redux action
import { SearchBar } from "./SearchBar.jsx";
import { StickySearchBar } from "./StickySearchBar.jsx";

export const AppHeader = () => {
  const [showSticky, setShowSticky] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dispatch = useDispatch();
  const searchData = useSelector((state) => state.search); // Redux state

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 50); // Show sticky bar when scrolling
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Lifted up state for dropdown handling
  const handleDropdownOpen = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));

    // ✅ Update Redux state to trigger re-render
    dispatch(setSearchData({ ...searchData }));
  };

  // ✅ Handle Search Action
  const handleSearch = () => {
    console.log("Searching with:", searchData); // Debugging
  
    // ✅ Ensure guests is an object and extract total guests
    const guests = searchData.guests || { adults: 0, children: 0 };
    const totalGuests = (guests.adults || 0) + (guests.children || 0);
  
    // ✅ Build correct query parameters
    const queryParams = new URLSearchParams({
      destination: searchData.destination || "Anywhere",
      startDate: searchData.startDate ? searchData.startDate.toISOString() : "",
      endDate: searchData.endDate ? searchData.endDate.toISOString() : "",
      guests: totalGuests.toString(), // Ensure it's a string for the URL
    }).toString();
  
    // ✅ Redirect to search results page with correct parameters
    window.location.href = `/search-results?${queryParams}`;
  };
  

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="left-section">
          <img src="/assets/img/airbnb-logo.svg" alt="Airbnb Logo" className="logo" />
          <nav className="nav-links">
            <a href="#">Stays</a>
            <a href="#">Experiences</a>
          </nav>
        </div>

        <div className="right-section">
          <span className="host">Airbnb your home</span>
          <FaGlobe className="icon" />
          <div className="profile-menu">
            <FaBars className="menu-icon" />
            <FaUserCircle className="user-icon" />
          </div>
        </div>
      </header>

      {/* FULL SEARCH BAR */}
      <div className={`full-search-bar ${showSticky ? "hidden" : ""}`}>
        <SearchBar
          setSearchData={(data) => dispatch(setSearchData(data))} // ✅ Use Redux
          openDropdown={openDropdown}
          handleDropdownOpen={handleDropdownOpen} // ✅ Pass function to SearchBar
          handleSearch={handleSearch} // ✅ Pass function to SearchBar
        />
      </div>

      {/* STICKY SEARCH BAR */}
      {showSticky && (
        <div className="sticky-search-container">
          <StickySearchBar
            handleDropdownOpen={handleDropdownOpen} // ✅ Pass function to StickySearchBar
          />
        </div>
      )}
    </>
  );
};
