import React, { useEffect, useState } from "react";

// 🌍 API Render o Local
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TablePage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [standings, setStandings] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");

  const fetchJSON = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status} en ${url}`);
    return res.json();
  };

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const data = await fetchJSON(`${API_URL}/tournaments`);
        setTournaments(data);
      } catch (err) {
        console.error("Error cargando torneos:", err);
      }
    };
    loadTournaments();
  }, []);

  const loadStandings = async (tournamentId) => {
    try {
      const data = await fetchJSON(`${API_URL}/standings/${tournamentId}`);
      setStandings(data);
    } catch (err) {
      console.error("Error cargando tabla:", err);
    }
  };

  const handleTournamentChange = (e) => {
    const id = e.target.value;
    setSelectedTournament(id);
    if (id) {
      loadStandings(id);
    } else {
      setStandings([]);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 text-black">
      {/* Seleccionar Torneo */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-center mb-4">Seleccionar Torneo</h2>
        <select
          value={selectedTournament}
          onChange={handleTournamentChange}
          className="border p-2 rounded w-full text-black"
        >
          <option value="">-- Selecciona un torneo --</option>
          {tournaments.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de posiciones */}
      {standings.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6">
            📊 Tabla de Posiciones
          </h2>
          <table className="w-full border-collapse border text-black">
            <thead>
              <tr className="bg-gray-200 text-black text-center">
                <th className="p-2">Equipo</th>
                <th className="p-2">PJ</th>
                <th className="p-2">G</th>
                <th className="p-2">E</th>
                <th className="p-2">P</th>
                <th className="p-2">GF</th>
                <th className="p-2">GC</th>
                <th className="p-2">DG</th>
                <th className="p-2">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, i) => (
                <tr
                  key={team._id}
                  className={`text-center ${
                    i === 0
                      ? "bg-green-100"
                      : i >= standings.length - 2
                      ? "bg-red-100"
                      : ""
                  }`}
                >
                  <td className="flex items-center gap-2 p-2">
                    <img
                      src={team.logo || "/default-logo.png"}
                      alt={team.team}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{team.team}</span>
                  </td>
                  <td className="p-2">{team.played}</td>
                  <td className="p-2">{team.wins}</td>
                  <td className="p-2">{team.draws}</td>
                  <td className="p-2">{team.losses}</td>
                  <td className="p-2">{team.goalsFor}</td>
                  <td className="p-2">{team.goalsAgainst}</td>
                  <td className="p-2">{team.goalDiff}</td>
                  <td className="p-2 font-bold">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TablePage;
