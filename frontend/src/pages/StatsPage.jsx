import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";

const StatsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [formData, setFormData] = useState({
    playerId: "",
    goals: 0,
    yellowCards: 0,
    redCards: 0,
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const res = await axios.get("http://localhost:5000/api/tournaments");
    setTournaments(res.data);
  };

  const fetchPlayers = async (tournamentId) => {
    const res = await axios.get(
      `http://localhost:5000/api/players/tournament/${tournamentId}`
    );
    setPlayers(res.data);
  };

  const fetchStats = async (tournamentId) => {
    const res = await axios.get(
      `http://localhost:5000/api/stats/${tournamentId}`
    );
    setStats(res.data);
  };

  const handleTournamentChange = (e) => {
    const id = e.target.value;
    setSelectedTournament(id);
    if (id) {
      fetchPlayers(id);
      fetchStats(id);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTournament) return alert("Selecciona un torneo primero");

    await axios.post(
      `http://localhost:5000/api/stats/${selectedTournament}`,
      formData
    );

    setFormData({ playerId: "", goals: 0, yellowCards: 0, redCards: 0 });
    fetchStats(selectedTournament);
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-black">Estadísticas</h1>

      {/* Selector de torneo */}
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

      {/* Card de carga de estadísticas */}
      {selectedTournament && (
        <Card>
          <h2 className="text-xl font-bold mb-4 text-black">
            Cargar estadísticas
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Jugador */}
            <select
              name="playerId"
              value={formData.playerId}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            >
              <option value="">Seleccionar jugador</option>
              {players.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Goles */}
            <input
              type="number"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              placeholder="Goles"
              className="w-full p-2 border rounded text-black"
              min="0"
            />

            {/* Amarillas */}
            <input
              type="number"
              name="yellowCards"
              value={formData.yellowCards}
              onChange={handleChange}
              placeholder="Tarjetas Amarillas"
              className="w-full p-2 border rounded text-black"
              min="0"
            />

            {/* Rojas */}
            <input
              type="number"
              name="redCards"
              value={formData.redCards}
              onChange={handleChange}
              placeholder="Tarjetas Rojas"
              className="w-full p-2 border rounded text-black"
              min="0"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </form>
        </Card>
      )}

      {/* Cards de visualización */}
      {stats && (
        <div className="w-full max-w-5xl flex flex-col gap-6 mt-6">
          {/* Goleador */}
          <Card>
            <h2 className="text-xl font-bold mb-4 text-black">Goleador</h2>
            {stats.topScorer ? (
              <div className="flex items-center gap-4">
                {stats.topScorer.photo && (
                  <img
                    src={stats.topScorer.photo}
                    alt={stats.topScorer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-bold text-black">{stats.topScorer.name}</p>
                  <p className="text-sm text-gray-600">
                    Goles: {stats.topScorer.goals}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Sin datos</p>
            )}
          </Card>

          {/* Amarillas */}
          <Card>
            <h2 className="text-xl font-bold mb-4 text-black">
              Tarjetas Amarillas
            </h2>
            {stats.yellowCards && stats.yellowCards.length > 0 ? (
              <ul className="space-y-2">
                {stats.yellowCards.map((p) => (
                  <li key={p.playerId} className="flex items-center gap-4">
                    {p.photo && (
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <span className="font-bold text-black">{p.name}</span>
                    <span className="ml-auto text-gray-700">
                      {p.yellowCards} 🟨
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Sin datos</p>
            )}
          </Card>

          {/* Rojas */}
          <Card>
            <h2 className="text-xl font-bold mb-4 text-black">
              Tarjetas Rojas
            </h2>
            {stats.redCards && stats.redCards.length > 0 ? (
              <ul className="space-y-2">
                {stats.redCards.map((p) => (
                  <li key={p.playerId} className="flex items-center gap-4">
                    {p.photo && (
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <span className="font-bold text-black">{p.name}</span>
                    <span className="ml-auto text-gray-700">
                      {p.redCards} 🟥
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Sin datos</p>
            )}
          </Card>

          {/* Por fecha */}
          <Card>
            <h2 className="text-xl font-bold mb-4 text-black">
              Estadísticas por Fecha
            </h2>
            {stats.byRound && stats.byRound.length > 0 ? (
              <div className="space-y-4">
                {stats.byRound.map((round, idx) => (
                  <div key={idx} className="border-b pb-2">
                    <h3 className="font-bold text-black mb-2">
                      Fecha {round.round}
                    </h3>
                    <p className="text-sm text-gray-700">
                      Goleador: {round.topScorer?.name || "—"} (
                      {round.topScorer?.goals || 0} goles)
                    </p>
                    <p className="text-sm text-gray-700">
                      Amarillas: {round.yellowCards || 0}
                    </p>
                    <p className="text-sm text-gray-700">
                      Rojas: {round.redCards || 0}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Sin datos</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default StatsPage;




