import React from "react";

const CardTabla = ({ title, children }) => {
  return (
    <div className="w-full flex justify-center px-2">
      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-6xl">
        {/* 📌 Título */}
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800 flex items-center justify-center gap-2">
          📊 {title}
        </h2>
        <div className="overflow-x-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CardTabla;


