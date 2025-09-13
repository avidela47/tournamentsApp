import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";

const MatchPage = () => {
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [formData, setFormData] = useState({
    tournamentId: "",
    homeTeam: "",
    awayTeam: "",
    homeGoals: "",
    awayGoals: "",
    referee: "",
    round: "", // fecha
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTournaments();
    fetchMatches();
  }, []);

  const fetchTournaments = async () => {
    const res = await axios.get("http://localhost:5000/api/tournaments");
    setTournaments(res.data);
  };

  const fetchTeams = async (tournamentId) => {
    if (!tournamentId) return;
    const res = await axios.get(
      `http://localhost:5000/api/teams/tournament/${tournamentId}`
    );
    setTeams(res.data);
  };

  const fetchMatches = async () => {
    const res = await axios.get("http://localhost:5000/api/matches");
    setMatches(res.data);
  };

  const handleTournamentChange = (e) => {
    const tid = e.target.value;
    setSelectedTournament(tid);
    setTeams([]);
    setFormData({ ...formData, tournamentId: tid, homeTeam: "", awayTeam: "" });
    if (tid) fetchTeams(tid);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`http://localhost:5000/api/matches/${editingId}`, formData);
      setEditingId(null);
    } else {
      await axios.post("http://localhost:5000/api/matches", formData);
    }

    setFormData({
      tournamentId: "",
      homeTeam: "",
      awayTeam: "",
      homeGoals: "",
      awayGoals: "",
      referee: "",
      round: "",
    });
    setSelectedTournament("");
    await fetchMatches();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/matches/${id}`);
    fetchMatches();
  };

  const handleEdit = (match) => {
    setEditingId(match._id);
    setFormData({
      tournamentId: match.tournamentId?._id || "",
      homeTeam: match.homeTeam?._id || "",
      awayTeam: match.awayTeam?._id || "",
      homeGoals: match.homeGoals,
      awayGoals: match.awayGoals,
      referee: match.referee,
      round: match.round,
    });

    const tid = match.tournamentId?._id;
    if (tid) {
      setSelectedTournament(tid);
      fetchTeams(tid);
    }
  };

  // Agrupar por torneo → fecha
  const groupedByTournament = tournaments.map((t) => ({
    tournament: t,
    rounds: [
      ...new Set(
        matches
          .filter(
            (m) =>
              m.tournamentId?._id === t._id || m.tournament?._id === t._id
          )
          .map((m) => m.round)
      ),
    ].map((round) => ({
      round,
      matches: matches.filter(
        (m) =>
          (m.tournamentId?._id === t._id || m.tournament?._id === t._id) &&
          m.round === round
      ),
    })),
  }));

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-black">Gestión de Partidos</h1>

      {/* Formulario */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={selectedTournament}
            onChange={handleTournamentChange}
            className="w-full p-2 border rounded text-black"
            required
          >
            <option value="">Seleccionar torneo</option>
            {tournaments.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            name="homeTeam"
            value={formData.homeTeam}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black"
            required
          >
            <option value="">Seleccionar equipo local</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>

          <select
            name="awayTeam"
            value={formData.awayTeam}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black"
            required
          >
            <option value="">Seleccionar equipo visitante</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              type="number"
              name="homeGoals"
              value={formData.homeGoals}
              onChange={handleChange}
              placeholder="Goles local"
              className="w-1/2 p-2 border rounded text-black"
              required
            />
            <input
              type="number"
              name="awayGoals"
              value={formData.awayGoals}
              onChange={handleChange}
              placeholder="Goles visitante"
              className="w-1/2 p-2 border rounded text-black"
              required
            />
          </div>

          <input
            type="text"
            name="referee"
            value={formData.referee}
            onChange={handleChange}
            placeholder="Nombre del árbitro"
            className="w-full p-2 border rounded text-black"
          />

          <input
            type="text"
            name="round"
            value={formData.round}
            onChange={handleChange}
            placeholder="Ej: Primera, Segunda, etc."
            className="w-full p-2 border rounded text-black"
            required
          />

          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${
              editingId ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editingId ? "Actualizar Partido" : "Agregar Partido"}
          </button>
        </form>
      </Card>

      {/* Listado agrupado por torneo → fecha */}
      <div className="grid gap-6 mt-6 w-full max-w-5xl">
        {groupedByTournament.map(
          ({ tournament, rounds }) =>
            rounds.length > 0 && (
              <Card key={tournament._id}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black justify-center">
                  {tournament.logo && (
                    <img
                      src={tournament.logo}
                      alt={tournament.name}
                      className="w-8 h-8 object-cover"
                    />
                  )}
                  {tournament.name}
                </h2>
                <div className="grid gap-6">
                  {rounds.map(
                    ({ round, matches }) =>
                      matches.length > 0 && (
                        <div key={round} className="bg-gray-100 p-4 rounded-lg shadow">
                          <h3 className="text-lg font-bold mb-2 text-black">{round}</h3>
                          <div className="grid gap-2">
                            {matches.map((m) => (
                              <div
                                key={m._id}
                                className="flex items-center justify-between bg-white p-2 rounded shadow-sm"
                              >
                                <div className="flex items-center gap-2">
                                  {m.homeTeam?.logo && (
                                    <img
                                      src={m.homeTeam.logo}
                                      alt={m.homeTeam.name}
                                      className="w-6 h-6 object-cover"
                                    />
                                  )}
                                  <span className="font-bold text-black">{m.homeTeam?.name}</span>
                                  <span className="text-black">
                                    {m.homeGoals} - {m.awayGoals}
                                  </span>
                                  <span className="font-bold text-black">{m.awayTeam?.name}</span>
                                  {m.awayTeam?.logo && (
                                    <img
                                      src={m.awayTeam.logo}
                                      alt={m.awayTeam.name}
                                      className="w-6 h-6 object-cover"
                                    />
                                  )}
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="italic text-sm text-gray-700">
                                    Árbitro: {m.referee || "N/A"}
                                  </span>
                                  <button
                                    onClick={() => handleEdit(m)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleDelete(m._id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </Card>
            )
        )}
      </div>
    </div>
  );
};

export default MatchPage;
