import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faUmbrellaBeach,
  faUtensils,
  faLandmark,
  faMountain,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { setSearchData } from "../store/actions/stay.actions";
import { format } from "date-fns";

const destinations = [
  {
    icon: faUmbrellaBeach,
    name: "Porto, Portugal",
    description: "Popular beach destination",
  },
  {
    icon: faBuilding,
    name: "Barcelona, Spain",
    description: "For sights like Sagrada Família",
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
  {
    icon: faMountain,
    name: "Interlaken, Switzerland",
    description: "For breathtaking alpine scenery",
  },
];

const guestTypes = [
  { key: "adults", label: "Adults", description: "Ages 13 or above" },
  { key: "children", label: "Children", description: "Ages 2–12" },
  { key: "infants", label: "Infants", description: "Under 2" },
  { key: "pets", label: "Pets", description: "Bringing a service animal?" },
];

function formatDateRange(startDate, endDate) {
  if (!startDate && !endDate) return "Add dates";
  if (startDate && !endDate)
    return format(new Date(startDate), "d MMM");
  return `${format(new Date(startDate), "d MMM")} – ${format(
    new Date(endDate),
    "d MMM"
  )}`;
}

export function MobileSearchModal({ onClose, onSearch }) {
  const search = useSelector((state) => state.search || {});
  const [activeStep, setActiveStep] = useState("where");

  const guestCount =
    (search.guests?.adults || 0) + (search.guests?.children || 0);
  const guestLabel =
    guestCount > 0 ? `${guestCount} guest${guestCount !== 1 ? "s" : ""}` : "Add guests";

  function handleDestinationSelect(name) {
    setSearchData({ ...search, destination: name });
    setActiveStep("when");
  }

  function handleDateChange(dates) {
    const [start, end] = dates;
    setSearchData({ ...search, startDate: start || null, endDate: end || null });
    if (end) setTimeout(() => setActiveStep("who"), 180);
  }

  function handleGuestChange(key, delta) {
    setSearchData({
      ...search,
      guests: {
        ...search.guests,
        [key]: Math.max(0, (search.guests?.[key] || 0) + delta),
      },
    });
  }

  function handleClearAll() {
    setSearchData({
      destination: "",
      startDate: null,
      endDate: null,
      guests: { adults: 0, children: 0, infants: 0, pets: 0 },
    });
    setActiveStep("where");
  }

  return (
    <div className="mobile-search-modal">
      {/* ── Header ── */}
      <div className="msm-header">
        <button className="msm-close-btn" onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>
      </div>

      {/* ── WHERE ── */}
      <div className={`msm-step ${activeStep === "where" ? "msm-step--active" : "msm-step--collapsed"}`}>
        {activeStep === "where" ? (
          <div className="msm-step-content">
            <h3 className="msm-step-title">Where to?</h3>
            <div className="msm-destination-input">
              <FaSearch className="msm-input-icon" />
              <input
                type="text"
                placeholder="Search destinations"
                value={
                  search.destination === "Anywhere" ? "" : search.destination || ""
                }
                onChange={(e) =>
                  setSearchData({ ...search, destination: e.target.value })
                }
                autoFocus
              />
            </div>
            <div className="msm-suggestions">
              {destinations.map((dest, i) => (
                <div
                  key={i}
                  className="msm-suggestion-item"
                  onClick={() => handleDestinationSelect(dest.name)}
                >
                  <div className="msm-suggestion-icon">
                    <FontAwesomeIcon icon={dest.icon} />
                  </div>
                  <div className="msm-suggestion-text">
                    <strong>{dest.name}</strong>
                    <p>{dest.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <button
            className="msm-collapsed-btn"
            onClick={() => setActiveStep("where")}
          >
            <span className="msm-collapsed-label">Where</span>
            <span className="msm-collapsed-value">
              {search.destination || "I'm flexible"}
            </span>
          </button>
        )}
      </div>

      {/* ── WHEN ── */}
      <div className={`msm-step ${activeStep === "when" ? "msm-step--active" : "msm-step--collapsed"}`}>
        {activeStep === "when" ? (
          <div className="msm-step-content">
            <h3 className="msm-step-title">When's your trip?</h3>
            <div className="msm-calendar-wrapper">
              <DatePicker
                selected={
                  search.startDate ? new Date(search.startDate) : null
                }
                onChange={handleDateChange}
                startDate={
                  search.startDate ? new Date(search.startDate) : null
                }
                endDate={search.endDate ? new Date(search.endDate) : null}
                selectsRange
                monthsShown={1}
                inline
                minDate={new Date()}
              />
            </div>
          </div>
        ) : (
          <button
            className="msm-collapsed-btn"
            onClick={() => setActiveStep("when")}
          >
            <span className="msm-collapsed-label">When</span>
            <span className="msm-collapsed-value">
              {formatDateRange(search.startDate, search.endDate)}
            </span>
          </button>
        )}
      </div>

      {/* ── WHO ── */}
      <div className={`msm-step ${activeStep === "who" ? "msm-step--active" : "msm-step--collapsed"}`}>
        {activeStep === "who" ? (
          <div className="msm-step-content">
            <h3 className="msm-step-title">Who's coming?</h3>
            {guestTypes.map(({ key, label, description }) => (
              <div className="msm-guest-row" key={key}>
                <div className="msm-guest-info">
                  <strong>{label}</strong>
                  <p>
                    {key === "pets" ? (
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        {description}
                      </a>
                    ) : (
                      description
                    )}
                  </p>
                </div>
                <div className="msm-guest-controls">
                  <button
                    className="msm-guest-btn"
                    onClick={() => handleGuestChange(key, -1)}
                    disabled={(search.guests?.[key] || 0) === 0}
                    aria-label={`Decrease ${label}`}
                  >
                    −
                  </button>
                  <span className="msm-guest-count">
                    {search.guests?.[key] || 0}
                  </span>
                  <button
                    className="msm-guest-btn"
                    onClick={() => handleGuestChange(key, 1)}
                    aria-label={`Increase ${label}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <button
            className="msm-collapsed-btn"
            onClick={() => setActiveStep("who")}
          >
            <span className="msm-collapsed-label">Who</span>
            <span className="msm-collapsed-value">{guestLabel}</span>
          </button>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="msm-footer">
        <button className="msm-footer-search" onClick={onSearch}>
          <FaSearch />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
}
