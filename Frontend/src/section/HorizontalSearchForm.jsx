
// ................................................................

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import PassengerDropdown from "../section/PassengerDropdown"; // Adjust path if needed

const HorizontalSearchForm = ({ initialData = {}, onSearch }) => {
  const navigate = useNavigate();
  const [departure, setDeparture] = useState(initialData.departure || "");
  const [destination, setDestination] = useState(initialData.destination || "");
  const [departureDate, setDepartureDate] = useState(initialData.departureDate || "");
  const [returnDate, setReturnDate] = useState(initialData.returnDate || "");
  const [passengers, setPassengers] = useState(initialData.passengers || { adults: 1, children: 0, infants: 0 });
  const [error, setError] = useState("");
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const departureRef = useRef(null);
  const destinationRef = useRef(null);
  const departureInputRef = useRef(null);
  const destinationInputRef = useRef(null);

  const handleAirportSearch = async (query, type) => {
    if (!query) {
      type === "departure" ? setDepartureSuggestions([]) : setDestinationSuggestions([]);
      type === "departure" ? setShowDepartureDropdown(false) : setShowDestinationDropdown(false);
      setError("");
      return;
    }

    try {
      setError("");
      const response = await axios.get(
        "https://end-user.onrender.com/api/flights/live-airport-search",
        {
          params: { term: query },
        }
      );

      const queryLower = query.toLowerCase();
      const filteredSuggestions = response.data.filter((airport) =>
        airport.label.toLowerCase().includes(queryLower)
      );

      if (type === "departure") {
        setDepartureSuggestions(filteredSuggestions);
        setShowDepartureDropdown(true);
      } else {
        setDestinationSuggestions(filteredSuggestions);
        setShowDestinationDropdown(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        localStorage.removeItem("sessionToken");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to fetch airport suggestions. Please try again.");
      }
    }
  };

  const handleInputChange = (value, type) => {
    if (type === "departure") {
      setDeparture(value);
      handleAirportSearch(value, "departure");
    } else {
      setDestination(value);
      handleAirportSearch(value, "destination");
    }
  };

  const handleSuggestionSelect = (suggestion, type) => {
    const code = suggestion.value || "";
    if (type === "departure") {
      setDeparture(code);
      setShowDepartureDropdown(false);
      if (departureInputRef.current) {
        departureInputRef.current.focus();
      }
    } else {
      setDestination(code);
      setShowDestinationDropdown(false);
      if (destinationInputRef.current) {
        destinationInputRef.current.focus();
      }
    }
  };

  const handlePassengerChange = (newPassengers) => {
    setPassengers(newPassengers);
  };

  const handleSearch = async () => {
    if (!departure || !destination || !departureDate) {
      setError("Please fill all required fields");
      return;
    }

    setIsSearching(true);
    try {
      setError("");
      const response = await axios.get(
        "https://end-user.onrender.com/api/flights/search",
        {
          params: {
            origin: departure.toUpperCase(),
            destination: destination.toUpperCase(),
            date: departureDate,
          },
        }
      );

      await onSearch({
        flights: response.data.flights,
        passengers,
        departure,
        destination,
        departureDate,
        returnDate,
      });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to fetch flights. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (departureRef.current && !departureRef.current.contains(event.target)) {
        setShowDepartureDropdown(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowDestinationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 sm:p-6 rounded-2xl shadow-xl mb-6 sm:mb-8 mx-auto max-w-screen-2xl w-full transform hover:shadow-2xl transition-shadow duration-300 relative z-[1000]">
      <style>
        {`
          .no-scroll::-webkit-scrollbar {
            display: none;
          }
          .no-scroll {
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}
      </style>
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
        <div className="relative flex-1 min-w-[120px]" ref={departureRef}>
          <label className="block text-xs sm:text-sm font-medium text-white mb-1">From</label>
          <input
            ref={departureInputRef}
            type="text"
            value={departure || ""}
            onChange={(e) => handleInputChange(e.target.value, "departure")}
            onFocus={() => handleAirportSearch(departure, "departure")}
            className="w-full p-2 sm:p-3 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-200 text-sm sm:text-base"
            placeholder="Departure"
          />
          {showDepartureDropdown && departureSuggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full mt-1 sm:mt-2 bg-white rounded-xl shadow-lg max-h-48 sm:max-h-60 overflow-y-auto z-[3000] no-scroll">
              {departureSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 sm:p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-colors duration-150 text-xs sm:text-sm"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionSelect(suggestion, "departure");
                  }}
                >
                  <span className="font-semibold">{suggestion.value || ""}</span> - {suggestion.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative flex-1 min-w-[120px]" ref={destinationRef}>
          <label className="block text-xs sm:text-sm font-medium text-white mb-1">To</label>
          <input
            ref={destinationInputRef}
            type="text"
            value={destination || ""}
            onChange={(e) => handleInputChange(e.target.value, "destination")}
            onFocus={() => handleAirportSearch(destination, "destination")}
            className="w-full p-2 sm:p-3 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-200 text-sm sm:text-base"
            placeholder="Destination"
          />
          {showDestinationDropdown && destinationSuggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full mt-1 sm:mt-2 bg-white rounded-xl shadow-lg max-h-48 sm:max-h-60 overflow-y-auto z-[3000] no-scroll">
              {destinationSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 sm:p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-colors duration-150 text-xs sm:text-sm"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionSelect(suggestion, "destination");
                  }}
                >
                  <span className="font-semibold">{suggestion.value || ""}</span> - {suggestion.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs sm:text-sm font-medium text-white mb-1">Depart</label>
          <input
            type="date"
            value={departureDate || ""}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full p-2 sm:p-3 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-200 text-sm sm:text-base"
          />
        </div>

        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs sm:text-sm font-medium text-white mb-1">Return</label>
          <input
            type="date"
            value={returnDate || ""}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full p-2 sm:p-3 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-200 text-sm sm:text-base"
          />
        </div>

        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs sm:text-sm font-medium text-white mb-1"></label>
          <PassengerDropdown initialPassengers={passengers} onPassengerChange={handlePassengerChange} />
        </div>

        <Button
          className="bg-green-400 hover:bg-blue-800 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 w-full sm:w-auto text-sm sm:text-base"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && <p className="text-red-300 text-xs sm:text-sm mt-2 sm:mt-3 text-center">{error}</p>}
    </div>
  );
};

export default HorizontalSearchForm;