
import React from "react";
import Card1 from "../components/card1";
import { FaBolt, FaDollarSign, FaMapMarkerAlt } from "react-icons/fa";

const Services = () => {
  const offersData = [
    {
      icon: <FaBolt size={20} className="text-white" />,
      title: "Seamless Booking Experience",
      description: "With Multifly, booking your flights is effortless and convenient."
    },
    {
      icon: <FaDollarSign size={20} className="text-white" />,
      title: "Best Pricing and Deals",
      description: "Multifly is committed to offering you the best possible value for your travel budget."
    },
    {
      icon: <FaMapMarkerAlt size={20} className="text-white" />,
      title: "Personalized Travel Recommendations",
      description: "Multifly offers personalized travel recommendations tailored to your preferences."
    }
  ];

  return (
    <section className="bg-gray-100 py-10 px-4 lg:px-10 rounded-3xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full md:w-2/3 mx-auto justify-items-center">
          {offersData.map((offer, index) => (
            <Card1 key={index} {...offer} />
          ))}
        </div>
        <div className="text-center md:text-right md:w-1/3 mt-6 md:mt-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Our Services</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            We offer a large set of services for our customers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;