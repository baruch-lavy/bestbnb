import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle, FaGlobe } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setSearchData, loadStays } from "../store/actions/stay.actions.js";
import { SearchBar } from "./SearchBar.jsx";
import { StickySearchBar } from "./StickySearchBar.jsx";

export const AppHeader = () => {
  const [showSticky, setShowSticky] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dispatch = useDispatch();
  const searchData = useSelector((state) => state.search);


  // ✅ Sync Redux with URL params when the page loads
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const filterBy = {
      destination: searchParams.get("destination") || "Anywhere",
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
      guests: Number(searchParams.get("guests")) || 1,
    };

    console.log("🚀 Syncing Redux with URL search parameters:", filterBy);
    dispatch(setSearchData(filterBy));
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Handle dropdown toggling
  const handleDropdownOpen = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  // ✅ Handle Search (Automatic Navigation)
  const handleSearch = () => {
    const filterBy = {
        destination: searchData.destination || "Anywhere",
        startDate: searchData.startDate ? searchData.startDate : "",
        endDate: searchData.endDate ? searchData.endDate : "",
        guests: searchData.guests || 1,
    };

    console.log("🚀 Filtering stays with:", filterBy);

    // ✅ Dispatch action to filter stays (No navigation)
    dispatch(loadStays(filterBy));

    // ✅ Update URL parameters without page reload
    const newUrl = `${window.location.pathname}?${new URLSearchParams(filterBy).toString()}`;
    window.history.pushState({}, "", newUrl);
};


  // ✅ Manual Navigation via "Stays" Button
  const handleNavigateToStays = () => {
    window.location.href = `/search-results?${new URLSearchParams(searchData).toString()}`;
  };

  return (
    <>
      {/* HEADER */}
      <header className={`header ${showSticky ? "sticky-header" : ""}`}>
        <div className="left-section">
          <img src="/img/stays/logo.png" alt="Airbnb Logo" className="logo" />
          <nav className="nav-links">
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigateToStays(); }}>Stays</a>
            <a href="#">Experiences</a>
          </nav>
        </div>

        {/* ✅ Sticky Search Bar is Now Inside the Header */}
        {showSticky && (
          <div className="sticky-search-wrapper">
            <StickySearchBar
              openDropdown={openDropdown}
              handleDropdownOpen={handleDropdownOpen}
              handleSearch={handleSearch}
            />
          </div>
        )}

        <div className="right-section">
          <span className="host">Bestbnb your home</span>
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
          openDropdown={openDropdown}
          handleDropdownOpen={handleDropdownOpen}
          handleSearch={handleSearch}
        />
      </div>
    </>
  );
};
