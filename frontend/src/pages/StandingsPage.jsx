import React, { useEffect, useState } from "react";
import axios from "axios";

const StandingsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const res = await axios.get("http://localhost:5000/api/tournaments");
    setTournaments(res.data);
  };

  const fetchStandings = async (tournamentId) => {
    const res = await axios.get(
      `http://localhost:5000/api/standings/${tournamentId}`
    );
    setStandings(res.data);
  };

  const handleTournamentChange = (e) => {
    const id = e.target.value;
    setSelectedTournament(id);
    if (id) fetchStandings(id);
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-black">
        Tabla de Posiciones
      </h1>

      {/* Selección de torneo */}
      <select
        value={selectedTournament}
        onChange={handleTournamentChange}
        className="w-full max-w-md p-2 mb-6 border rounded text-black"
      >
        <option value="">Seleccionar torneo</option>
        {tournaments.map((t) => (
          <option key={t._id} value={t._id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* Tabla */}
      {standings.length > 0 ? (
        <div className="overflow-x-auto w-full max-w-5xl">
          <table className="min-w-full bg-white border text-black text-sm">
            <thead>
              <tr className="bg-gray-200 text-center">
                <th className="p-2 border w-10">#</th>
                <th className="p-2 border w-40">Equipo</th>
                <th className="p-2 border w-12">PJ</th>
                <th className="p-2 border w-12">G</th>
                <th className="p-2 border w-12">E</th>
                <th className="p-2 border w-12">P</th>
                <th className="p-2 border w-12">GF</th>
                <th className="p-2 border w-12">GC</th>
                <th className="p-2 border w-12">DG</th>
                <th className="p-2 border w-12">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s, index) => {
                const isLeader = index === 0;
                const isLast = index === standings.length - 1;

                return (
                  <tr
                    key={s.teamId}
                    className={`text-center ${
                      isLeader
                        ? "bg-green-100 font-bold"
                        : isLast
                        ? "bg-red-100 font-bold"
                        : ""
                    }`}
                  >
                    <td className="p-2 border">{index + 1}</td>

                    {/* Escudo + nombre alineados a la izquierda */}
                    <td className="p-2 border">
                      <div className="flex items-center justify-start gap-2">
                        {s.logo && (
                          <img
                            src={s.logo}
                            alt={s.team}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <span className="font-bold text-black">{s.team}</span>
                      </div>
                    </td>

                    <td className="p-2 border w-12">{s.played}</td>
                    <td className="p-2 border w-12">{s.wins}</td>
                    <td className="p-2 border w-12">{s.draws}</td>
                    <td className="p-2 border w-12">{s.losses}</td>
                    <td className="p-2 border w-12">{s.goalsFor}</td>
                    <td className="p-2 border w-12">{s.goalsAgainst}</td>
                    <td className="p-2 border w-12">{s.goalDiff}</td>
                    <td className="p-2 border w-12 font-bold">{s.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : selectedTournament ? (
        <p className="text-gray-600 mt-4">No hay datos disponibles.</p>
      ) : null}
    </div>
  );
};

export default StandingsPage;


