
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import InputField from "../components/InputField";
// import TabButton from "../components/TabButton";
// import TripTypeButton from "../components/TripTypeButton";
// import AirportInput from "../components/AirportInput";
// import PassengerDropdown from "../section/PassengerDropdown";
// import { User, Briefcase } from "lucide-react";
// import Button from "../components/Button";

// const SearchForm = () => {
//   const [tripType, setTripType] = useState("one-way");
//   const [departure, setDeparture] = useState("");
//   const [destination, setDestination] = useState("");
//   const [departureDate, setDepartureDate] = useState("");
//   const [returnDate, setReturnDate] = useState("");
//   const [isSeatDropdownOpen, setSeatDropdownOpen] = useState(false);
//   const [selectedSeat, setSelectedSeat] = useState("Economy");
//   const [error, setError] = useState("");
//   const [totalPassengers, setTotalPassengers] = useState(1);
//   const [loading, setLoading] = useState(false); // Added loading state
//   const navigate = useNavigate();

//   const handlePassengerChange = (newTotal) => {
//     setTotalPassengers(newTotal); // Update state when passenger count changes
//   };

//   const handleSearch = async () => {
//     if (!departure || !destination || !departureDate) {
//       setError("Please fill all fields");
//       return;
//     }

//     try {
//       setError("");
//       setLoading(true); // Set loading to true when search starts
//       const response = await axios.get(
//         "http://localhost:3000/api/flights/search",
//         {
//           params: {
//             origin: departure.toUpperCase(),
//             destination: destination.toUpperCase(),
//             date: departureDate,
//           },
//         }
//       );

//       navigate("/results", {
//         state: {
//           flights: response.data.flights,
//           passengers: totalPassengers,
//           departure,
//           destination,
//           departureDate,
//           returnDate,
//           selectedSeat, // Adding seat class if you want to use it later
//         },
//       });
//     } catch (err) {
//       if (err.response?.status === 401) {
//         setError("Your session has expired. Please log in again.");
//         localStorage.removeItem("sessionToken"); // Clear the invalid token
//         setTimeout(() => {
//           navigate("/login");
//         }, 2000);
//       } else {
//         setError("Failed to fetch flights. Please try again.");
//       }
//       console.error("Error fetching flights:", err);
//     } finally {
//       setLoading(false); // Revert loading to false when search completes
//     }
//   };

//   return (
//     <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-full sm:max-w-lg mx-auto">
//       <div className="flex flex-wrap gap-2 sm:gap-4 text-gray-300 mb-4">
//         <TabButton title="Flight" active />
//         <TabButton title="Hotel" />
//         <TabButton title="Car Rental" />
//         <TabButton title="Things To Do" />
//       </div>

//       <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
//         <TripTypeButton
//           title="One-way"
//           active={tripType === "one-way"}
//           onClick={() => setTripType("one-way")}
//         />
//         <TripTypeButton
//           title="Round Trip"
//           active={tripType === "round-trip"}
//           onClick={() => setTripType("round-trip")}
//         />
//         <TripTypeButton
//           title="Multi-city"
//           active={tripType === "multi-city"}
//           onClick={() => setTripType("multi-city")}
//         />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <AirportInput label="From" value={departure} setValue={setDeparture} />
//         <AirportInput
//           label="To"
//           value={destination}
//           setValue={setDestination}
//         />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//         <div>
//           <label className="block text-white mb-1">Departure Date</label>
//           <input
//             type="date"
//             value={departureDate}
//             onChange={(e) => setDepartureDate(e.target.value)}
//             className="w-full p-3 rounded-lg bg-gray-700 text-white"
//           />
//         </div>
//         <div>
//           <label className="block text-white mb-1">Return Date</label>
//           <input
//             type="date"
//             value={returnDate}
//             onChange={(e) => setReturnDate(e.target.value)}
//             className="w-full p-3 rounded-lg bg-gray-700 text-white"
//             disabled={tripType === "one-way"}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//         <PassengerDropdown onPassengerChange={handlePassengerChange} />

//         <div className="relative">
//           <label className="block text-white mb-1">Seat Class</label>
//           <button
//             className="flex items-center w-full p-3 rounded-lg bg-gray-700 text-white text-left"
//             onClick={() => setSeatDropdownOpen(!isSeatDropdownOpen)}
//           >
//             <Briefcase className="w-5 h-5 mr-2" />
//             {selectedSeat}
//           </button>

//           {isSeatDropdownOpen && (
//             <div className="absolute mt-2 bg-gray-800 p-4 rounded-lg shadow-lg w-full z-10">
//               {["Economy", "Business", "First Class"].map((seat) => (
//                 <button
//                   key={seat}
//                   className={`w-full p-2 text-white text-left hover:bg-gray-700 rounded ${
//                     selectedSeat === seat ? "bg-gray-700" : ""
//                   }`}
//                   onClick={() => {
//                     setSelectedSeat(seat);
//                     setSeatDropdownOpen(false);
//                   }}
//                 >
//                   {seat}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

//       <Button
//         className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full text-base sm:text-lg font-medium"
//         onClick={handleSearch}
//       >
//         <span>{loading ? "Searching..." : "Search"}</span>
//       </Button>
//     </div>
//   );
// };

// export default SearchForm;

// ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

import React, { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import TabButton from "../components/TabButton";
import TripTypeButton from "../components/TripTypeButton";
import AirportInput from "../components/AirportInput";
import PassengerDropdown from "../section/PassengerDropdown";
import { User, Briefcase } from "lucide-react";
import Button from "../components/Button";

const SearchForm = () => {
  const [tripType, setTripType] = useState("one-way");
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [selectedSeat, setSelectedSeat] = useState("Economy");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isSeatDropdownOpen, setSeatDropdownOpen] = useState(false);

  const handlePassengerChange = (newPassengers) => {
    setPassengers(newPassengers);
  };

  const handleSearch = useCallback(async () => {
    if (!departure || !destination || !departureDate) {
      setError("Please fill all fields");
      return;
    }
    if (tripType === "round-trip" && (!returnDate || new Date(returnDate) <= new Date(departureDate))) {
      setError("Return date must be after departure date");
      return;
    }

    setLoading(true);
    try {
      setError("");
      const response = await axios.get("http://localhost:3000/api/flights/search", {
        params: {
          origin: departure.toUpperCase(),
          destination: destination.toUpperCase(),
          date: departureDate,
        },
      });
      navigate("/results", {
        state: {
          flights: response.data.flights,
          passengers,
          departure,
          destination,
          departureDate,
          returnDate,
          selectedSeat,
        },
      });
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        localStorage.removeItem("sessionToken");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to fetch flights. Please try again.");
      }
      console.error("Error fetching flights:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setError(""), 5000);
    }
  }, [departure, destination, departureDate, returnDate, tripType, passengers, selectedSeat, navigate]);

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-full sm:max-w-lg mx-auto">
      <div className="flex flex-wrap gap-2 sm:gap-4 text-gray-300 mb-4">
        <TabButton title="Flight" active />
        <TabButton title="Hotel" />
        <TabButton title="Car Rental" />
        <TabButton title="Things To Do" />
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        <TripTypeButton title="One-way" active={tripType === "one-way"} onClick={() => setTripType("one-way")} />
        <TripTypeButton title="Round Trip" active={tripType === "round-trip"} onClick={() => setTripType("round-trip")} />
        <TripTypeButton title="Multi-city" active={tripType === "multi-city"} onClick={() => setTripType("multi-city")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AirportInput label="From" value={departure} setValue={setDeparture} />
        <AirportInput label="To" value={destination} setValue={setDestination} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-white mb-1">Departure Date</label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-1">Return Date</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
            disabled={tripType === "one-way"}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <PassengerDropdown initialPassengers={passengers} onPassengerChange={handlePassengerChange} />

        <div className="relative">
          <label className="block text-white mb-1">Seat Class</label>
          <button
            className="flex items-center w-full p-3 rounded-lg bg-gray-700 text-white text-left"
            onClick={() => setSeatDropdownOpen(!isSeatDropdownOpen)}
          >
            <Briefcase className="w-5 h-5 mr-2" />
            {selectedSeat}
          </button>

          {isSeatDropdownOpen && (
            <div className="absolute mt-2 bg-gray-800 p-4 rounded-lg shadow-lg w-full z-10">
              {["Economy", "Business", "First Class"].map((seat) => (
                <button
                  key={seat}
                  className={`w-full p-2 text-white text-left hover:bg-gray-700 rounded ${selectedSeat === seat ? "bg-gray-700" : ""}`}
                  onClick={() => {
                    setSelectedSeat(seat);
                    setSeatDropdownOpen(false);
                  }}
                >
                  {seat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      <Button
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full text-base sm:text-lg font-medium"
        onClick={handleSearch}
      >
        <span>{loading ? "Searching..." : "Search"}</span>
      </Button>
    </div>
  );
};

export default SearchForm;