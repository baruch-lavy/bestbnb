import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationArrow,
  faBuilding,
  faUmbrellaBeach,
  faUtensils,
  faLandmark,
} from "@fortawesome/free-solid-svg-icons";

export const SearchBar = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dates");
  const [flexibleDays, setFlexibleDays] = useState(0);

  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const dropdownRef = useRef(null);
  const datePickerRef = useRef(null);
  const guestDropdownRef = useRef(null);

  const destinations = [
    { icon: faLocationArrow, name: "Nearby", description: "Find what’s around you" },
    { icon: faUmbrellaBeach, name: "Tel Aviv-Yafo, Israel", description: "Popular beach destination" },
    { icon: faBuilding, name: "Bucharest, Romania", description: "For sights like Cismigiu Gardens" },
    { icon: faLandmark, name: "Paris, France", description: "For its bustling nightlife" },
    { icon: faBuilding, name: "Budapest, Hungary", description: "For its stunning architecture" },
    { icon: faUtensils, name: "Istanbul, Türkiye", description: "For its top-notch dining" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        datePickerRef.current && !datePickerRef.current.contains(event.target) &&
        guestDropdownRef.current && !guestDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setIsDatePickerOpen(false);
        setIsGuestDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle guest selection
  const handleGuestChange = (type, amount) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + amount),
    }));
  };

  return (
    <div className="search-container">
      <div className={`search-bar ${isDropdownOpen ? "expanded" : ""}`}>
        
        {/* WHERE Section */}
        <div className="search-section where-section" ref={dropdownRef}>
          <span>Where</span>
          <input
            type="text"
            placeholder="Search destinations"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
          />
          {isDropdownOpen && (
            <div className="dropdown">
              <div className="dropdown-header">Suggested destinations</div>
              {destinations.map((dest, index) => (
                <div key={index} className="suggestion">
                  <FontAwesomeIcon icon={dest.icon} className="icon" />
                  <div>
                    <strong>{dest.name}</strong>
                    <p>{dest.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="divider"></div>

        {/* CHECK-IN & CHECK-OUT Section */}
        <div className="search-section date-section" ref={datePickerRef}>
          <div className="date-fields" onClick={() => setIsDatePickerOpen(true)}>
            <div className="date-input">
              <span>Check in</span>
              <input type="text" placeholder="Add dates" value={startDate ? startDate.toLocaleDateString() : ""} readOnly />
            </div>
            <div className="divider"></div>
            <div className="date-input">
              <span>Check out</span>
              <input type="text" placeholder="Add dates" value={endDate ? endDate.toLocaleDateString() : ""} readOnly />
            </div>
          </div>

          {isDatePickerOpen && (
            <div className="date-picker-dropdown">
              <DatePicker
                selected={startDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setStartDate(start);
                  setEndDate(end);
                  if (end) setTimeout(() => setIsDatePickerOpen(false), 200);
                }}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                monthsShown={2}
                inline
              />
            </div>
          )}
        </div>

        <div className="divider"></div>

        {/* WHO Section */}
        <div className="search-section who-section" ref={guestDropdownRef}>
          <span>Who</span>
          <input
            type="text"
            placeholder="Add guests"
            value={`${guests.adults + guests.children} guests`}
            readOnly
            onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
          />
          {isGuestDropdownOpen && (
            <div className="guest-dropdown">
              {["adults", "children", "infants", "pets"].map((key) => (
                <div className="guest-row" key={key}>
                  <div className="guest-info">
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>
                    <p>{key === "pets" ? <a href="#">Bringing a service animal?</a> : `Ages for ${key}`}</p>
                  </div>
                  <div className="guest-controls">
                    <button className="guest-btn" onClick={() => handleGuestChange(key, -1)} disabled={guests[key] === 0}>−</button>
                    <span>{guests[key]}</span>
                    <button className="guest-btn" onClick={() => handleGuestChange(key, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEARCH BUTTON */}
        <button className="search-btn"><FaSearch /></button>
      </div>
    </div>
  );
};
