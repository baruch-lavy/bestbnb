import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle, FaGlobe } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setSearchData, loadStays } from "../store/actions/stay.actions.js";
import { SearchBar } from "./SearchBar.jsx";
import { StickySearchBar } from "./StickySearchBar.jsx";
import { Link, NavLink, useLocation, useSearchParams, useNavigate } from "react-router-dom"; // ✅ Import useLocation
import { UserModal } from './UserModal';
import { FaAirbnb } from 'react-icons/fa'


export const AppHeader = () => {
  const location = useLocation(); // ✅ Get current page URL
  const [searchParams] = useSearchParams();
  const isDetailsPage = /^\/stay\/[^/]+$/.test(location.pathname); // ✅ Match /stay/:stayId
  const isReviewerPage = /^\/reviewer\/[^/]+$/.test(location.pathname);
  const isDashboardPage = location.pathname === '/dashboard'; // Add dashboard page check
  const isTripsPage = location.pathname === '/trips';
  const isGalleryPage = /^\/stay\/gallery\/[^/]+$/.test(location.pathname);
  const isBookPage = /^\/stay\/book\/[^/]+$/.test(location.pathname);

  const [showSticky, setShowSticky] = useState(isDetailsPage);
  const [forceExpand, setForceExpand] = useState(false); // ✅ Track if manually expanded
  const [openDropdown, setOpenDropdown] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchData = useSelector((state) => state.search);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const user = useSelector((state) => state.userModule.user);


  // ✅ Sync Redux with URL params when the page loads
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
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
    setSearchData(filterBy);
  }, [dispatch, searchParams]);

  // ✅ Reset the search bar state
  const resetSearch = () => {
    dispatch(setSearchData({
      destination: '',
      startDate: '',
      endDate: '',
      guests: { adults: 1, children: 0, infants: 0, pets: 0 }
    }));
  };

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
  const handleSearch = async () => {
    const filterBy = {
      destination: searchData.destination || "",
      startDate: searchData.startDate || "",
      endDate: searchData.endDate || "",
      guests: encodeURIComponent(JSON.stringify(searchData.guests || { adults: 1, children: 0 })),
    };

    loadStays(filterBy);

    // Close any open dropdowns
    setForceExpand(false);
    setShowSticky(true);

    if (isDetailsPage || isReviewerPage) {
      navigate(`/?${new URLSearchParams(filterBy).toString()}`);
    } else {
      const newUrl = `${window.location.origin}${window.location.pathname}?${new URLSearchParams(filterBy).toString()}`;
      window.history.pushState({}, "", newUrl);
    }
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
      <header className={`header ${showSticky ? "sticky-header" : ""} ${isDetailsPage ? "details-header" : ""} ${isDashboardPage ? "dashboard-page" : ""} ${isTripsPage ? "trips-page" : ""} ${isGalleryPage ? "gallery-page" : ""} ${isBookPage ? "book-page" : ""}`}>
        <div className="left-section">
          <NavLink to={'/'} onClick={resetSearch}>
            <div className="logo-wrapper">
              <FaAirbnb className="logo" />
              <span className="logo-text">bestbnb</span>
            </div>
          </NavLink>
          <nav className="nav-links">
            <NavLink to={'/'} onClick={resetSearch}>Homes</NavLink>
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
          <img src="/img/stays/footer/footer 1.svg" className="icon" />
          <div className="profile-menu" onClick={handleUserIconClick}>
            <FaBars className="menu-icon" />
            {/* 
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
              )} */}

            <div className="user-info">
              <div className="user-icon-container">
                {user ? (
                  user.imgUrl ? (
                    <img src={user.imgUrl} className="user-icon" alt={user.fullname} />
                  ) : (
                    <div className="user-icon user-initial-icon">
                      {user.fullname.charAt(0).toUpperCase()}
                    </div>
                  )
                ) : (
                    <div className="user-icon user-initial-icon">
                      B
                    </div>                )}
              </div>
            </div>

            <UserModal
              isOpen={isUserModalOpen}
              onClose={() => setIsUserModalOpen(false)}
            />
          </div>
        </div>
      </header>


      {/* Add mobile menu button for small screens */}
      {!isDashboardPage && !isTripsPage && (
        <div className={`full-search-bar ${showSticky && !forceExpand ? "hidden" : ""}`}>
          <SearchBar
            openDropdown={openDropdown}
            handleDropdownOpen={handleDropdownOpen}
            handleSearch={handleSearch}
          />
        </div>
      )}
    </>
  )
}
