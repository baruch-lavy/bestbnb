import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const SearchResults = () => {
  const location = useLocation();
  const [stays, setStays] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log("Fetching stays for:", Object.fromEntries(params));

    fetch(`/api/stays?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setStays(data))
      .catch((err) => console.error("Error fetching stays:", err));
  }, [location.search]);

  return (
    <div>
      <h2>Search Results</h2>
      {stays.length > 0 ? stays.map((stay) => <div key={stay.id}>{stay.name}</div>) : <p>No stays found.</p>}
    </div>
  );
};
