

// import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Button from "../components/Button";
// import FilterSection from "../section/FilterSection";
// import HorizontalSearchForm from "../section/HorizontalSearchForm";
// import { CurrencyContext } from "../components/CurrencyContext"; // Import CurrencyContext

// const FlightResults = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { selectedCountry } = useContext(CurrencyContext); // Access selected country
//   const [originalFlights, setOriginalFlights] = useState(location.state?.flights || []);
//   const [passengers, setPassengers] = useState(location.state?.passengers || 1);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filteredFlights, setFilteredFlights] = useState([]);
//   const [loadingStates, setLoadingStates] = useState({}); // Track loading state for each flight

//   const searchFormData = {
//     departure: location.state?.departure || "",
//     destination: location.state?.destination || "",
//     departureDate: location.state?.departureDate || "",
//     returnDate: location.state?.returnDate || "",
//     passengers: location.state?.passengers || 1,
//   };

//   // Debugging: Log initial flights
//   useEffect(() => {
//     console.log("Original flights:", originalFlights);
//     console.log("Filtered flights:", filteredFlights);
//   }, [originalFlights, filteredFlights]);

//   const formatDuration = (duration) => {
//     const match = duration.match(/PT(\d+)H(?:(\d+)M)?/);
//     if (!match) return duration.replace("PT", "").toLowerCase();
//     const hours = match[1].padStart(2, "0");
//     const minutes = match[2] ? match[2].padStart(2, "0") : "00";
//     return `${hours}h ${minutes}m`;
//   };

//   const calculateStops = (segments) => {
//     return segments.length - 1;
//   };

//   const calculateRewards = (price) => {
//     return Math.floor(price / 10);
//   };

//   // Mock currency conversion function (replace with real exchange rate API in production)
//   const convertPrice = (priceUSD) => {
//     if (!selectedCountry) return priceUSD; // Default to USD if no country selected
//     // Mock exchange rates (for demonstration; use an API like Open Exchange Rates in production)
//     const exchangeRates = {
//       USD: 1,
//       CAD: 1.39, // 1 USD = 1.39 CAD
//       EUR: 0.95, // 1 USD = 0.95 EUR
//       GBP: 0.80, // 1 USD = 0.80 GBP
//       JPY: 150,  // 1 USD = 150 JPY
//     };
//     const rate = exchangeRates[selectedCountry.currency_code] || 1;
//     return (priceUSD * rate).toFixed(2); // Return converted price with 2 decimal places
//   };

//   // Memoized filterFlights function
//   const filterFlights = useCallback(
//     (criteria) => {
//       console.log("Filter criteria:", criteria);
//       let result = [...originalFlights];

//       if (criteria.priceRange) {
//         result = result.filter((flight) => {
//           const price = parseFloat(flight.price?.grandTotal || flight.price?.GrandTotal || 0);
//           return price <= criteria.priceRange;
//         });
//       }
//       if (criteria.stops.length > 0) {
//         result = result.filter((flight) => {
//           const stopsCount = calculateStops(flight.itineraries[0].segments);
//           return (
//             (criteria.stops.includes("nonStop") && stopsCount === 0) ||
//             (criteria.stops.includes("oneStop") && stopsCount === 1) ||
//             (criteria.stops.includes("twoPlusStops") && stopsCount >= 2)
//           );
//         });
//       }
//       if (criteria.airlines.length > 0) {
//         result = result.filter((flight) =>
//           flight.validatingAirlineCodes.some((code) => criteria.airlines.includes(code))
//         );
//       }
//       if (criteria.departureTimes.length > 0) {
//         result = result.filter((flight) => {
//           const departureHour = new Date(flight.itineraries[0].segments[0].departure.at).getUTCHours();
//           return (
//             (criteria.departureTimes.includes("morning") && departureHour >= 6 && departureHour < 12) ||
//             (criteria.departureTimes.includes("afternoon") && departureHour >= 12 && departureHour < 18) ||
//             (criteria.departureTimes.includes("evening") && departureHour >= 18 && departureHour < 24) ||
//             (criteria.departureTimes.includes("night") && (departureHour >= 0 && departureHour < 6))
//           );
//         });
//       }
//       if (criteria.arrivalTimes.length > 0) {
//         result = result.filter((flight) => {
//           const lastSegment = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
//           const arrivalHour = new Date(lastSegment.arrival.at).getUTCHours();
//           return (
//             (criteria.arrivalTimes.includes("morning") && arrivalHour >= 6 && arrivalHour < 12) ||
//             (criteria.arrivalTimes.includes("afternoon") && arrivalHour >= 12 && arrivalHour < 18) ||
//             (criteria.arrivalTimes.includes("evening") && arrivalHour >= 18 && arrivalHour < 24) ||
//             (criteria.arrivalTimes.includes("night") && (arrivalHour >= 0 && arrivalHour < 6))
//           );
//         });
//       }

//       console.log("Filtered result:", result);
//       setFilteredFlights(result);
//     },
//     [originalFlights]
//   );

//   // Memoize originalFlights
//   const memoizedOriginalFlights = useMemo(() => originalFlights, [originalFlights]);

//   // Initialize filteredFlights with originalFlights
//   useEffect(() => {
//     if (originalFlights.length > 0) {
//       setFilteredFlights(originalFlights);
//       console.log("Initialized filteredFlights:", originalFlights);
//     }
//   }, [originalFlights]);

//   const handleSearchUpdate = (newSearchData) => {
//     setOriginalFlights(newSearchData.flights);
//     setPassengers(newSearchData.passengers);
//     navigate("/results", {
//       state: {
//         flights: newSearchData.flights,
//         passengers: newSearchData.passengers,
//         departure: newSearchData.departure,
//         destination: newSearchData.destination,
//         departureDate: newSearchData.departureDate,
//         returnDate: newSearchData.returnDate,
//       },
//       replace: true,
//     });
//   };

//   const handleBookNow = async (flight, index) => {
//     console.log("handleBookNow triggered for flight:", flight);
//     setLoadingStates((prev) => ({ ...prev, [index]: true })); // Set loading for specific flight
//     try {
//       const departureSegment = flight.itineraries[0].segments[0];
//       const arrivalSegment = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
//       const departureTime = new Date(departureSegment.departure.at).toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//       });
//       const arrivalTime = new Date(arrivalSegment.arrival.at).toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//       });
//       const duration = formatDuration(flight.itineraries[0].duration);
//       const stops = calculateStops(flight.itineraries[0].segments);

//       const requestData = {
//         flightOffer: flight,
//       };

//       console.log("Sending request data:", JSON.stringify(requestData, null, 2));

//       const response = await fetch("http://localhost:3000/api/flights/price", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestData),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("API response:", data);

//       const transformedResponse = {
//         departure: flight.itineraries[0].segments[0].departure,
//         arrival: flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival,
//         departureTime: departureTime,
//         arrivalTime: arrivalTime,
//         duration: duration,
//         stops: stops,
//         aircraft: "AIRBUS JET",
//         fare: parseFloat(flight.price.grandTotal || flight.price.GrandTotal) || 5387,
//         discount: 213.45,
//         insurance: 199,
//         additionalDiscount: 37.55,
//         totalAmount: parseFloat(flight.price.grandTotal || flight.price.GrandTotal) || 5335,
//       };

//       console.log("Navigating to /booking with state:", transformedResponse);
//       setTimeout(() => {
//         navigate("/booking", {
//           state: { bookingResponse: transformedResponse },
//         });
//         console.log("Navigation call executed");
//       }, 100);
//     } catch (error) {
//       console.error("Error calling price API:", error.message);
//       alert("Failed to fetch price details. Please try again or contact support.");
//     } finally {
//       setLoadingStates((prev) => ({ ...prev, [index]: false })); // Reset loading for specific flight
//     }
//   };

//   return (
//     <div
//       className="min-h-screen bg-gray-100"
//       style={{
//         backgroundImage: `url('https://images.unsplash.com/photo-1507521628349-6e9b9a9a1f1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundAttachment: "fixed",
//       }}
//     >
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
//         <div className="sticky top-0 z-[2000] bg-opacity-95 backdrop-blur-md">
//           <HorizontalSearchForm initialData={searchFormData} onSearch={handleSearchUpdate} />
//         </div>

//         <div className="flex flex-col lg:flex-row gap-6">
//           <div className="lg:w-1/4 lg:sticky lg:top-32 lg:h-[calc(100vh-8rem)] z-[1500]">
//             <FilterSection
//               isOpen={isFilterOpen}
//               onClose={() => setIsFilterOpen(false)}
//               flights={memoizedOriginalFlights}
//               onFilterChange={filterFlights}
//             />
//             <button
//               className="lg:hidden mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
//               onClick={() => setIsFilterOpen(!isFilterOpen)}
//             >
//               {isFilterOpen ? "Close Filters" : "Open Filters"}
//             </button>
//           </div>

//           <div className="lg:w-3/4">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-xl shadow-md">
//               <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 drop-shadow-lg">MultiflyTravel</h1>
//               <div className="flex flex-col sm:flex-row sm:space-x-4 text-gray-700 mt-2 sm:mt-0">
//                 <p className="text-sm sm:text-base drop-shadow-md">
//                   {filteredFlights[0]?.itineraries[0]?.segments[0]?.departure.iataCode || "N/A"} -{" "}
//                   {filteredFlights[0]?.itineraries[0]?.segments[
//                     filteredFlights[0]?.itineraries[0]?.segments.length - 1
//                   ]?.arrival.iataCode || "N/A"}
//                 </p>
//                 <p className="text-sm sm:text-base drop-shadow-md">
//                   {filteredFlights[0]?.itineraries[0]?.segments[0]?.departure.at
//                     ? new Date(filteredFlights[0].itineraries[0].segments[0].departure.at).toLocaleDateString("en-US", {
//                         day: "numeric",
//                         month: "short",
//                       })
//                     : "N/A"}
//                 </p>
//                 <p className="text-sm sm:text-base drop-shadow-md">
//                   {passengers} Passenger{passengers !== 1 ? "s" : ""}
//                 </p>
//               </div>
//             </div>

//             <div className="max-h-[calc(100vh-12rem)] overflow-y-auto no-scroll space-y-4 pr-2">
//               {filteredFlights.length > 0 ? (
//                 filteredFlights.map((flight, index) => {
//                   const departureSegment = flight.itineraries[0].segments[0];
//                   const arrivalSegment = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
//                   const departureTime = departureSegment.departure.at
//                     ? new Date(departureSegment.departure.at).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: false,
//                       })
//                     : "N/A";
//                   const arrivalTime = arrivalSegment.arrival.at
//                     ? new Date(arrivalSegment.arrival.at).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: false,
//                       })
//                     : "N/A";
//                   const duration = flight.itineraries[0].duration ? formatDuration(flight.itineraries[0].duration) : "N/A";
//                   const stops = calculateStops(flight.itineraries[0].segments);
//                   const basePrice = flight.price?.grandTotal
//                     ? parseFloat(flight.price.grandTotal)
//                     : flight.price?.GrandTotal
//                     ? parseFloat(flight.price.GrandTotal)
//                     : 0;
//                   const convertedPrice = convertPrice(basePrice).toLocaleString("en-US", {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2,
//                   });
//                   const rewards = basePrice ? calculateRewards(basePrice) : 0;
//                   const currencySymbol = selectedCountry ? selectedCountry.currency_symbol : "$";

//                   return (
//                     <div
//                       key={index}
//                       className="bg-white bg-opacity-95 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between"
//                     >
//                       <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
//                         <div className="flex space-x-2">
//                           {flight.validatingAirlineCodes.map((code, idx) => (
//                             <div
//                               key={idx}
//                               className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full shadow-md"
//                             ></div>
//                           ))}
//                         </div>
//                         <div className="text-sm text-gray-700 font-medium">
//                           {flight.validatingAirlineCodes.map((code, idx) => (
//                             <span key={idx}>
//                               {code} {flight.itineraries[0].segments[idx]?.number || "N/A"}
//                               {idx < flight.validatingAirlineCodes.length - 1 && " + "}
//                             </span>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mt-2 sm:mt-0">
//                         <div className="text-center">
//                           <p className="text-lg sm:text-xl font-bold text-gray-800">{departureTime}</p>
//                           <p className="text-xs sm:text-sm text-gray-600">
//                             {departureSegment.departure.iataCode || "N/A"},{" "}
//                             {departureSegment.departure.terminal
//                               ? `T${departureSegment.departure.terminal}`
//                               : "T N/A"}
//                           </p>
//                         </div>
//                         <div className="text-center">
//                           <p className="text-sm text-gray-600 font-medium">{duration}</p>
//                           <p className="text-xs text-gray-500">
//                             {stops} stop{stops !== 1 ? "s" : ""}
//                           </p>
//                           <div className="flex items-center justify-center mt-1">
//                             <div className="h-px w-6 sm:w-8 bg-gray-400"></div>
//                             <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
//                             <div className="h-px w-6 sm:w-8 bg-gray-400"></div>
//                           </div>
//                         </div>
//                         <div className="text-center">
//                           <p className="text-lg sm:text-xl font-bold text-gray-800">{arrivalTime}</p>
//                           <p className="text-xs sm:text-sm text-gray-600">
//                             {arrivalSegment.arrival.iataCode || "N/A"},{" "}
//                             {arrivalSegment.arrival.terminal ? `T${arrivalSegment.arrival.terminal}` : "T N/A"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="text-left sm:text-right mt-2 sm:mt-0">
//                         <p className="text-xs sm:text-sm text-green-600 font-semibold">FILLING FAST</p>
//                         <p className="text-lg sm:text-xl font-bold text-gray-800">
//                           {currencySymbol}
//                           {convertedPrice}
//                         </p>
//                         <p className="text-xs sm:text-sm text-indigo-600">
//                           + Earn {rewards.toLocaleString("en-US")} Multifly Points
//                         </p>
//                         <button
//                           className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 w-full sm:w-auto"
//                           onClick={() => handleBookNow(flight, index)}
//                           disabled={loadingStates[index]}
//                         >
//                           {loadingStates[index] ? "Processing..." : "Book Now"}
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <p className="text-black text-lg sm:text-xl drop-shadow-md text-center py-6">
//                   No flights found with the applied filters.
//                 </p>
//               )}
//             </div>

//             <div className="flex justify-center mt-6">
//               <Button
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 sm:py-3 sm:px-8 rounded-full shadow-md hover:shadow-lg transition duration-300"
//                 onClick={() => navigate("/")}
//               >
//                 Back to Search
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FlightResults;



import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import FilterSection from "../section/FilterSection";
import HorizontalSearchForm from "../section/HorizontalSearchForm";
import { CurrencyContext } from "../components/CurrencyContext";

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCountry } = useContext(CurrencyContext);
  const [originalFlights, setOriginalFlights] = useState(location.state?.flights || []);
  const [passengers, setPassengers] = useState(location.state?.passengers || { adults: 1, children: 0, infants: 0 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});

  const searchFormData = {
    departure: location.state?.departure || "",
    destination: location.state?.destination || "",
    departureDate: location.state?.departureDate || "",
    returnDate: location.state?.returnDate || "",
    passengers: location.state?.passengers || { adults: 1, children: 0, infants: 0 },
  };

  useEffect(() => {
    if (originalFlights.length > 0) {
      setFilteredFlights(originalFlights);
    }
  }, [originalFlights]);

  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+)H(?:(\d+)M)?/);
    if (!match) return duration.replace("PT", "").toLowerCase();
    const hours = match[1].padStart(2, "0");
    const minutes = match[2] ? match[2].padStart(2, "0") : "00";
    return `${hours}h ${minutes}m`;
  };

  const calculateStops = (segments) => {
    return segments.length - 1;
  };

  const calculateRewards = (price) => {
    return Math.floor(price / 10);
  };

  const convertPrice = (priceUSD) => {
    if (!selectedCountry) return priceUSD;
    const exchangeRates = {
      USD: 1,
      CAD: 1.39,
      EUR: 0.95,
      GBP: 0.80,
      JPY: 150,
    };
    const rate = exchangeRates[selectedCountry.currency_code] || 1;
    return (priceUSD * rate).toFixed(2);
  };

  const filterFlights = useCallback(
    (criteria) => {
      let result = [...originalFlights];

      if (criteria.priceRange) {
        result = result.filter((flight) => {
          const price = parseFloat(flight.price?.grandTotal || flight.price?.GrandTotal || 0);
          return price <= criteria.priceRange;
        });
      }
      if (criteria.stops.length > 0) {
        result = result.filter((flight) => {
          const stopsCount = calculateStops(flight.itineraries[0].segments);
          return (
            (criteria.stops.includes("nonStop") && stopsCount === 0) ||
            (criteria.stops.includes("oneStop") && stopsCount === 1) ||
            (criteria.stops.includes("twoPlusStops") && stopsCount >= 2)
          );
        });
      }
      if (criteria.airlines.length > 0) {
        result = result.filter((flight) =>
          flight.validatingAirlineCodes.some((code) => criteria.airlines.includes(code))
        );
      }
      if (criteria.departureTimes.length > 0) {
        result = result.filter((flight) => {
          const departureHour = new Date(flight.itineraries[0].segments[0].departure.at).getUTCHours();
          return (
            (criteria.departureTimes.includes("morning") && departureHour >= 6 && departureHour < 12) ||
            (criteria.departureTimes.includes("afternoon") && departureHour >= 12 && departureHour < 18) ||
            (criteria.departureTimes.includes("evening") && departureHour >= 18 && departureHour < 24) ||
            (criteria.departureTimes.includes("night") && (departureHour >= 0 && departureHour < 6))
          );
        });
      }
      if (criteria.arrivalTimes.length > 0) {
        result = result.filter((flight) => {
          const lastSegment = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
          const arrivalHour = new Date(lastSegment.arrival.at).getUTCHours();
          return (
            (criteria.arrivalTimes.includes("morning") && arrivalHour >= 6 && arrivalHour < 12) ||
            (criteria.arrivalTimes.includes("afternoon") && arrivalHour >= 12 && arrivalHour < 18) ||
            (criteria.arrivalTimes.includes("evening") && arrivalHour >= 18 && arrivalHour < 24) ||
            (criteria.arrivalTimes.includes("night") && (arrivalHour >= 0 && arrivalHour < 6))
          );
        });
      }

      setFilteredFlights(result);
    },
    [originalFlights]
  );

  const memoizedOriginalFlights = useMemo(() => originalFlights, [originalFlights]);

  const handleSearchUpdate = useCallback((newSearchData) => {
    setOriginalFlights(newSearchData.flights || []);
    setPassengers(newSearchData.passengers || { adults: 1, children: 0, infants: 0 });
    navigate("/results", {
      state: {
        flights: newSearchData.flights || [],
        passengers: newSearchData.passengers || { adults: 1, children: 0, infants: 0 },
        departure: newSearchData.departure || "",
        destination: newSearchData.destination || "",
        departureDate: newSearchData.departureDate || "",
        returnDate: newSearchData.returnDate || "",
      },
      replace: true,
    });
  }, [navigate]);

  const handleBookNow = async (flight, index) => {
    setLoadingStates((prev) => ({ ...prev, [index]: true }));
    try {
      const departureSegment = flight.itineraries[0].segments[0];
      const arrivalSegment = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
      const departureTime = new Date(departureSegment.departure.at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const arrivalTime = new Date(arrivalSegment.arrival.at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const duration = formatDuration(flight.itineraries[0].duration);
      const stops = calculateStops(flight.itineraries[0].segments);

      const requestData = {
        flightOffer: flight,
      };

      const response = await fetch("http://localhost:3000/api/flights/price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.includes("Flight offer is required")) {
          throw new Error("The flight offer data is missing or invalid. Please try again or contact support.");
        }
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();

      const pricedOffer = data.pricedOffer || {};
      const travelerPricings = pricedOffer.travelerPricings || [{}];
      const fareDetails = travelerPricings[0].fareDetailsBySegment || [{}];
      const includedCheckedBags = fareDetails[0].includedCheckedBags || { weight: 15, weightUnit: "KG" };
      const includedCabinBags = fareDetails[0].includedCabinBags || { weight: 7, weightUnit: "KG" };

      const seatMap = Array.from({ length: 20 }, (_, rowIdx) => ({
        row: rowIdx + 1,
        seats: Array.from("ABCDEF").map((col) => ({
          seatNo: `${rowIdx + 1}${col}`,
          type: "Standard",
          status: ["5A", "10C", "15E"].includes(`${rowIdx + 1}${col}`) ? "reserved" : "available",
          fare: parseFloat(pricedOffer.price?.grandTotal) || 500,
        })),
      }));

      const transformedResponse = {
        departure: departureSegment.departure,
        arrival: arrivalSegment.arrival,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        duration: duration,
        stops: stops,
        aircraft: flight.itineraries[0].segments[0].aircraft.code || "AIRBUS JET",
        fare: parseFloat(pricedOffer.price?.grandTotal) || 0,
        class: pricedOffer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || "Economy",
        baggage: {
          checkIn: `${includedCheckedBags.weight}${includedCheckedBags.weightUnit || "kg"}`,
          cabin: `${includedCabinBags.weight}${includedCabinBags.weightUnit || "kg"}`,
        },
        passengers: passengers,
        seatMap: seatMap,
        pricedOffer: pricedOffer,
      };

      setTimeout(() => {
        navigate("/booking", {
          state: { bookingResponse: transformedResponse },
        });
      }, 100);
    } catch (error) {
      alert(`Failed to fetch price details. ${error.message}`);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1507521628349-6e9b9a9a1f1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        <div className="sticky top-0 z-[2000] bg-opacity-95 backdrop-blur-md">
          <HorizontalSearchForm initialData={searchFormData} onSearch={handleSearchUpdate} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/4 lg:sticky lg:top-32 lg:h-[calc(100vh-8rem)] z-[1500]">
            <FilterSection
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              flights={memoizedOriginalFlights}
              onFilterChange={filterFlights}
            />
            <button
              className="lg:hidden mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              {isFilterOpen ? "Close Filters" : "Open Filters"}
            </button>
          </div>

          <div className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-xl shadow-md">
              <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 drop-shadow-lg">MultiflyTravel</h1>
              <div className="flex flex-col sm:flex-row sm:space-x-4 text-gray-700 mt-2 sm:mt-0">
                <p className="text-sm sm:text-base drop-shadow-md">
                  {filteredFlights[0]?.itineraries[0]?.segments[0]?.departure.iataCode || "N/A"} -{" "}
                  {filteredFlights[0]?.itineraries[0]?.segments[
                    filteredFlights[0]?.itineraries[0]?.segments.length - 1
                  ]?.arrival.iataCode || "N/A"}
                </p>
                <p className="text-sm sm:text-base drop-shadow-md">
                  {filteredFlights[0]?.itineraries[0]?.segments[0]?.departure.at
                    ? new Date(filteredFlights[0].itineraries[0].segments[0].departure.at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })
                    : "N/A"}
                </p>
                <p className="text-sm sm:text-base drop-shadow-md">
                  {passengers.adults + passengers.children + passengers.infants} Passenger
                  {(passengers.adults + passengers.children + passengers.infants) !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto no-scroll space-y-4 pr-2">
              {filteredFlights.length > 0 ? (
                filteredFlights.map((flight, index) => {
                  const departureSegment = flight.itineraries[0].segments[0];
                  const arrivalSegment = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
                  const departureTime = departureSegment.departure.at
                    ? new Date(departureSegment.departure.at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : "N/A";
                  const arrivalTime = arrivalSegment.arrival.at
                    ? new Date(arrivalSegment.arrival.at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : "N/A";
                  const duration = flight.itineraries[0].duration ? formatDuration(flight.itineraries[0].duration) : "N/A";
                  const stops = calculateStops(flight.itineraries[0].segments);
                  const basePrice = flight.price?.grandTotal
                    ? parseFloat(flight.price.grandTotal)
                    : flight.price?.GrandTotal
                    ? parseFloat(flight.price.GrandTotal)
                    : 0;
                  const convertedPrice = convertPrice(basePrice).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });
                  const rewards = basePrice ? calculateRewards(basePrice) : 0;
                  const currencySymbol = selectedCountry ? selectedCountry.currency_symbol : "$";

                  return (
                    <div
                      key={index}
                      className="bg-white bg-opacity-95 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="flex space-x-2">
                          {flight.validatingAirlineCodes.map((code, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full shadow-md"
                            ></div>
                          ))}
                        </div>
                        <div className="text-sm text-gray-700 font-medium">
                          {flight.validatingAirlineCodes.map((code, idx) => (
                            <span key={idx}>
                              {code} {flight.itineraries[0].segments[idx]?.number || "N/A"}
                              {idx < flight.validatingAirlineCodes.length - 1 && " + "}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mt-2 sm:mt-0">
                        <div className="text-center">
                          <p className="text-lg sm:text-xl font-bold text-gray-800">{departureTime}</p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {departureSegment.departure.iataCode || "N/A"},{" "}
                            {departureSegment.departure.terminal
                              ? `T${departureSegment.departure.terminal}`
                              : "T N/A"}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 font-medium">{duration}</p>
                          <p className="text-xs text-gray-500">
                            {stops} stop{stops !== 1 ? "s" : ""}
                          </p>
                          <div className="flex items-center justify-center mt-1">
                            <div className="h-px w-6 sm:w-8 bg-gray-400"></div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <div className="h-px w-6 sm:w-8 bg-gray-400"></div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-lg sm:text-xl font-bold text-gray-800">{arrivalTime}</p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {arrivalSegment.arrival.iataCode || "N/A"},{" "}
                            {arrivalSegment.arrival.terminal ? `T${arrivalSegment.arrival.terminal}` : "T N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right mt-2 sm:mt-0">
                        <p className="text-xs sm:text-sm text-green-600 font-semibold">FILLING FAST</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-800">
                          {currencySymbol}
                          {convertedPrice}
                        </p>
                        <p className="text-xs sm:text-sm text-indigo-600">
                          + Earn {rewards.toLocaleString("en-US")} Multifly Points
                        </p>
                        <button
                          className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 w-full sm:w-auto"
                          onClick={() => handleBookNow(flight, index)}
                          disabled={loadingStates[index]}
                        >
                          {loadingStates[index] ? "Processing..." : "Book Now"}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-black text-lg sm:text-xl drop-shadow-md text-center py-6">
                  No flights found with the applied filters.
                </p>
              )}
            </div>

            <div className="flex justify-center mt-6">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 sm:py-3 sm:px-8 rounded-full shadow-md hover:shadow-lg transition duration-300"
                onClick={() => navigate("/")}
              >
                Back to Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;