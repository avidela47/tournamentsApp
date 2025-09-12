import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card.jsx";

const StatsPage = () => {
  const [players, setPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [formData, setFormData] = useState({ playerId: "", type: "" });
  const [topScorers, setTopScorers] = useState([]);
  const [topYellow, setTopYellow] = useState([]);
  const [topRed, setTopRed] = useState([]);

  useEffect(() => {
    fetchPlayers();
    fetchTournaments();
  }, []);

  const fetchPlayers = async () => {
    const res = await axios.get("http://localhost:5000/api/players");
    setPlayers(res.data);
  };

  const fetchTournaments = async () => {
    const res = await axios.get("http://localhost:5000/api/tournaments");
    setTournaments(res.data);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTournamentChange = (e) => {
    const tournamentId = e.target.value;
    setSelectedTournament(tournamentId);
    if (tournamentId) fetchStats(tournamentId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTournament) return alert("Selecciona un torneo primero");
    await axios.post("http://localhost:5000/api/stats", {
      ...formData,
      tournamentId: selectedTournament,
    });
    fetchStats(selectedTournament);
    setFormData({ playerId: "", type: "" });
  };

  const fetchStats = async (tournamentId) => {
    const scorers = await axios.get(
      `http://localhost:5000/api/stats/topscorers/${tournamentId}`
    );
    const yellow = await axios.get(
      `http://localhost:5000/api/stats/topcards/yellow/${tournamentId}`
    );
    const red = await axios.get(
      `http://localhost:5000/api/stats/topcards/red/${tournamentId}`
    );
    setTopScorers(scorers.data);
    setTopYellow(yellow.data);
    setTopRed(red.data);
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-black text-center">
        Estadísticas de Torneos
      </h1>

      {/* Selector de torneo */}
      <div className="w-full max-w-md mb-6">
        <select
          value={selectedTournament}
          onChange={handleTournamentChange}
          className="w-full p-2 border rounded text-black"
        >
          <option value="">Seleccionar Torneo</option>
          {tournaments.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Formulario de eventos */}
      {selectedTournament && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-6 rounded-lg shadow-md text-black w-full max-w-md mb-6"
        >
          <h2 className="text-lg font-bold mb-3">Registrar evento</h2>

          <select
            name="playerId"
            value={formData.playerId}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded text-black"
            required
          >
            <option value="">Seleccionar jugador</option>
            {players.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded text-black"
            required
          >
            <option value="">Seleccionar evento</option>
            <option value="goal">Gol</option>
            <option value="yellow">Tarjeta Amarilla</option>
            <option value="red">Tarjeta Roja</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Agregar
          </button>
        </form>
      )}

      {/* Rankings */}
      {selectedTournament && (
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Goleadores */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-black">Goleadores</h2>
            {topScorers.length > 0 ? (
              topScorers.map((s) => (
                <Card key={s._id}>
                  <h3 className="text-lg font-semibold">{s.player.name}</h3>
                  <p>Goles: {s.goals}</p>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">Sin datos</p>
            )}
          </div>

          {/* Amarillas */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-black">Amarillas</h2>
            {topYellow.length > 0 ? (
              topYellow.map((s) => (
                <Card key={s._id}>
                  <h3 className="text-lg font-semibold">{s.player.name}</h3>
                  <p>Amarillas: {s.yellowCards}</p>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">Sin datos</p>
            )}
          </div>

          {/* Rojas */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-black">Rojas</h2>
            {topRed.length > 0 ? (
              topRed.map((s) => (
                <Card key={s._id}>
                  <h3 className="text-lg font-semibold">{s.player.name}</h3>
                  <p>Rojas: {s.redCards}</p>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">Sin datos</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;



