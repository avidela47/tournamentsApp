import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";

const PlayerPage = () => {
  const [players, setPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showTeams, setShowTeams] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    team: "",
    tournamentId: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTournaments();
    fetchPlayers();
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

  const fetchPlayers = async () => {
    const res = await axios.get("http://localhost:5000/api/players");
    setPlayers(res.data);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTournamentChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, tournamentId: value, team: "" }));
    fetchTeams(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`http://localhost:5000/api/players/${editingId}`, formData);
      setEditingId(null);
    } else {
      await axios.post("http://localhost:5000/api/players", formData);
    }

    setFormData({ name: "", photo: "", team: "", tournamentId: "" });
    await fetchPlayers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/players/${id}`);
    fetchPlayers();
  };

  const handleEdit = (player) => {
    setEditingId(player._id);
    setFormData({
      name: player.name,
      photo: player.photo || "",
      team: player.team?._id || "",
      tournamentId: player.team?.tournamentId?._id || "",
    });

    if (player.team?.tournamentId?._id) {
      fetchTeams(player.team.tournamentId._id);
    }
  };

  // Agrupación por torneo → equipos
  const groupedByTournament = tournaments.map((t) => {
    const teamsInTournament = teams.length
      ? teams
      : players
          .map((p) => p.team?.tournamentId?._id)
          .filter((tid) => String(tid) === String(t._id));

    return {
      tournament: t,
      teams: players
        .filter((p) => String(p.team?.tournamentId?._id) === String(t._id))
        .reduce((acc, player) => {
          const teamId = player.team?._id;
          if (!acc[teamId]) {
            acc[teamId] = {
              ...player.team,
              players: [],
            };
          }
          acc[teamId].players.push(player);
          return acc;
        }, {}),
    };
  });

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-black">Gestión de Jugadores</h1>

      {/* Formulario */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xl">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre del jugador"
            className="w-full p-2 border rounded text-black"
            required
          />

          <input
            type="text"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            placeholder="URL de la foto"
            className="w-full p-2 border rounded text-black"
          />

          {/* Dropdown de torneos */}
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

          {/* Dropdown custom de equipos */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTeams(!showTeams)}
              className="w-full p-2 border rounded text-black flex justify-between items-center"
            >
              {formData.team
                ? teams.find((t) => t._id === formData.team)?.name
                : "Seleccionar equipo"}
              <span className="ml-2">▼</span>
            </button>

            {showTeams && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
                {teams.map((team) => (
                  <div
                    key={team._id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, team: team._id }));
                      setShowTeams(false);
                    }}
                  >
                    {team.logo && (
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-6 h-6 object-cover rounded"
                      />
                    )}
                    <span className="text-black">{team.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${
              editingId ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editingId ? "Actualizar Jugador" : "Agregar Jugador"}
          </button>
        </form>
      </Card>

      {/* Listado agrupado */}
      <div className="grid gap-6 mt-6 w-full max-w-5xl">
        {groupedByTournament.map(({ tournament, teams }) => (
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

            {Object.values(teams).length === 0 ? (
              <p className="text-center text-gray-600">
                No hay jugadores para este torneo.
              </p>
            ) : (
              Object.values(teams).map((team) => (
                <div key={team._id} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {team.logo && (
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-6 h-6 object-cover"
                      />
                    )}
                    <h3 className="font-semibold text-black">{team.name}</h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {team.players.map((player) => (
                      <div
                        key={player._id}
                        className="flex flex-col items-center bg-gray-100 p-3 rounded-lg"
                      >
                        {player.photo && (
                          <img
                            src={player.photo}
                            alt={player.name}
                            className="w-12 h-12 object-cover mb-2"
                          />
                        )}
                        <div className="flex items-center gap-2">
                          {team.logo && (
                            <img
                              src={team.logo}
                              alt={team.name}
                              className="w-6 h-6 object-cover"
                            />
                          )}
                          <p className="font-semibold text-black">
                            {player.name}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleEdit(player)}
                            className="bg-yellow-500 text-white text-sm px-2 py-1 rounded hover:bg-yellow-600"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(player._id)}
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

export default PlayerPage;











