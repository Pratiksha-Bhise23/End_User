

import React from "react";
import { Star, MapPin } from "lucide-react";

const Card = ({ name, location, rating, price, image }) => {
  return (
    <div className="bg-gray-100 rounded-3xl shadow-md p-3 w-78 h-66 sm:h-72 overflow-hidden">
      <img
        src={image}
        alt={name}
        className="rounded-3xl w-full h-40 sm:h-44 object-cover"
      />
      <div className="mt-2">
        <h3 className="text-sm sm:text-base font-semibold text-center truncate">
          {name}
        </h3>

        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center text-sm text-yellow-500">
            <Star size={14} fill="currentColor" className="mr-1" />
            <span>{rating}</span>
          </div>
          <span className="text-gray-500 font-normal text-xs">Start from</span>
        </div>

        
        <div className="flex justify-between items-center text-gray-500 text-xs sm:text-sm mt-1">
          <div className="flex items-center whitespace-nowrap overflow-hidden">
            <MapPin size={14} className="mr-1 text-gray-400" />
            <span className="truncate">{location}</span>
          </div>
          <div className="text-blue-600 text-xl font-semibold">{price}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
