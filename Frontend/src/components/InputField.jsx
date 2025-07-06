
import React from "react";

const InputField = ({ label, placeholder, icon }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-400">{label}</label>
      <div className="flex items-center bg-gray-700 p-3 rounded-lg mt-1">
        <span className="mr-2">{icon}</span>
        <input type="text" placeholder={placeholder} className="bg-transparent outline-none text-white w-full" />
      </div>
    </div>
  );
};

export default InputField;
