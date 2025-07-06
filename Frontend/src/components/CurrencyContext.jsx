

// /* eslint-disable no-unused-vars */
// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// // Create the Currency Context
// export const CurrencyContext = createContext();

// // Currency Provider Component
// export const CurrencyProvider = ({ children }) => {
//   const [countries, setCountries] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch countries on mount
//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const response = await axios.get('https://end-user.onrender.com/api/countries');
//         setCountries(response.data.countries);
//         // Set default country (optional)
//         setSelectedCountry(response.data.countries[0]);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch countries');
//         setLoading(false);
//       }
//     };
//     fetchCountries();
//   }, []);

//   // Function to update selected country
//   const updateSelectedCountry = (country) => {
//     setSelectedCountry(country);
//   };

//   return (
//     <CurrencyContext.Provider
//       value={{
//         countries,
//         selectedCountry,
//         updateSelectedCountry,
//         loading,
//         error,
//       }}
//     >
//       {children}
//     </CurrencyContext.Provider>
//   );
// };

// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// // Create the Currency Context
// export const CurrencyContext = createContext();

// // Currency Provider Component
// export const CurrencyProvider = ({ children }) => {
//   const [countries, setCountries] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch countries and load selected country from localStorage on mount
//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const response = await axios.get('https://end-user.onrender.com/api/countries');
//         setCountries(response.data.countries);
        
//         // Load selected country from localStorage
//         const savedCountry = localStorage.getItem('selectedCountry');
//         if (savedCountry) {
//           const parsedCountry = JSON.parse(savedCountry);
//           // Ensure the saved country exists in the fetched data
//           const matchedCountry = response.data.countries.find(
//             (c) => c.id === parsedCountry.id
//           );
//           if (matchedCountry) {
//             setSelectedCountry(matchedCountry);
//           } else {
//             setSelectedCountry(response.data.countries[0]); // Fallback to first country
//           }
//         } else {
//           setSelectedCountry(response.data.countries[0]); // Default to first country
//         }
        
//         setLoading(false);
//       // eslint-disable-next-line no-unused-vars
//       } catch (err) {
//         setError('Failed to fetch countries');
//         setLoading(false);
//       }
//     };
//     fetchCountries();
//   }, []);

//   // Save selected country to localStorage when it changes
//   useEffect(() => {
//     if (selectedCountry) {
//       localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
//     }
//   }, [selectedCountry]);

//   // Function to update selected country
//   const updateSelectedCountry = (country) => {
//     setSelectedCountry(country);
//   };

//   return (
//     <CurrencyContext.Provider
//       value={{
//         countries,
//         selectedCountry,
//         updateSelectedCountry,
//         loading,
//         error,
//       }}
//     >
//       {children}
//     </CurrencyContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the Currency Context
export const CurrencyContext = createContext();

// Currency Provider Component
export const CurrencyProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch countries and load selected country from localStorage on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://end-user.onrender.com/api/countries');
        setCountries(response.data.countries);
        
        // Load selected country from localStorage
        const savedCountry = localStorage.getItem('selectedCountry');
        if (savedCountry) {
          const parsedCountry = JSON.parse(savedCountry);
          // Ensure the saved country exists in the fetched data
          const matchedCountry = response.data.countries.find(
            (c) => c.id === parsedCountry.id
          );
          if (matchedCountry) {
            setSelectedCountry(matchedCountry);
          } else {
            setSelectedCountry(response.data.countries[0]); // Fallback to first country
          }
        } else {
          setSelectedCountry(null); // No default country until user selects
        }
        
        setLoading(false);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Failed to fetch countries');
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Save selected country to localStorage when it changes
  useEffect(() => {
    if (selectedCountry) {
      localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
    }
  }, [selectedCountry]);

  // Function to update selected country
  const updateSelectedCountry = (country) => {
    setSelectedCountry(country);
  };

  // Function to reset selected country
  const resetSelectedCountry = () => {
    setSelectedCountry(null);
  };

  return (
    <CurrencyContext.Provider
      value={{
        countries,
        selectedCountry,
        updateSelectedCountry,
        resetSelectedCountry,
        loading,
        error,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};