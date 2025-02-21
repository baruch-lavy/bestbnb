import React from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setSearchData } from "../store/actions/stay.actions"; // ✅ Import Redux action
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow, faBuilding, faUmbrellaBeach, faUtensils, faLandmark } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns'

export const StickySearchBar = ({ openDropdown, handleDropdownOpen, handleSearch }) => {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.search);

  const destinations = [
    { icon: faUmbrellaBeach, name: "Tel Aviv-Yafo, Israel", description: "Popular beach destination" },
    { icon: faBuilding, name: "Bucharest, Romania", description: "For sights like Cismigiu Gardens" },
    { icon: faLandmark, name: "Paris, France", description: "For its bustling nightlife" },
    { icon: faBuilding, name: "Budapest, Hungary", description: "For its stunning architecture" },
    { icon: faUtensils, name: "Istanbul, Türkiye", description: "For its top-notch dining" },
  ];

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "Any week";
    return `${format(new Date(startDate), "d MMM")} - ${format(new Date(endDate), "d MMM")}`;
  };

  return (
    <div className="sticky-search-bar">
      <div className="sticky-content">
        {/* WHERE - Click to open dropdown */}
        <span className="sticky-item" onClick={() => handleDropdownOpen("where")}>
          {search.destination || "Anywhere"}
        </span>

        <span className="sticky-divider">|</span>

        {/* DATES - Click to open dropdown */}
        <span className="sticky-item" onClick={() => handleDropdownOpen("dates")}>
        {formatDateRange(search.startDate, search.endDate)}
        </span>

        <span className="sticky-divider">|</span>

        {/* GUESTS - Click to open dropdown */}
        <span className="sticky-item" onClick={() => handleDropdownOpen("who")}>
          {(search.guests?.adults || 0) + (search.guests?.children || 0)} guests
        </span>
      </div>

      {/* SEARCH BUTTON */}
      <button className="sticky-search-btn" onClick={handleSearch}>
        <FaSearch />
      </button>

      {/* WHERE DROPDOWN */}
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

      {/* DATES DROPDOWN */}
      {openDropdown === "dates" && (
        <div className="date-picker-dropdown">
          <DatePicker
            selected={search.startDate ? new Date(search.startDate) : null}
            onChange={(dates) => {
              const [start, end] = dates;
              dispatch(setSearchData({ ...search, startDate: start || null, endDate: end || null }));
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

      {/* GUESTS DROPDOWN */}
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
                  onClick={() => {
                    dispatch(
                      setSearchData({
                        ...search,
                        guests: {
                          ...search.guests,
                          [key]: Math.max(0, (search.guests?.[key] || 0) - 1),
                        },
                      })
                    );
                  }}
                  disabled={search.guests?.[key] === 0}
                >
                  −
                </button>
                <span>{search.guests?.[key] || 0}</span>
                <button
                  className="guest-btn"
                  onClick={() =>
                    dispatch(
                      setSearchData({
                        ...search,
                        guests: {
                          ...search.guests,
                          [key]: (search.guests?.[key] || 0) + 1,
                        },
                      })
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
