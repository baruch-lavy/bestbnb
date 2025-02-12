import React, { useState } from "react";
import { FaSearch, FaBars, FaUserCircle, FaGlobe } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import Logo from '../assets/img/airbnb-logo.svg'

export const AppHeader = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);

  return (
    <>
      <header className="header">
        {/* Left Section */}
        <div className="left-section">
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

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-bar">
          <div className="search-section">
            <span>Where</span>
            <input
              type="text"
              placeholder="Search destinations"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="divider"></div>
          <div className="search-section">
            <span>Check in</span>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Add dates"
            />
          </div>
          <div className="divider"></div>
          <div className="search-section">
            <span>Check out</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Add dates"
            />
          </div>
          <div className="divider"></div>
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
          <button className="search-btn">
            <FaSearch />
          </button>
        </div>
      </div>
    </>
  );
};
