import React, { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import "./SearchBar.scss"; // Import SCSS file

const suggestions = [
  { icon: "📍", location: "Nearby", description: "Find what’s around you" },
  { icon: "🏖️", location: "Tel Aviv-Yafo, Israel", description: "Popular beach destination" },
  { icon: "🏙️", location: "Bucharest, Romania", description: "For sights like Cismigiu Gardens" },
  { icon: "🌃", location: "Paris, France", description: "For its bustling nightlife" },
  { icon: "🏰", location: "Budapest, Hungary", description: "For its stunning architecture" },
  { icon: "🍽️", location: "Istanbul, Türkiye", description: "For its top-notch dining" },
];

export const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className={`search-section ${isOpen ? "active" : ""}`}>
      <input
        type="text"
        placeholder="Search destinations"
        value={query}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        onChange={(e) => setQuery(e.target.value)}
      />
      {isOpen && (
        <div className="dropdown">
          {suggestions.map((item, index) => (
            <div key={index} className="suggestion">
              <div className="icon">{item.icon}</div>
              <div className="details">
                <span className="location">{item.location}</span>
                <span className="description">{item.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
