
import React from "react";

const Card1 = ({ title, icon, description }) => {
  return (
    <div className="bg-gray-900 rounded-3xl shadow-md p-4 w-full max-w-xs h-48 sm:h-56 overflow-hidden hover:scale-105 hover:shadow-lg transition-transform duration-300">
      <div className="flex items-center mb-4">
        <div className="bg-blue-600 p-2 rounded-full">{icon}</div>
      </div>
      <div className="mt-2">
        <h3 className="text-white text-sm sm:text-base font-semibold truncate mb-2">
          {title}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm line-clamp-3">{description}</p>
      </div>
    </div>
  );
};

export default Card1;