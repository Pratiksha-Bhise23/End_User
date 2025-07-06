

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AirportInput = ({ label, value, setValue }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSearch = async (query) => {
    if (!query) {
      setSuggestions([]);
      setShowDropdown(false);
      setError("");
      return;
    }

    try {
      setError("");
      const response = await axios.get("https://end-user.onrender.com/api/flights/live-airport-search", {
        params: { term: query },
      });

      const queryLower = query.toLowerCase();
      let filteredSuggestions = response.data.filter((airport) =>
        airport.label.toLowerCase().includes(queryLower)
      );

      // Deduplicate suggestions by value (IATA code)
      const uniqueSuggestions = Array.from(
        new Map(filteredSuggestions.map((airport) => [airport.value, airport])).values()
      );

      // Find exact match (case-insensitive)
      const exactMatchIndex = uniqueSuggestions.findIndex(
        (airport) => airport.label.toLowerCase() === queryLower
      );

      // Move exact match to top
      let finalSuggestions = uniqueSuggestions;
      if (exactMatchIndex !== -1) {
        const exactMatch = finalSuggestions.splice(exactMatchIndex, 1)[0];
        finalSuggestions = [exactMatch, ...finalSuggestions];
      } else {
        // Sort by relevance
        finalSuggestions.sort((a, b) => {
          const aLabelLower = a.label.toLowerCase();
          const bLabelLower = b.label.toLowerCase();

          const aStartsWith = aLabelLower.startsWith(queryLower);
          const bStartsWith = bLabelLower.startsWith(queryLower);

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;

          const aIndex = aLabelLower.indexOf(queryLower);
          const bIndex = bLabelLower.indexOf(queryLower);

          if (aIndex !== bIndex) return aIndex - bIndex;

          return aLabelLower.localeCompare(bLabelLower);
        });
      }

      setSuggestions(finalSuggestions);
      setShowDropdown(true);
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        localStorage.removeItem("sessionToken");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError("Failed to fetch airport suggestions. Please try again.");
      }
      console.error(
        "Airport search error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="relative">
      <label className="block text-white mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleSearch(e.target.value);
        }}
        className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        placeholder="Type city or airport name"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {showDropdown && suggestions.length > 0 && (
        <div
          className="absolute z-10 mt-1 w-full bg-gray-900 rounded-lg shadow-xl border border-gray-700 max-h-[240px] overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>
            {`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          <div className="no-scrollbar">
            {suggestions.map((airport, index) => (
              <div
                key={`${airport.value}-${index}`} // Unique key using value and index
                className="p-3 text-white cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-150 ease-in-out"
                onClick={() => {
                  setValue(airport.value);
                  setShowDropdown(false);
                }}
              >
                <span className="block text-sm font-medium">{airport.label}</span>
                {suggestions.length > 1 && (
                  <span className="block text-xs text-gray-400">{airport.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportInput;