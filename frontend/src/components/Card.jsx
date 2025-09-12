import React from "react";

const Card = ({ children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-black w-full max-w-sm mx-auto">
      {children}
    </div>
  );
};

export default Card;


