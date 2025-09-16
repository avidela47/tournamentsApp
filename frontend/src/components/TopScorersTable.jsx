import React from "react";

/**
 * scorers: [
 *   { playerId, name, photo, teamName, teamLogo, goals }
 * ]
 */
const TopScorersTable = ({ scorers }) => {
  return (
    <div className="w-full">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-800 text-white text-center">
            <th className="p-2 border border-gray-300 w-[40%]">Jugador</th>
            <th className="p-2 border border-gray-300 w-[40%]">Equipo</th>
            <th className="p-2 border border-gray-300 w-[20%]">Goles</th>
          </tr>
        </thead>
        <tbody>
          {scorers.map((s, index) => (
            <tr
              key={s.playerId}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} text-center`}
            >
              {/* Jugador */}
              <td className="p-2 border border-gray-300">
                <div className="flex items-center gap-2 justify-start">
                  {s.photo && (
                    <img
                      src={s.photo}
                      alt={s.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <span className="text-black">{s.name}</span>
                </div>
              </td>

              {/* Equipo */}
              <td className="p-2 border border-gray-300">
                <div className="flex items-center gap-2 justify-start">
                  {s.teamLogo && (
                    <img
                      src={s.teamLogo}
                      alt={s.teamName}
                      className="w-6 h-6 object-cover"
                    />
                  )}
                  <span className="text-black">{s.teamName}</span>
                </div>
              </td>

              {/* Goles */}
              <td className="p-2 border border-gray-300 font-bold text-green-600">
                {s.goals}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopScorersTable;
