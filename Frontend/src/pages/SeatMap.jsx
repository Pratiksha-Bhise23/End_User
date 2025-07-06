



import React, { useState, useEffect } from "react";
import { SEAT_TYPE_COLORS } from "../Constants/seatColors";

// Constants for seat map configuration
const SEAT_MAP_CONFIG = {
  DEFAULT_DEPARTURE: "N/A",
  DEFAULT_DESTINATION: "N/A",
  NO_TRAVELERS_MESSAGE: "No travelers available",
  NO_SEAT_MAP_MESSAGE: "No seat map available",
};

/**
 * SeatMap Component
 * Props:
 * - open: boolean (show/hide popup)
 * - onClose: function (close popup)
 * - travellers: array of traveller objects [{ name, id }]
 * - seatMap: array of seat row objects [{ row: number, seats: [{ seatNo, type, status, fare }] }]
 * - selectedSeats: { [travellerId]: seatNo }
 * - onSelect: function(travellerId, seatObj)
 * - departure: string (departure city or IATA code)
 * - destination: string (destination city or IATA code)
 * - pricedOffer: object (priced offer details for API)
 * - onSeatMapUpdate: function(seatMap) (callback to update parent seatMapData)
 */
const SeatMap = ({
  open,
  onClose,
  travellers = [],
  seatMap: initialSeatMap = [],
  selectedSeats = {},
  onSelect,
  departure = SEAT_MAP_CONFIG.DEFAULT_DEPARTURE,
  destination = SEAT_MAP_CONFIG.DEFAULT_DESTINATION,
  pricedOffer,
  onSeatMapUpdate,
}) => {
  const [activeTraveller, setActiveTraveller] = useState(travellers[0]?.id || null);
  const [seatMap, setSeatMap] = useState(initialSeatMap);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Fetch seat map data
  const fetchSeatMap = async () => {
    if (retryCount >= maxRetries) {
      setError(
        "Unable to fetch seat map data after multiple attempts. Please try again later or skip seat selection."
      );
      setSeatMap([]); // Set empty seat map on failure
      onSeatMapUpdate?.([]); // Update parent with empty seat map
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const sessionToken = localStorage.getItem("sessionToken");
      console.log("Session Token:", sessionToken); // Debug: Log token
      console.log("Priced Offer:", pricedOffer); // Debug: Log pricedOffer
      if (!sessionToken) {
        throw new Error("Authentication required. Please log in.");
      }
      if (!pricedOffer?.id) {
        throw new Error("Priced offer ID is required for seat map request.");
      }
      const response = await fetch("https://end-user.onrender.com/api/flights/seatmap", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pricedOffer }),
      });
      console.log("API Response Status:", response.status); // Debug: Log status
      if (!response.ok) {
        const errorText = await response.text(); // Debug: Capture response body
        console.log("API Error Response:", errorText);
        throw new Error(
          response.status === 400
            ? "Invalid request. Please check flight details."
            : response.status === 404
            ? "Seat map not found. The requested flight may not have a seat map available."
            : `Failed to fetch seat map data (Status: ${response.status})`
        );
      }
      const data = await response.json();
      console.log("API Response Data:", JSON.stringify(data, null, 2)); // Debug: Log full response
      if (data.status === "success" && data.seatMaps?.length > 0) {
        const transformedSeatMap = transformSeatMap(data.seatMaps[0]);
        console.log("Transformed Seat Map:", transformedSeatMap); // Debug: Log transformed data
        setSeatMap(transformedSeatMap);
        onSeatMapUpdate?.(transformedSeatMap); // Update parent
        setRetryCount(0); // Reset retry count on success
      } else {
        throw new Error("Invalid seat map response or no seat maps available");
      }
    } catch (err) {
      console.error("Fetch Error:", err.message); // Debug: Log error
      setError(err.message);
      setRetryCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch seat map when modal opens
  useEffect(() => {
    if (!open) return;
    fetchSeatMap();
  }, [open, retryCount]);

  // Transform seat map data to match expected format
  const transformSeatMap = (seatMap) => {
    if (!seatMap?.decks?.[0]?.seats) {
      console.warn("Invalid seat map structure:", seatMap); // Debug: Log invalid data
      return [];
    }

    const seats = seatMap.decks[0].seats;
    const deckConfig = seatMap.decks[0].deckConfiguration;
    const { startSeatRow, endSeatRow, width } = deckConfig;

    // Create a map of rows for grouping
    const rowsMap = new Map();

    seats.forEach((seat) => {
      const row = seat.coordinates.x + startSeatRow;
      if (!rowsMap.has(row)) {
        rowsMap.set(row, []);
      }

      // Safely handle characteristicsCodes
      const characteristics = Array.isArray(seat.characteristicsCodes) ? seat.characteristicsCodes : [];
      const seatData = {
        seatNo: seat.number || "",
        type: characteristics.includes("W")
          ? "Window"
          : characteristics.includes("A")
          ? "Aisle"
          : characteristics.includes("9")
          ? "Middle"
          : "Standard",
        status: seat.travelerPricing?.[0]?.seatAvailabilityStatus?.toLowerCase() || "unknown",
        fare: parseFloat(seat.travelerPricing?.[0]?.price?.total || 0),
      };

      rowsMap.get(row).push(seatData);
    });

    // Convert rowsMap to array of rows
    const seatMapRows = [];
    for (let row = startSeatRow; row <= endSeatRow; row++) {
      if (rowsMap.has(row)) {
        seatMapRows.push({
          row,
          seats: rowsMap.get(row).sort((a, b) => a.seatNo.localeCompare(b.seatNo)),
        });
      } else {
        seatMapRows.push({ row, seats: Array(width).fill(null) });
      }
    }

    return seatMapRows;
  };

  // Return null if modal is not open
  if (!open) return null;

  // Handle empty travelers case
  if (travellers.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-end  bg-opacity-30">
        <div className="w-full max-w-xl h-full bg-white shadow-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Select Seat</h2>
            <button
              className="text-gray-500 hover:text-gray-700 text-2xl p-1"
              onClick={onClose}
              aria-label="Close seat map"
            >
              ×
            </button>
          </div>
          <p className="text-center text-gray-500 flex-1">
            {SEAT_MAP_CONFIG.NO_TRAVELERS_MESSAGE}
          </p>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
            onClick={onClose}
            aria-label="Close seat selection"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Helper to get seat status
  const getSeatStatus = (seat, travellerId) => {
    if (selectedSeats[travellerId] === seat.seatNo) return "your";
    if (seat.status === "reserved" || Object.values(selectedSeats).includes(seat.seatNo)) return "reserved";
    return "others";
  };

  // Helper to get seat color
  const getSeatColor = (status) => SEAT_TYPE_COLORS[status] || SEAT_TYPE_COLORS.others;

  // Calculate total fare for all selected seats
  const totalFare = Object.keys(selectedSeats).reduce((sum, travellerId) => {
    const seat = seatMap
      .flatMap((row) => row.seats || [])
      .find((s) => s?.seatNo === selectedSeats[travellerId]);
    return sum + (seat?.fare || 0);
  }, 0);

  // Get selected seat object for active traveler
  const selectedSeatObj = seatMap
    .flatMap((row) => row.seats || [])
    .find((s) => s?.seatNo === selectedSeats[activeTraveller]);

  // Handle seat click (allow deselection)
  const handleSeatClick = (travellerId, seatObj) => {
    if (seatObj.status === "reserved" || Object.values(selectedSeats).includes(seatObj.seatNo)) {
      return; // Prevent selecting reserved or already selected seats
    }
    onSelect(travellerId, selectedSeats[travellerId] === seatObj.seatNo ? { seatNo: null, fare: 0 } : seatObj);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end  bg-opacity-30">
      {/* Popup Panel */}
      <div className="w-full max-w-xl h-full bg-white shadow-2xl flex flex-col animate-slide-in-right relative overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Select Seat</h2>
            <div className="text-xs text-gray-500 mt-1">
              <span className="font-medium">ONWARD</span>
            </div>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl p-1"
            onClick={onClose}
            aria-label="Close seat map"
          >
            ×
          </button>
        </div>

        {/* Traveller Tabs */}
        <div role="tablist" className="flex space-x-2 px-4 py-2 border-b bg-gray-50">
          {travellers.map((trav) => (
            <button
              key={trav.id}
              role="tab"
              aria-selected={activeTraveller === trav.id}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-150 ${
                activeTraveller === trav.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
              onClick={() => setActiveTraveller(trav.id)}
            >
              {trav.name}
            </button>
          ))}
        </div>

        {/* Route Info */}
        <div className="flex items-center justify-between px-4 py-2 text-sm border-b">
          <div>
            <span className="font-medium text-indigo-700">{departure}</span>
            <span className="mx-2">→</span>
            <span className="font-medium text-indigo-700">{destination}</span>
          </div>
          {selectedSeatObj && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">{selectedSeatObj.seatNo}</span>
              <span className="text-xs font-semibold text-green-700">€ {selectedSeatObj.fare.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Seat Map */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-600">Loading seat map...</p>
          ) : error ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-center text-red-500">{error}</p>
              {retryCount < maxRetries && (
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
                  onClick={fetchSeatMap}
                  aria-label="Retry fetching seat map"
                >
                  Retry
                </button>
              )}
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
                onClick={onClose}
                aria-label="Proceed without seat selection"
              >
                Skip Seat Selection
              </button>
            </div>
          ) : seatMap.length === 0 ? (
            <p className="text-center text-gray-500">{SEAT_MAP_CONFIG.NO_SEAT_MAP_MESSAGE}</p>
          ) : (
            <>
              <div className="flex flex-row items-center mb-2">
                <span className="text-xs font-bold mr-2">FRONT</span>
                <div className="flex-1 border-t border-dashed border-gray-400"></div>
                <span className="text-xs font-bold ml-2">BACK</span>
              </div>
              <div className="overflow-x-auto">
                <table className="border-spacing-2 border-separate mx-auto" role="grid">
                  <tbody>
                    {seatMap.map((row, rowIdx) => (
                      <tr key={rowIdx} role="row">
                        <td className="text-xs text-gray-500 pr-2 font-bold align-middle">{row.row}</td>
                        {row.seats.map((seat, seatIdx) => {
                          if (!seat) return <td key={seatIdx} />;
                          const status = getSeatStatus(seat, activeTraveller);
                          const isDisabled = seat.status === "reserved" || Object.values(selectedSeats).includes(seat.seatNo);
                          return (
                            <td key={seatIdx} className="align-middle" role="gridcell">
                              <button
                                tabIndex={0}
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-150 ${getSeatColor(status)} ${
                                  isDisabled ? "opacity-50 cursor-not-allowed" : "hover:ring-2 hover:ring-indigo-300 cursor-pointer"
                                } ${status === "your" ? "ring-2 ring-green-400" : ""}`}
                                disabled={isDisabled}
                                onClick={() => handleSeatClick(activeTraveller, seat)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleSeatClick(activeTraveller, seat);
                                  }
                                }}
                                title={`Seat No: ${seat.seatNo} | Seat Type: ${seat.type} | Fare: €${seat.fare.toFixed(2)}`}
                                aria-label={`Seat ${seat.seatNo} ${isDisabled ? "(Reserved or already selected)" : ""}`}
                              >
                                {seat.seatNo}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {/* Legend */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-1">
              <span
                className="w-4 h-4 rounded bg-green-600 inline-block border"
                aria-label="Your selected seat"
              ></span>
              <span className="text-xs">Your Seat</span>
            </div>
            <div className="flex items-center space-x-1">
              <span
                className="w-4 h-4 rounded bg-gray-200 inline-block border"
                aria-label="Available seat"
              ></span>
              <span className="text-xs">Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <span
                className="w-4 h-4 rounded bg-blue-400 inline-block border"
                aria-label="Reserved seat"
              ></span>
              <span className="text-xs">Reserved</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex items-center justify-between bg-white">
          <div className="text-lg font-semibold">
            Total Amount for All Seats: <span className="text-indigo-700">€ {totalFare.toFixed(2)}</span>
          </div>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
            onClick={onClose}
            aria-label="Confirm seat selection and close"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;