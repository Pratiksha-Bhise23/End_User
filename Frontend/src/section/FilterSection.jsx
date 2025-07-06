
// import React, { useState, useEffect, useCallback } from "react";
// import { debounce } from "lodash"; // Install lodash: npm install lodash

// const FilterSection = ({ isOpen, onClose, flights, onFilterChange }) => {
//   const [priceRange, setPriceRange] = useState(25000);
//   const [stops, setStops] = useState({ nonStop: false, oneStop: false, twoPlusStops: false });
//   const [airlines, setAirlines] = useState({});
//   const [departureTimes, setDepartureTimes] = useState({
//     morning: false,
//     afternoon: false,
//     evening: false,
//     night: false, // Added night
//   });
//   const [arrivalTimes, setArrivalTimes] = useState({
//     morning: false,
//     afternoon: false,
//     evening: false,
//     night: false, // Added night
//   });

//   // Initialize airlines based on flights
//   useEffect(() => {
//     const uniqueAirlines = [...new Set(flights.flatMap((flight) => flight.validatingAirlineCodes))];
//     const initialAirlines = uniqueAirlines.reduce((acc, code) => ({ ...acc, [code]: false }), {});
//     setAirlines(initialAirlines);
//   }, [flights]);

//   // Debounced filter change to prevent rapid updates
//   const debouncedFilterChange = useCallback(
//     debounce((criteria) => {
//       onFilterChange(criteria);
//     }, 300),
//     [onFilterChange]
//   );

//   // Apply filters when criteria change
//   useEffect(() => {
//     const filterCriteria = {
//       priceRange,
//       stops: Object.keys(stops).filter((key) => stops[key]),
//       airlines: Object.keys(airlines).filter((key) => airlines[key]),
//       departureTimes: Object.keys(departureTimes).filter((key) => departureTimes[key]),
//       arrivalTimes: Object.keys(arrivalTimes).filter((key) => arrivalTimes[key]),
//     };
//     debouncedFilterChange(filterCriteria);
//   }, [priceRange, stops, airlines, departureTimes, arrivalTimes, debouncedFilterChange]);

//   const handleStopsChange = (key) => {
//     setStops((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const handleAirlinesChange = (code) => {
//     setAirlines((prev) => ({ ...prev, [code]: !prev[code] }));
//   };

//   const handleDepartureTimeChange = (key) => {
//     setDepartureTimes((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const handleArrivalTimeChange = (key) => {
//     setArrivalTimes((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   return (
//     <div
//       className={`${
//         isOpen ? "block" : "hidden"
//       } lg:block w-full lg:w-auto bg-white bg-opacity-95 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 fixed lg:sticky top-0 left-0 h-full lg:h-fit max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] overflow-y-auto z-[1500] transition-all duration-300`}
//     >
//       <div className="flex justify-between items-center mb-4 sm:mb-6">
//         <h2 className="text-base sm:text-lg lg:text-xl font-bold text-indigo-800">Filters</h2>
//         <button className="lg:hidden text-gray-600 hover:text-gray-800 text-lg sm:text-xl" onClick={onClose}>
//           ✕
//         </button>
//       </div>

//       {/* Price Range Filter */}
//       <div className="mb-4 sm:mb-6">
//         <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Price Range</h3>
//         <input
//           type="range"
//           min="0"
//           max="50000"
//           step="10"
//           value={priceRange}
//           onChange={(e) => setPriceRange(Number(e.target.value))}
//           className="w-full accent-indigo-600 h-2 sm:h-3"
//         />
//         <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
//           <span>₹0</span>
//           <span>₹{priceRange.toLocaleString("en-US")}</span>
//         </div>
//       </div>

//       {/* Stops Filter */}
//       <div className="mb-4 sm:mb-6">
//         <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Stops</h3>
//         {["nonStop", "oneStop", "twoPlusStops"].map((key) => (
//           <label key={key} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={stops[key]}
//               onChange={() => handleStopsChange(key)}
//               className="mr-2 accent-indigo-600 h-3.5 w-3.5 sm:h-4 sm:w-4"
//             />
//             <span className="text-xs sm:text-sm text-gray-600">
//               {key === "nonStop" ? "Non-stop" : key === "oneStop" ? "1 Stop" : "2+ Stops"}
//             </span>
//           </label>
//         ))}
//       </div>

//       {/* Airlines Filter */}
//       <div className="mb-4 sm:mb-6">
//         <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Airlines</h3>
//         {Object.keys(airlines).map((code) => (
//           <label key={code} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={airlines[code]}
//               onChange={() => handleAirlinesChange(code)}
//               className="mr-2 accent-indigo-600 h-3.5 w-3.5 sm:h-4 sm:w-4"
//             />
//             <span className="text-xs sm:text-sm text-gray-600">{code}</span>
//           </label>
//         ))}
//       </div>

//       {/* Departure Time Filter */}
//       <div className="mb-4 sm:mb-6">
//         <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Departure Time</h3>
//         {["morning", "afternoon", "evening", "night"].map((key) => (
//           <label key={key} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={departureTimes[key]}
//               onChange={() => handleDepartureTimeChange(key)}
//               className="mr-2 accent-indigo-600 h-3.5 w-3.5 sm:h-4 sm:w-4"
//             />
//             <span className="text-xs sm:text-sm text-gray-600">
//               {key.charAt(0).toUpperCase() + key.slice(1)} (
//               {key === "morning"
//                 ? "06:00 - 12:00"
//                 : key === "afternoon"
//                 ? "12:00 - 18:00"
//                 : key === "evening"
//                 ? "18:00 - 00:00"
//                 : "00:00 - 06:00"}
//               )
//             </span>
//           </label>
//         ))}
//       </div>

//       {/* Arrival Time Filter */}
//       <div>
//         <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Arrival Time</h3>
//         {["morning", "afternoon", "evening", "night"].map((key) => (
//           <label key={key} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={arrivalTimes[key]}
//               onChange={() => handleArrivalTimeChange(key)}
//               className="mr-2 accent-indigo-600 h-3.5 w-3.5 sm:h-4 sm:w-4"
//             />
//             <span className="text-xs sm:text-sm text-gray-600">
//               {key.charAt(0).toUpperCase() + key.slice(1)} (
//               {key === "morning"
//                 ? "06:00 - 12:00"
//                 : key === "afternoon"
//                 ? "12:00 - 18:00"
//                 : key === "evening"
//                 ? "18:00 - 00:00"
//                 : "00:00 - 06:00"}
//               )
//             </span>
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FilterSection;
import React, { useState, useEffect, useCallback, useContext } from "react";
import { debounce } from "lodash";
import { CurrencyContext } from "../components/CurrencyContext"; // Adjust the import path as necessary

const FilterSection = ({ isOpen, onClose, flights, onFilterChange }) => {
  const { selectedCountry } = useContext(CurrencyContext);
  const [priceRange, setPriceRange] = useState(25000);
  const [stops, setStops] = useState({ nonStop: false, oneStop: false, twoPlusStops: false });
  const [airlines, setAirlines] = useState({});
  const [departureTimes, setDepartureTimes] = useState({
    morning: false,
    afternoon: false,
    evening: false,
    night: false,
  });
  const [arrivalTimes, setArrivalTimes] = useState({
    morning: false,
    afternoon: false,
    evening: false,
    night: false,
  });

  useEffect(() => {
    const uniqueAirlines = [...new Set(flights.flatMap((flight) => flight.validatingAirlineCodes))];
    const initialAirlines = uniqueAirlines.reduce((acc, code) => ({ ...acc, [code]: false }), {});
    setAirlines(initialAirlines);
  }, [flights]);

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

  const debouncedFilterChange = useCallback(
    debounce((criteria) => {
      onFilterChange(criteria);
    }, 300),
    [onFilterChange]
  );

  useEffect(() => {
    const filterCriteria = {
      priceRange,
      stops: Object.keys(stops).filter((key) => stops[key]),
      airlines: Object.keys(airlines).filter((key) => airlines[key]),
      departureTimes: Object.keys(departureTimes).filter((key) => departureTimes[key]),
      arrivalTimes: Object.keys(arrivalTimes).filter((key) => arrivalTimes[key]),
    };
    debouncedFilterChange(filterCriteria);
  }, [priceRange, stops, airlines, departureTimes, arrivalTimes, debouncedFilterChange]);

  const handleStopsChange = (key) => {
    setStops((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAirlinesChange = (code) => {
    setAirlines((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const handleDepartureTimeChange = (key) => {
    setDepartureTimes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleArrivalTimeChange = (key) => {
    setArrivalTimes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currencySymbol = selectedCountry ? selectedCountry.currency_symbol : "$";

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } lg:block w-full bg-white bg-opacity-95 backdrop-blur-md p-3 sm:p-4 rounded-xl shadow-lg border border-gray-200 fixed top-0 left-0 h-full max-h-screen overflow-y-auto z-[1500] transition-all duration-300 lg:w-auto lg:sticky lg:top-24 lg:h-fit lg:max-h-[calc(100vh-6rem)]`}
    >
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
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold text-indigo-800">Filters</h2>
        <button
          className="lg:hidden text-gray-600 hover:text-gray-800 text-lg p-1 sm:p-2"
          onClick={onClose}
          aria-label="Close filters"
        >
          ✕
        </button>
      </div>

      {/* Price Range Filter */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Price Range</h3>
        <input
          type="range"
          min="0"
          max="50000"
          step="10"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-indigo-600 h-2 sm:h-3 touch-none"
        />
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
          <span>
            {currencySymbol}
            {convertPrice(0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span>
            {currencySymbol}
            {convertPrice(priceRange).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Stops Filter */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Stops</h3>
        {["nonStop", "oneStop", "twoPlusStops"].map((key) => (
          <label key={key} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={stops[key]}
              onChange={() => handleStopsChange(key)}
              className="mr-2 accent-indigo-600 h-4 w-4 sm:h-5 sm:w-5"
            />
            <span className="text-xs sm:text-sm text-gray-600">
              {key === "nonStop" ? "Non-stop" : key === "oneStop" ? "1 Stop" : "2+ Stops"}
            </span>
          </label>
        ))}
      </div>

      {/* Airlines Filter */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Airlines</h3>
        {Object.keys(airlines).map((code) => (
          <label key={code} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={airlines[code]}
              onChange={() => handleAirlinesChange(code)}
              className="mr-2 accent-indigo-600 h-4 w-4 sm:h-5 sm:w-5"
            />
            <span className="text-xs sm:text-sm text-gray-600">{code}</span>
          </label>
        ))}
      </div>

      {/* Departure Time Filter */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Departure Time</h3>
        {["morning", "afternoon", "evening", "night"].map((key) => (
          <label key={key} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={departureTimes[key]}
              onChange={() => handleDepartureTimeChange(key)}
              className="mr-2 accent-indigo-600 h-4 w-4 sm:h-5 sm:w-5"
            />
            <span className="text-xs sm:text-sm text-gray-600">
              {key.charAt(0).toUpperCase() + key.slice(1)} (
              {key === "morning"
                ? "06:00 - 12:00"
                : key === "afternoon"
                ? "12:00 - 18:00"
                : key === "evening"
                ? "18:00 - 00:00"
                : "00:00 - 06:00"}
              )
            </span>
          </label>
        ))}
      </div>

      {/* Arrival Time Filter */}
      <div>
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Arrival Time</h3>
        {["morning", "afternoon", "evening", "night"].map((key) => (
          <label key={key} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={arrivalTimes[key]}
              onChange={() => handleArrivalTimeChange(key)}
              className="mr-2 accent-indigo-600 h-4 w-4 sm:h-5 sm:w-5"
            />
            <span className="text-xs sm:text-sm text-gray-600">
              {key.charAt(0).toUpperCase() + key.slice(1)} (
              {key === "morning"
                ? "06:00 - 12:00"
                : key === "afternoon"
                ? "12:00 - 18:00"
                : key === "evening"
                ? "18:00 - 00:00"
                : "00:00 - 06:00"}
              )
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;