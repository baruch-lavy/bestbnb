import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle, FaGlobe } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setSearchData, loadStays } from "../store/actions/stay.actions.js";
import { SearchBar } from "./SearchBar.jsx";
import { StickySearchBar } from "./StickySearchBar.jsx";
import { useLocation, useSearchParams } from "react-router-dom"; // ✅ Import useLocation
import { UserModal } from './UserModal';
import { FaAirbnb } from 'react-icons/fa'


export const AppHeader = () => {
  const location = useLocation(); // ✅ Get current page URL
  const [searchParams] = useSearchParams();
  const isDetailsPage = /^\/stay\/[^/]+$/.test(location.pathname); // ✅ Match /stay/:stayId
  const isDashboardPage = location.pathname === '/dashboard'; // Add dashboard page check

  const [showSticky, setShowSticky] = useState(isDetailsPage);
  const [forceExpand, setForceExpand] = useState(false); // ✅ Track if manually expanded
  const [openDropdown, setOpenDropdown] = useState(null);
  const dispatch = useDispatch();
  const searchData = useSelector((state) => state.search);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const user = useSelector((state) => state.userModule.user);
  // console.log('user:', user);


  // ✅ Sync Redux with URL params when the page loads
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    console.log('searchParams:', searchParams);
    const filterBy = {
      destination: searchParams.get("destination") || "",
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
      guests: {
        adults: Number(searchParams.get("adults")) || 0,
        children: Number(searchParams.get("children")) || 0,
        infants: Number(searchParams.get("infants")) || 0,
        pets: Number(searchParams.get("pets")) || 0
      }
    };
console.log('filterBy:', filterBy);
    dispatch(setSearchData(filterBy));
  }, [dispatch , searchParams]);

  // ✅ Toggle sticky header based on scroll (only if NOT manually expanded or on details page)
  useEffect(() => {
    if (!isDetailsPage && !forceExpand) {
      const handleScroll = () => {
        setShowSticky(window.scrollY > 50);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isDetailsPage, forceExpand]);

  // ✅ Toggle between sticky & full search mode
  const handleStickyClick = () => {
    setForceExpand(true); // ✅ Expand full search
    setShowSticky(false); // ✅ Hide sticky version
  };

  // ✅ Collapse back to sticky mode when clicking outside
  useEffect(() => {
    if (forceExpand) {
      const handleClickOutside = (event) => {
        if (
          !document.querySelector(".full-search-bar")?.contains(event.target) &&
          !document.querySelector(".header")?.contains(event.target)
        ) {
          setForceExpand(false); // ✅ Return to sticky mode
          setShowSticky(true);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [forceExpand]);

  // ✅ Ensure Search Also Closes Expanded Mode & Returns to Sticky
  const handleSearch = () => {
    const filterBy = {
      destination: searchData.destination || "",
      startDate: searchData.startDate || "",
      endDate: searchData.endDate || "",
      guests: encodeURIComponent(JSON.stringify(searchData.guests || { adults: 1, children: 0 })), // ✅ Fix object issue
    };
  
    dispatch(loadStays(filterBy));

    // ✅ Update URL parameters without page reload
    const newUrl = `${window.location.pathname}/?${new URLSearchParams(filterBy).toString()}`;
    window.history.pushState({}, "", newUrl);
  
    // ✅ Collapse back to sticky after search
    setForceExpand(false);
    setShowSticky(true);
  };
  

  // ✅ Manual Navigation via "Stays" Button
  // const handleNavigateToStays = () => {
  //   window.location.href = `/search-results?${new URLSearchParams(searchData).toString()}`;
  // };


  // ✅ Toggle Dropdown Open/Close
  const handleDropdownOpen = (dropdown) => {
    if (openDropdown === dropdown) setOpenDropdown(null);
    else setOpenDropdown(dropdown);
  };

  const handleUserIconClick = (event) => {
    event.stopPropagation();
    setIsUserModalOpen(!isUserModalOpen);
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserModalOpen && !event.target.closest('.profile-menu') && !event.target.closest('.user-modal')) {
        setIsUserModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserModalOpen]);

  return (
    <>
      {/* HEADER */}
      <header className={`header ${showSticky ? "sticky-header" : ""} ${isDetailsPage ? "details-header" : ""} ${isDashboardPage ? "dashboard-page" : ""}`}>
        <div className="left-section">
        <a href="/stay">
        <div className="logo-wrapper">
          <FaAirbnb className="logo" /> 
          <span className="logo-text">bestbnb</span>
        </div>   
        </a>
          <nav className="nav-links">
            <a href="/stay">Homes</a>
            <a href="#" className="expriences">Experiences</a>
          </nav>
        </div>

        {/* Fix: Only show sticky search when showSticky is true AND not on dashboard */}
        {showSticky && !forceExpand && !isDashboardPage && (
          <div className="sticky-search-wrapper" onClick={handleStickyClick}>
            <StickySearchBar
              openDropdown={openDropdown}
              handleDropdownOpen={handleDropdownOpen}
              handleSearch={handleSearch}
            />
          </div>
        )}

        <div className="right-section">
          <span className="host">Bestbnb your home</span>
          {/* <FaGlobe className="icon" /> */}
          <div className="profile-menu" onClick={handleUserIconClick}>
            <FaBars className="menu-icon" />

            {user ? (
          <div className="user-info">
            <div className="user-icon-container">
              <FaUserCircle className="user-icon" />
              <span className="user-initial">
                {user.fullname.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        ) : (
          <FaUserCircle className="user-icon" />
          
        )}
             
        <UserModal 
          isOpen={isUserModalOpen} 
          onClose={() => setIsUserModalOpen(false)} 
        />
          </div>
        </div>
      </header>

      {!isDashboardPage && (
        <div className={`full-search-bar ${showSticky && !forceExpand ? "hidden" : ""}`}>
          <SearchBar
            openDropdown={openDropdown}
            handleDropdownOpen={handleDropdownOpen}
            handleSearch={handleSearch}
          />
        </div>

      )}
        <div className="dashboard-header">
        <a href="/stay">
        <div className="logo-wrapper">
          <FaAirbnb className="logo" /> 
          <span className="logo-text">bestbnb</span>
        </div> 
        </a>
        </div>
    </>
  )
}
