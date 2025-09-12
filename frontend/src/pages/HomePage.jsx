import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const menuItems = [
    { path: "/teams", label: "Equipos", icon: "⚽", color: "bg-green-100" },
    { path: "/players", label: "Jugadores", icon: "👟", color: "bg-yellow-100" },
    { path: "/matches", label: "Partidos", icon: "🥅", color: "bg-blue-100" },
    { path: "/tournaments", label: "Torneos", icon: "🏆", color: "bg-purple-100" },
    { path: "/standings", label: "Posiciones", icon: "📊", color: "bg-orange-100" },
    { path: "/stats", label: "Estadísticas", icon: "📈", color: "bg-pink-100" },
  ];

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-black text-center">
        Bienvenido a <span className="text-blue-600">Tournaments App</span>
      </h1>
      <p className="text-lg mb-8 text-gray-700 text-center max-w-xl">
        Administra tus equipos, jugadores, partidos, torneos, posiciones y estadísticas.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full max-w-3xl">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`${item.color} shadow-md rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-xl transition transform hover:-translate-y-1`}
          >
            <span className="text-4xl sm:text-5xl mb-3">{item.icon}</span>
            <span className="text-sm sm:text-lg font-semibold text-black text-center">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;




