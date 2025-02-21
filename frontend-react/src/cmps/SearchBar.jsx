import React, { useState, useRef, useEffect } from "react";
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

export const SearchBar = ({
  openDropdown,
  handleDropdownOpen,
  handleSearch,
}) => {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.search || {}); // Ensure state exists
  const [isTyping, setIsTyping] = useState(false); // ✅ Track if user started typing

  const dropdownRef = useRef(null);
  const datePickerRef = useRef(null);
  const guestDropdownRef = useRef(null);
  const dateInputRef = useRef(null);
  const guestInputRef = useRef(null);



  const destinations = [
    {
      icon: faUmbrellaBeach,
      name: "Porto, Portugal",
      description: "Popular beach destination",
    },
    {
      icon: faBuilding,
      name: "Barcelona, Spain",
      description: "For sights like Cismigiu Gardens",
    },
    {
      icon: faLandmark,
      name: "New York, United States",
      description: "For its bustling nightlife",
    },
    {
      icon: faBuilding,
      name: "Sydney, Australia",
      description: "For its stunning architecture",
    },
    {
      icon: faUtensils,
      name: "Istanbul, Turkey",
      description: "For its top-notch dining",
    },
  ];

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // ✅ Check if click is INSIDE any dropdown
      if (
        dropdownRef.current?.contains(event.target) || // ✅ Allow clicks inside SearchBar
        datePickerRef.current?.contains(event.target) ||
        guestDropdownRef.current?.contains(event.target) ||
        document.querySelector(".sticky-search-bar")?.contains(event.target) // ✅ Allow clicks inside StickySearchBar
      ) {
        return; // ✅ Do not close dropdowns if clicking inside StickySearchBar
      }
      handleDropdownOpen(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleDropdownOpen]);

  // ✅ Handle guest selection
  const handleGuestChange = (type, amount) => {
    const updatedGuests = {
      ...search.guests,
      [type]: Math.max(0, (search.guests?.[type] || 0) + amount),
    };

    dispatch(
      setSearchData({
        ...search,
        guests: { ...updatedGuests }, // ✅ Ensuring new object reference
      })
    );
  };

  const handleDestinationSelect = (destination) => {
    console.log("Selected destination:", destination);
    if (!destination) return;
  
    setTimeout(() => {
      if (dateInputRef?.current) {
        dateInputRef.current.focus();
        dateInputRef.current.click(); // ✅ Trigger click if focus fails
        console.log("Focus Date Picker");
      }
    }, 100);
  };

  const handleDateSelect = (dates) => {
    console.log("Selected dates:", dates);
    if (!dates[1]) return;
  
    setTimeout(() => {
      if (guestInputRef?.current) {
        guestInputRef.current.focus(); // ✅ Move focus to "Who" (Guests) input
        guestInputRef.current.click(); // ✅ Trigger click if focus fails
        console.log("Focus Guests Input");
      }
    }, 210); // ✅ Small delay allows UI updates first
  };
  
  
  

  return (
    <div className="search-container">
      <div className={`search-bar ${openDropdown ? "expanded" : ""}`}>
        {/* WHERE Section */}
        <div className="search-section where-section" ref={dropdownRef}>
          <span>Where</span>
          <input
            type="text"
            placeholder={
              !isTyping &&
              (!search.destination || search.destination === "Anywhere")
                ? "Search destinations"
                : ""
            }
            value={
              search.destination === "Anywhere" && !isTyping
                ? ""
                : search.destination
            }
            onChange={(e) => {
              setIsTyping(true); // ✅ User is typing
              const updatedSearch = { ...search, destination: e.target.value };
              dispatch(setSearchData(updatedSearch));
            }}
            onBlur={() => {
              if (!search.destination.trim()) {
                setIsTyping(false); // ✅ Reset if input is empty
                dispatch(setSearchData({ ...search, destination: "Anywhere" })); // ✅ Restore "Anywhere"
              }
            }}
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
                    dispatch(
                      setSearchData({
                        ...search,
                        destination: dest.name,
                      }
                    )
                  );
                    handleDestinationSelect(dest.name);
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
          <div
            className="date-fields"
            onClick={() => handleDropdownOpen("dates")}
          >
            <div className="date-input">
              <span>Check in</span>
              <input
                type="text"
                placeholder="Add dates"
                ref={dateInputRef}
                value={
                  search.startDate
                    ? new Date(search.startDate).toLocaleDateString()
                    : ""
                }
                readOnly
              />
            </div>
            <div className="divider"></div>
            <div className="date-input">
              <span>Check out</span>
              <input
                type="text"
                placeholder="Add dates"
                value={
                  search.endDate
                    ? new Date(search.endDate).toLocaleDateString()
                    : ""
                }
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

                  dispatch(
                    setSearchData({
                      ...search,
                      startDate: start || null,
                      endDate: end || null, // ✅ Explicitly set `null` to trigger Redux update
                    })
                  );
                  handleDateSelect(dates);
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
          <span className="who-span">Who</span>
          <input
            type="text"
            placeholder="Add guests"
            ref={guestInputRef}
            value={
              (search.guests?.adults || 0) + (search.guests?.children || 0) > 0
                ? `${
                    (search.guests?.adults || 0) +
                    (search.guests?.children || 0)
                  } guests`
                : "Add guests"
            }
            readOnly
            onClick={() => handleDropdownOpen("who")}
          />
          {openDropdown === "who" && (
            <div className="guest-dropdown">
              {["adults", "children", "infants", "pets"].map((key) => (
                <div className="guest-row" key={key}>
                  <div className="guest-info">
                    <strong>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </strong>
                    <p>
                      {key === "pets" ? (
                        <a href="#">Bringing a service animal?</a>
                      ) : (
                        `Ages for ${key}`
                      )}
                    </p>
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
                    <button
                      className="guest-btn"
                      onClick={() => handleGuestChange(key, 1)}
                    >
                      +
                    </button>
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
