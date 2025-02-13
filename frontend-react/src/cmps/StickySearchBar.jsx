import React from "react";
import { FaSearch } from "react-icons/fa";

export const StickySearchBar = ({ destination, startDate, endDate, guests, handleDropdownOpen }) => {
  const formatDate = (date) =>
    date ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date) : "";

  return (
    <div className="sticky-search-bar">
      <div className="sticky-content">
        <span className="sticky-item" onClick={() => handleDropdownOpen("where")}>
          {destination || "Anywhere"}
        </span>
        <span className="sticky-divider"></span>
        <span className="sticky-item" onClick={() => handleDropdownOpen("dates")}>
          {startDate && endDate ? `${formatDate(startDate)} – ${formatDate(endDate)}` : "Any week"}
        </span>
        <span className="sticky-divider"></span>
        <span className="sticky-item" onClick={() => handleDropdownOpen("who")}>
          {guests}
        </span>
      </div>
      <button className="sticky-search-btn">
        <FaSearch />
      </button>
    </div>
  );
};
