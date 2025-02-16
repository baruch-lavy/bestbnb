import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStays } from "../store/actions/stay.actions.js";

export const SearchResults = () => {
  const dispatch = useDispatch();
  const stays = useSelector((state) => state.stayModule.stays);

  // ✅ Extract search parameters from the URL
  const searchParams = new URLSearchParams(window.location.search);
  const [searchValues, setSearchValues] = useState({
    destination: searchParams.get("destination") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    guests: Number(searchParams.get("guests")) || 1,
  });

  // ✅ Fetch stays on page load
  useEffect(() => {
    if (stays.length === 0) {
      console.log("🚀 Fetching stays with filter:", searchValues);
      dispatch(loadStays(searchValues));
    }
  }, [stays.length, dispatch, searchValues]);

  return (
    <div className="search-results">
      <h2>Search Results</h2>

      {/* ✅ Display Stays */}
      {stays.length === 0 ? (
        <p>No stays match your search criteria.</p>
      ) : (
        <div className="stays-list">
          {stays.map((stay) => (
            <div key={stay._id} className="stay-card">
              <img src={stay.imgUrls?.[0]} alt={stay.name} />
              <h3>{stay.name}</h3>
              <p>{stay.loc?.country || "Unknown Location"}</p>
              <p>${stay.price} per night</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
