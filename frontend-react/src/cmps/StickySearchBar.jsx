import React from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

export const StickySearchBar = ({ handleDropdownOpen }) => {
  const { destination, startDate, endDate, guests } = useSelector((state) => state.search); // Redux state

  const formatDate = (date) =>
    date ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date) : "";

  return (
    <div className="sticky-search-bar">
      <div className="sticky-content">
        <span
          className="sticky-item"
          onClick={(e) => {
            e.stopPropagation(); // Prevents event bubbling
            handleDropdownOpen("where");
          }}
        >
          {destination || "Anywhere"}
        </span>
        <span className="sticky-divider">|</span>
        <span
          className="sticky-item"
          onClick={(e) => {
            e.stopPropagation();
            handleDropdownOpen("dates");
          }}
        >
          {startDate && endDate ? `${formatDate(startDate)} – ${formatDate(endDate)}` : "Any week"}
        </span>
        <span className="sticky-divider">|</span>
        <span
          className="sticky-item"
          onClick={(e) => {
            e.stopPropagation();
            handleDropdownOpen("who");
          }}
        >
          {guests}
        </span>
      </div>
      <button
        className="sticky-search-btn"
        onClick={(e) => {
          e.stopPropagation();
          handleDropdownOpen("where");
        }}
      >
        <FaSearch />
      </button>
    </div>
  );
};
