import React from "react";

const StandingsTable = ({ standings }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full border border-gray-300 text-black text-sm sm:text-base">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-2 sm:px-4 py-2 border">Equipo</th>
            <th className="px-2 sm:px-4 py-2 border">PJ</th>
            <th className="px-2 sm:px-4 py-2 border">PG</th>
            <th className="px-2 sm:px-4 py-2 border">PE</th>
            <th className="px-2 sm:px-4 py-2 border">PP</th>
            <th className="px-2 sm:px-4 py-2 border">GF</th>
            <th className="px-2 sm:px-4 py-2 border">GC</th>
            <th className="px-2 sm:px-4 py-2 border">DG</th>
            <th className="px-2 sm:px-4 py-2 border">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.length > 0 ? (
            standings.map((row, index) => (
              <tr key={index} className="text-center">
                <td className="px-2 sm:px-4 py-2 border">{row.team}</td>
                <td className="px-2 sm:px-4 py-2 border">{row.played}</td>
                <td className="px-2 sm:px-4 py-2 border">{row.wins}</td>
                <td className="px-2 sm:px-4 py-2 border">{row.draws}</td>
                <td className="px-2 sm:px-4 py-2 border">{row.losses}</td>
                <td className="px-2 sm:px-4 py-2 border">{row.goalsFor}</td>
                <td className="px-2 sm:px-4 py-2 border">{row.goalsAgainst}</td>
                <td className="px-2 sm:px-4 py-2 border">{row.goalDiff}</td>
                <td className="px-2 sm:px-4 py-2 border font-bold">{row.points}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="9"
                className="px-4 py-2 border text-center text-gray-500"
              >
                No hay datos de posiciones
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsTable;

