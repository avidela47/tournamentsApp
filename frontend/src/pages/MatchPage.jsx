import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";

const MatchPage = () => {
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    tournamentId: "",
    round: "", // número de fecha
    homeTeam: "",
    awayTeam: "",
    homeGoals: "",
    awayGoals: "",
    referee: "",
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
    if (!tournamentId) {
      setTeams([]);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:5000/api/teams/tournament/${tournamentId}`
      );
      setTeams(res.data);
    } catch (err) {
      console.error("Error cargando equipos:", err);
      setTeams([]);
    }
  };

  const fetchMatches = async () => {
    const res = await axios.get("http://localhost:5000/api/matches");
    setMatches(res.data);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTournamentChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, tournamentId: value, homeTeam: "", awayTeam: "" }));
    fetchTeams(value);
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
      round: "",
      homeTeam: "",
      awayTeam: "",
      homeGoals: "",
      awayGoals: "",
      referee: "",
    });
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
      round: match.round || "",
      homeTeam: match.homeTeam?._id || "",
      awayTeam: match.awayTeam?._id || "",
      homeGoals: match.homeGoals || "",
      awayGoals: match.awayGoals || "",
      referee: match.referee || "",
    });

    if (match.tournamentId?._id) {
      fetchTeams(match.tournamentId._id);
    }
  };

  // Agrupación por torneo → fechas
  const groupedByTournament = tournaments.map((t) => {
    const tournamentMatches = matches.filter(
      (m) => String(m.tournamentId?._id) === String(t._id)
    );

    // Agrupar por número de fecha (round)
    const groupedByRound = tournamentMatches.reduce((acc, match) => {
      const round = match.round || "Sin fecha";
      if (!acc[round]) acc[round] = [];
      acc[round].push(match);
      return acc;
    }, {});

    return { tournament: t, rounds: groupedByRound };
  });

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-black">Gestión de Partidos</h1>

      {/* Formulario */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xl">
          {/* Torneo */}
          <select
            name="tournamentId"
            value={formData.tournamentId}
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

          {/* Número de fecha */}
          <input
            type="number"
            name="round"
            value={formData.round}
            onChange={handleChange}
            placeholder="Número de fecha (1, 2, 3...)"
            className="w-full p-2 border rounded text-black"
            required
          />

          {/* Equipo local */}
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

          {/* Equipo visitante */}
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

          {/* Goles */}
          <div className="flex gap-2">
            <input
              type="number"
              name="homeGoals"
              value={formData.homeGoals}
              onChange={handleChange}
              placeholder="Goles local"
              className="w-full p-2 border rounded text-black"
            />
            <input
              type="number"
              name="awayGoals"
              value={formData.awayGoals}
              onChange={handleChange}
              placeholder="Goles visitante"
              className="w-full p-2 border rounded text-black"
            />
          </div>

          {/* Árbitro */}
          <input
            type="text"
            name="referee"
            value={formData.referee}
            onChange={handleChange}
            placeholder="Árbitro"
            className="w-full p-2 border rounded text-black"
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

      {/* Listado agrupado */}
      <div className="grid gap-6 mt-6 w-full max-w-5xl">
        {groupedByTournament.map(({ tournament, rounds }) => (
          <Card key={tournament._id}>
            <div className="flex items-center justify-center gap-2 mb-4">
              {tournament.logo && (
                <img
                  src={tournament.logo}
                  alt={tournament.name}
                  className="w-8 h-8 object-cover"
                />
              )}
              <h2 className="text-xl font-bold text-black">{tournament.name}</h2>
            </div>

            {Object.keys(rounds).length === 0 ? (
              <p className="text-center text-gray-600">
                No hay partidos para este torneo.
              </p>
            ) : (
              Object.entries(rounds).map(([round, matches]) => (
                <div key={round} className="mb-4">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Fecha {round}
                  </h3>
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <div
                        key={match._id}
                        className="flex flex-col items-center bg-gray-100 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          {match.homeTeam?.logo && (
                            <img
                              src={match.homeTeam.logo}
                              alt={match.homeTeam.name}
                              className="w-8 h-8 object-cover"
                            />
                          )}
                          <span className="font-semibold text-black">
                            {match.homeTeam?.name}
                          </span>
                          <span className="text-black">
                            {match.homeGoals} - {match.awayGoals}
                          </span>
                          <span className="font-semibold text-black">
                            {match.awayTeam?.name}
                          </span>
                          {match.awayTeam?.logo && (
                            <img
                              src={match.awayTeam.logo}
                              alt={match.awayTeam.name}
                              className="w-8 h-8 object-cover"
                            />
                          )}
                        </div>
                        <p className="text-gray-700 mt-2">
                          Árbitro: {match.referee || "Sin asignar"}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleEdit(match)}
                            className="bg-yellow-500 text-white text-sm px-2 py-1 rounded hover:bg-yellow-600"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(match._id)}
                            className="bg-red-600 text-white text-sm px-2 py-1 rounded hover:bg-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MatchPage;

