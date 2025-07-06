import React from "react";

const TripTypeButton = ({ title, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-full ${active ? "bg-white text-black font-semibold" : "text-white bg-gray-700"}`}>
      {title}
    </button>
  );
};

export default TripTypeButton;
