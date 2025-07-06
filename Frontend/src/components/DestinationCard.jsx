import React from "react";

const DestinationCard = ({ image, title, destinations, className }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-lg group ${className}`}>
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white text-lg font-semibold">{title}</h3>
        <p className="text-gray-300 text-sm">{destinations} Destinations</p>
      </div>
    </div>
  );
};

export default DestinationCard;
