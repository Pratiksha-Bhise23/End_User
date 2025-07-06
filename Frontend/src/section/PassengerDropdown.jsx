// // PassengerDropdown.jsx
// import React, { useState } from "react";
// import { User } from "lucide-react";

// const PassengerDropdown = ({ onPassengerChange }) => {
//   const [passengers, setPassengers] = useState({
//     adults: 1,
//     children: 0,
//     infants: 0,
//   });
//   const [isOpen, setIsOpen] = useState(false);
//   const totalPassengers = passengers.adults + passengers.children + passengers.infants;

//   const handleIncrement = (type) => {
//     if (totalPassengers < 9) {
//       setPassengers((prev) => {
//         const newPassengers = { ...prev, [type]: prev[type] + 1 };
//         const newTotal = newPassengers.adults + newPassengers.children + newPassengers.infants;
//         if (onPassengerChange) onPassengerChange(newTotal);
//         return newPassengers;
//       });
//     }
//   };

//   const handleDecrement = (type) => {
//     if (passengers[type] > 0) {
//       setPassengers((prev) => {
//         const newPassengers = { ...prev, [type]: prev[type] - 1 };
//         const newTotal = newPassengers.adults + newPassengers.children + newPassengers.infants;
//         if (onPassengerChange) onPassengerChange(newTotal);
//         return newPassengers;
//       });
//     }
//   };

//   return (
//     <div className="relative">
//       <label className="block text-sm font-medium text-white mb-1">Passengers</label>
//       <button
//         className="flex items-center w-full p-3 rounded-lg bg-gray-700 text-white text-left shadow-sm hover:bg-gray-600 transition-colors duration-200"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <User className="w-5 h-5 mr-2" />
//         {totalPassengers} Passenger{totalPassengers > 1 ? "s" : ""}
//       </button>

//       {isOpen && (
//         <div className="absolute left-0 top-full mt-2 bg-gray-800 p-4 rounded-lg shadow-lg w-full z-[3000]">
//           <DropdownItem
//             title="Adults (12-59 years)"
//             type="adults"
//             passengers={passengers}
//             onIncrement={handleIncrement}
//             onDecrement={handleDecrement}
//           />
//           <DropdownItem
//             title="Children (2-12 years)"
//             type="children"
//             passengers={passengers}
//             onIncrement={handleIncrement}
//             onDecrement={handleDecrement}
//           />
//           <DropdownItem
//             title="Infants (3 days - 2 years)"
//             type="infants"
//             passengers={passengers}
//             onIncrement={handleIncrement}
//             onDecrement={handleDecrement}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// const DropdownItem = ({ title, type, passengers, onIncrement, onDecrement }) => (
//   <div className="flex justify-between items-center text-white mb-2">
//     <span>{title}</span>
//     <div className="flex items-center space-x-2">
//       <button className="bg-gray-600 px-2 py-1 rounded hover:bg-gray-500 transition-colors duration-150" onClick={() => onDecrement(type)}>
//         -
//       </button>
//       <span>{passengers[type]}</span>
//       <button className="bg-gray-600 px-2 py-1 rounded hover:bg-gray-500 transition-colors duration-150" onClick={() => onIncrement(type)}>
//         +
//       </button>
//     </div>
//   </div>
// );

// export default PassengerDropdown;

// ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
import React, { useState } from "react";
import { User } from "lucide-react";

const PassengerDropdown = ({ initialPassengers = { adults: 1, children: 0, infants: 0 }, onPassengerChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const totalPassengers = initialPassengers.adults + initialPassengers.children + initialPassengers.infants;

  const handleIncrement = (type) => {
    if (totalPassengers < 9) {
      const newPassengers = { ...initialPassengers, [type]: initialPassengers[type] + 1 };
      if (newPassengers.adults >= newPassengers.infants) {
        onPassengerChange?.(newPassengers);
      }
    }
  };

  const handleDecrement = (type) => {
    if (initialPassengers[type] > 0) {
      const newPassengers = { ...initialPassengers, [type]: initialPassengers[type] - 1 };
      onPassengerChange?.(newPassengers);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-white mb-1">Passengers</label>
      <button
        className="flex items-center w-full p-3 rounded-lg bg-gray-700 text-white text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle passenger selection"
      >
        <User className="w-5 h-5 mr-2" />
        {totalPassengers} Passenger{totalPassengers > 1 ? "s" : ""}
      </button>

      {isOpen && (
        <div className="absolute mt-2 bg-gray-800 p-4 rounded-lg shadow-lg w-full z-10">
          {["adults", "children", "infants"].map((type) => (
            <div key={type} className="flex justify-between items-center text-white mb-2">
              <span>
                {type.charAt(0).toUpperCase() + type.slice(1)} (
                {type === "adults" ? "12-59" : type === "children" ? "2-12" : "0-2"} years)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-gray-600 px-2 py-1 rounded hover:bg-gray-500 transition-colors duration-150"
                  onClick={() => handleDecrement(type)}
                  aria-label={`Decrease ${type}`}
                >
                  -
                </button>
                <span>{initialPassengers[type]}</span>
                <button
                  className="bg-gray-600 px-2 py-1 rounded hover:bg-gray-500 transition-colors duration-150"
                  onClick={() => handleIncrement(type)}
                  aria-label={`Increase ${type}`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PassengerDropdown;