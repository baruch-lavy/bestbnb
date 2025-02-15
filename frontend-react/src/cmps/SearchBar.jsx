import React, { useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from "react-redux";
import { setSearchData } from "../store/actions/stay.actions"; // Redux action

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationArrow,
  faBuilding,
  faUmbrellaBeach,
  faUtensils,
  faLandmark,
} from "@fortawesome/free-solid-svg-icons";

export const SearchBar = ({ openDropdown, handleDropdownOpen, handleSearch }) => {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.search || {}); // Ensure search object exists

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

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current?.contains(event.target) ||
        datePickerRef.current?.contains(event.target) ||
        guestDropdownRef.current?.contains(event.target)
      ) {
        return;
      }
      handleDropdownOpen(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleDropdownOpen]);

  // ✅ Handle guest selection
  const handleGuestChange = (type, amount) => {
    dispatch(
      setSearchData({
        ...search,
        guests: {
          ...search.guests,
          [type]: Math.max(0, (search.guests?.[type] || 0) + amount),
        },
      })
    );
  };

  return (
    <div className="search-container">
      <div className={`search-bar ${openDropdown ? "expanded" : ""}`}>
        {/* WHERE Section */}
        <div className="search-section where-section" ref={dropdownRef}>
          <span>Where</span>
          <input
            type="text"
            placeholder="Search destinations"
            value={search.destination || ""}
            onChange={(e) => dispatch(setSearchData({ ...search, destination: e.target.value }))}
            onFocus={() => handleDropdownOpen("where")}
          />
          {openDropdown === "where" && (
            <div className="dropdown">
              <div className="dropdown-header">Suggested destinations</div>
              {destinations.map((dest, index) => (
                <div
                  key={index}
                  className="suggestion"
                  onClick={() => {
                    dispatch(setSearchData({ ...search, destination: dest.name }));
                    handleDropdownOpen(null);
                  }}
                >
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
          <div className="date-fields" onClick={() => handleDropdownOpen("dates")}>
            <div className="date-input">
              <span>Check in</span>
              <input
                type="text"
                placeholder="Add dates"
                value={search.startDate ? new Date(search.startDate).toLocaleDateString() : ""}
                readOnly
              />
            </div>
            <div className="divider"></div>
            <div className="date-input">
              <span>Check out</span>
              <input
                type="text"
                placeholder="Add dates"
                value={search.endDate ? new Date(search.endDate).toLocaleDateString() : ""}
                readOnly
              />
            </div>
          </div>

          {openDropdown === "dates" && (
            <div className="date-picker-dropdown">
              <DatePicker
                selected={search.startDate ? new Date(search.startDate) : null}
                onChange={(dates) => {
                  const [start, end] = dates;
                  dispatch(setSearchData({ ...search, startDate: start, endDate: end }));
                  if (end) setTimeout(() => handleDropdownOpen(null), 200);
                }}
                startDate={search.startDate ? new Date(search.startDate) : null}
                endDate={search.endDate ? new Date(search.endDate) : null}
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
            value={`${(search.guests?.adults || 0) + (search.guests?.children || 0)} guests`}
            readOnly
            onClick={() => handleDropdownOpen("who")}
          />
          {openDropdown === "who" && (
            <div className="guest-dropdown">
              {["adults", "children", "infants", "pets"].map((key) => (
                <div className="guest-row" key={key}>
                  <div className="guest-info">
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>
                    <p>{key === "pets" ? <a href="#">Bringing a service animal?</a> : `Ages for ${key}`}</p>
                  </div>
                  <div className="guest-controls">
                    <button
                      className="guest-btn"
                      onClick={() => handleGuestChange(key, -1)}
                      disabled={search.guests?.[key] === 0}
                    >
                      −
                    </button>
                    <span>{search.guests?.[key] || 0}</span>
                    <button className="guest-btn" onClick={() => handleGuestChange(key, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEARCH BUTTON */}
        <button className="search-btn" onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>
    </div>
  );
};
