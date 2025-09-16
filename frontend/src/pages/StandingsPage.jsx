import React, { useState, useEffect } from "react";

const StandingsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [standings, setStandings] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");

  // 🌍 Detectar API (Render o Local)
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchJSON = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status} en ${url}`);
    return res.json();
  };

  useEffect(() => {
    const loadTournaments = async () => {
      const data = await fetchJSON(`${API_URL}/tournaments`);
      setTournaments(data);
    };
    loadTournaments();
  }, []);

  const loadStandings = async (tournamentId) => {
    const data = await fetchJSON(`${API_URL}/standings/${tournamentId}`);
    setStandings(data);
  };

  const loadPlayers = async (tournamentId) => {
    const data = await fetchJSON(`${API_URL}/players/tournament/${tournamentId}`);
    setPlayers(data);
  };

  const handleTournamentChange = (e) => {
    const id = e.target.value;
    setSelectedTournament(id);
    if (id) {
      loadStandings(id);
      loadPlayers(id);
    } else {
      setStandings([]);
      setPlayers([]);
    }
  };

  // ➤ Top 5 goleadores
  const topScorers = [...players]
    .filter((p) => p.goals && p.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5);

  // ➤ Amarillas
  const yellowCards = [...players]
    .filter((p) => p.yellowCards && p.yellowCards > 0)
    .sort((a, b) => b.yellowCards - a.yellowCards);

  // ➤ Rojas
  const redCards = [...players]
    .filter((p) => p.redCards && p.redCards > 0)
    .sort((a, b) => b.redCards - a.redCards);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 text-black">
      {/* Seleccionar torneo */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-center mb-4">
          Seleccionar Torneo
        </h2>
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

      {/* 📊 Tabla de posiciones */}
      {standings.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
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

      {/* Estadísticas del torneo */}
      {selectedTournament && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Goleadores */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-center mb-4">🥅 Goleadores</h3>
            {topScorers.length === 0 ? (
              <p className="text-gray-500 text-center">Sin datos</p>
            ) : (
              topScorers.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-3 mb-2 border-b pb-2"
                >
                  <img
                    src={p.photo || "/default-player.png"}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <img
                        src={p.team?.logo || "/default-logo.png"}
                        alt={p.team?.name}
                        className="w-5 h-5 rounded-full"
                      />
                      {p.team?.name}
                    </p>
                  </div>
                  <span className="font-bold">{p.goals}</span>
                </div>
              ))
            )}
          </div>

          {/* Amarillas */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-center mb-4">🟨 Amarillas</h3>
            {yellowCards.length === 0 ? (
              <p className="text-gray-500 text-center">Sin datos</p>
            ) : (
              yellowCards.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-3 mb-2 border-b pb-2"
                >
                  <img
                    src={p.photo || "/default-player.png"}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <img
                        src={p.team?.logo || "/default-logo.png"}
                        alt={p.team?.name}
                        className="w-5 h-5 rounded-full"
                      />
                      {p.team?.name}
                    </p>
                  </div>
                  <span className="font-bold">{p.yellowCards}</span>
                </div>
              ))
            )}
          </div>

          {/* Rojas */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-center mb-4">🟥 Rojas</h3>
            {redCards.length === 0 ? (
              <p className="text-gray-500 text-center">Sin datos</p>
            ) : (
              redCards.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-3 mb-2 border-b pb-2"
                >
                  <img
                    src={p.photo || "/default-player.png"}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <img
                        src={p.team?.logo || "/default-logo.png"}
                        alt={p.team?.name}
                        className="w-5 h-5 rounded-full"
                      />
                      {p.team?.name}
                    </p>
                  </div>
                  <span className="font-bold">{p.redCards}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StandingsPage;
