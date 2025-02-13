import React, { useState } from "react";
import { FaSearch, FaBars, FaUserCircle, FaGlobe } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export const AppHeader = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <header className="header">
        {/* Left Section */}
        <div className="left-section">
          {/* FIXED: Logo Path Updated */}
          <img src="/img/stays/logo.png" alt="Airbnb Logo" className="logo" />
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

      {/* SEARCH BAR */}
      <div className="search-container">
        <div className="search-bar">
          {/* WHERE INPUT */}
          <div className="search-section where-section">
            <span>Where</span>
            <input
              type="text"
              placeholder="Search destinations"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            />
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="dropdown">
                <div className="suggestion">
                  <span className="icon">📍</span>
                  <div>
                    <strong>Nearby</strong>
                    <p>Find what’s around you</p>
                  </div>
                </div>
                <div className="suggestion">
                  <span className="icon">🏖️</span>
                  <div>
                    <strong>Tel Aviv-Yafo, Israel</strong>
                    <p>Popular beach destination</p>
                  </div>
                </div>
                <div className="suggestion">
                  <span className="icon">🏙️</span>
                  <div>
                    <strong>Bucharest, Romania</strong>
                    <p>For sights like Cismigiu Gardens</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="divider"></div>

          {/* CHECK-IN */}
          <div className="search-section">
            <span>Check in</span>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Add dates"
            />
          </div>

          <div className="divider"></div>

          {/* CHECK-OUT */}
          <div className="search-section">
            <span>Check out</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Add dates"
            />
          </div>

          <div className="divider"></div>

          {/* WHO */}
          <div className="search-section">
            <span>Who</span>
            <input
              type="number"
              min="1"
              placeholder="Add guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>

          {/* SEARCH BUTTON */}
          <button className="search-btn">
            <FaSearch />
          </button>
        </div>
      </div>
    </>
  );
};
