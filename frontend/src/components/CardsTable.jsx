import React from "react";

/**
 * cards: [
 *   { playerId, name, photo, teamName, teamLogo, count }
 * ]
 */
const CardsTable = ({ cards, type }) => {
  return (
    <div className="w-full mb-6">
      <h2
        className={`text-xl font-bold mb-4 ${
          type === "yellow" ? "text-yellow-600" : "text-red-600"
        }`}
      >
        {type === "yellow" ? "Tarjetas Amarillas" : "Tarjetas Rojas"}
      </h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-800 text-white text-center">
            <th className="p-2 border border-gray-300 w-[40%]">Jugador</th>
            <th className="p-2 border border-gray-300 w-[40%]">Equipo</th>
            <th className="p-2 border border-gray-300 w-[20%]">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((c, index) => (
            <tr
              key={c.playerId}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} text-center`}
            >
              {/* Jugador */}
              <td className="p-2 border border-gray-300">
                <div className="flex items-center gap-2 justify-start">
                  {c.photo && (
                    <img
                      src={c.photo}
                      alt={c.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <span className="text-black">{c.name}</span>
                </div>
              </td>

              {/* Equipo */}
              <td className="p-2 border border-gray-300">
                <div className="flex items-center gap-2 justify-start">
                  {c.teamLogo && (
                    <img
                      src={c.teamLogo}
                      alt={c.teamName}
                      className="w-6 h-6 object-cover"
                    />
                  )}
                  <span className="text-black">{c.teamName}</span>
                </div>
              </td>

              {/* Cantidad */}
              <td
                className={`p-2 border border-gray-300 font-bold ${
                  type === "yellow" ? "text-yellow-600" : "text-red-600"
                }`}
              >
                {c.count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CardsTable;
