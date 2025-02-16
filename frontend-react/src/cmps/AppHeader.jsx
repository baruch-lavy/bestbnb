import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle, FaGlobe } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setSearchData, loadStays } from "../store/actions/stay.actions.js"; // ✅ Import Redux actions
import { SearchBar } from "./SearchBar.jsx";
import { StickySearchBar } from "./StickySearchBar.jsx";

export const AppHeader = () => {
  const [showSticky, setShowSticky] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dispatch = useDispatch();
  const searchData = useSelector((state) => state.search); // ✅ Get Redux search state

  // ✅ Extract search parameters from URL when navigating
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const filterBy = {
      destination: searchParams.get("destination") || "Anywhere",
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
      guests: Number(searchParams.get("guests")) || 1,
    };

    console.log("🚀 Syncing Redux with URL search parameters:", filterBy);
    dispatch(setSearchData(filterBy)); // ✅ Update Redux state with URL params
  }, [dispatch]);

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
  };

  // ✅ Handle Search Action
  const handleSearch = () => {
    const filterBy = {
      destination: searchData.destination || "Anywhere",
      startDate: searchData.startDate ? searchData.startDate : "",
      endDate: searchData.endDate ? searchData.endDate : "",
      guests: searchData.guests || 1,
    };

    console.log("🚀 Searching with filter:", filterBy);
    dispatch(loadStays(filterBy)); // ✅ Fetch stays based on search

    // ✅ Update URL with new search parameters (keeps page in sync)
    const newSearchParams = new URLSearchParams(filterBy);
    window.history.pushState({}, "", `/search-results?${newSearchParams.toString()}`);
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
          openDropdown={openDropdown}
          handleDropdownOpen={handleDropdownOpen}
          handleSearch={handleSearch} // ✅ Pass function to SearchBar
        />
      </div>

      {/* STICKY SEARCH BAR */}
      {showSticky && (
        <div className="sticky-search-container">
          <StickySearchBar
            openDropdown={openDropdown} // ✅ Track which dropdown is open
            handleDropdownOpen={handleDropdownOpen} // ✅ Control dropdown opening
            handleSearch={handleSearch} // ✅ Allow searching
          />
        </div>
      )}
    </>
  );
};
