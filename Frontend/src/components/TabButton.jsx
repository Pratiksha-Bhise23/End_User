
import React from "react";
import PropTypes from "prop-types";

const TabButton = ({ title, active, onClick }) => {
  return (
    <button
      className={`relative px-4 py-2 text-white transition-all duration-300 
        ${active ? "text-lg font-semibold underline underline-offset-8 decoration-blue-500" : "text-base text-gray-400"} 
        hover:text-white hover:underline hover:underline-offset-8 hover:decoration-gray-500`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

TabButton.propTypes = {
  title: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};

export default TabButton;

