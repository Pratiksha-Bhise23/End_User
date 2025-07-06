import React, { useContext, useState } from 'react';
import { CurrencyContext } from '../components/CurrencyContext';

const CountryPopup = ({ onClose }) => {
  const { countries, selectedCountry, updateSelectedCountry, loading, error } =
    useContext(CurrencyContext);
  const [selected, setSelected] = useState(selectedCountry?.name || '');

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    const country = countries.find((c) => c.name === countryName);
    setSelected(countryName);
    updateSelectedCountry(country);
  };

  const handleSubmit = () => {
    onClose(); // Close the popup
  };

  if (loading) return <div className="text-center text-white">Loading countries...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="fixed inset-0 bg-none bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Select Your Country</h2>
        <select
          value={selected}
          onChange={handleCountryChange}
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select a country
          </option>
          {countries.map((country) => (
            <option key={country.id} value={country.name}>
              {country.name} ({country.currency_code})
            </option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default CountryPopup;