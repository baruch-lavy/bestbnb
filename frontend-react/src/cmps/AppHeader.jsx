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


  
  const handleSearch = () => {
    const updatedSearch = useSelector((state) => state.search); // Get fresh Redux state
  
    const guests = updatedSearch.guests || { adults: 0, children: 0 };
    const totalGuests = (guests.adults || 0) + (guests.children || 0);
  
    const queryParams = new URLSearchParams({
      destination: updatedSearch.destination || "Anywhere",
      startDate: updatedSearch.startDate ? updatedSearch.startDate.toISOString() : "",
      endDate: updatedSearch.endDate ? updatedSearch.endDate.toISOString() : "",
      guests: totalGuests.toString(),
    }).toString();
  
    window.location.href = `/search-results?${queryParams}`;
  };
  
  

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="left-section">
          <img src="/img/stays/logo.png" alt="Airbnb Logo" className="logo" />
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
