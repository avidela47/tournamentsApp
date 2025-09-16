import React from "react";

/**
 * Tabla limpia y ancha, SIN scroll.
 * - Card externa ya ajusta el ancho; acá sólo nos preocupamos por la tabla.
 * - Nombre + escudo alineados.
 * - Primer lugar en verde, últimos 2 en rojo claro.
 * - Tipografía negra en todo.
 */
const StandingsTable = ({ standings = [] }) => {
  return (
    <div className="w-full">
      <table className="w-full border-collapse text-sm md:text-base text-black">
        <thead>
          <tr className="bg-gray-200 font-bold text-center">
            <th className="p-3 border border-gray-300 text-left w-[36%]">
              Equipo
            </th>
            <th className="p-3 border border-gray-300 w-[8%]">PJ</th>
            <th className="p-3 border border-gray-300 w-[8%]">G</th>
            <th className="p-3 border border-gray-300 w-[8%]">E</th>
            <th className="p-3 border border-gray-300 w-[8%]">P</th>
            <th className="p-3 border border-gray-300 w-[8%]">GF</th>
            <th className="p-3 border border-gray-300 w-[8%]">GC</th>
            <th className="p-3 border border-gray-300 w-[8%]">DG</th>
            <th className="p-3 border border-gray-300 w-[8%]">Pts</th>
          </tr>
        </thead>

        <tbody>
          {standings.map((row, idx) => {
            const bg =
              idx === 0
                ? "bg-green-100"
                : idx >= standings.length - 2
                ? "bg-red-100"
                : idx % 2 === 0
                ? "bg-white"
                : "bg-gray-50";

            return (
              <tr key={row.teamId || row.team} className={`text-center ${bg}`}>
                {/* Equipo */}
                <td className="p-3 border border-gray-300 text-left">
                  <div className="flex items-center gap-3">
                    {row.logo ? (
                      <img
                        src={row.logo}
                        alt={row.team}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded" />
                    )}
                    <span className="font-semibold">{row.team}</span>
                  </div>
                </td>

                <td className="p-3 border border-gray-300">{row.played}</td>
                <td className="p-3 border border-gray-300">{row.wins}</td>
                <td className="p-3 border border-gray-300">{row.draws}</td>
                <td className="p-3 border border-gray-300">{row.losses}</td>
                <td className="p-3 border border-gray-300">{row.goalsFor}</td>
                <td className="p-3 border border-gray-300">{row.goalsAgainst}</td>
                <td className="p-3 border border-gray-300">{row.goalDiff}</td>
                <td className="p-3 border border-gray-300 font-bold text-blue-700">
                  {row.points}
                </td>
              </tr>
            );
          })}

          {standings.length === 0 && (
            <tr>
              <td
                colSpan={9}
                className="p-6 text-center text-gray-500 border border-gray-300"
              >
                No hay datos para este torneo.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsTable;







