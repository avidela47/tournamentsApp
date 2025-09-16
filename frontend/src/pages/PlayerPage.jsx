import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const PlayerPage = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    position: "",
    photo: "",
    goals: 0,
    yellowCards: 0,
    redCards: 0,
    team: "",
    tournament: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [updatingStats, setUpdatingStats] = useState({});

  const fetchJSON = async (url, options = {}) => {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Error ${res.status} en ${url}`);
    return res.json();
  };

  const loadPlayers = async () => {
    const data = await fetchJSON(`${API_URL}/players`);
    setPlayers(data || []);
  };

  const loadTeams = async () => {
    const data = await fetchJSON(`${API_URL}/teams`);
    setTeams(data || []);
  };

  const loadTournaments = async () => {
    const data = await fetchJSON(`${API_URL}/tournaments`);
    setTournaments(data || []);
  };

  useEffect(() => {
    loadPlayers();
    loadTeams();
    loadTournaments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetchJSON(`${API_URL}/players/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetchJSON(`${API_URL}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({
      name: "",
      position: "",
      photo: "",
      goals: 0,
      yellowCards: 0,
      redCards: 0,
      team: "",
      tournament: "",
    });
    setEditingId(null);
    await loadPlayers();
  };

  const handleEdit = (player) => {
    setForm({
      name: player.name,
      position: player.position,
      photo: player.photo,
      goals: player.goals,
      yellowCards: player.yellowCards,
      redCards: player.redCards,
      team: player.team?._id || "",
      tournament: player.team?.tournament || "",
    });
    setEditingId(player._id);
  };

  const handleDelete = async (id) => {
    await fetchJSON(`${API_URL}/players/${id}`, {
      method: "DELETE",
    });
    await loadPlayers();
  };

  const handleUpdateStats = async (id) => {
    const stats = updatingStats[id];
    if (!stats) return;
    await fetchJSON(`${API_URL}/players/${id}/stats`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stats),
    });
    await loadPlayers();
  };

  const groupedByTournament = tournaments.map((tournament) => ({
    ...tournament,
    teams: teams
      .filter((team) => String(team.tournament?._id) === String(tournament._id))
      .map((team) => ({
        ...team,
        players: players.filter(
          (player) => String(player.team?._id) === String(team._id)
        ),
      })),
  }));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 text-black">
      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-center mb-4">
          ➕ {editingId ? "Editar Jugador" : "Crear Jugador"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <input
            type="text"
            placeholder="Nombre del Jugador"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded text-black"
            required
          />
          <input
            type="text"
            placeholder="Posición"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            className="border p-2 rounded text-black"
          />
          <input
            type="text"
            placeholder="URL Foto"
            value={form.photo}
            onChange={(e) => setForm({ ...form, photo: e.target.value })}
            className="border p-2 rounded text-black"
          />
          <select
            value={form.tournament}
            onChange={(e) => setForm({ ...form, tournament: e.target.value })}
            className="border p-2 rounded text-black"
            required
          >
            <option value="">Seleccionar Torneo</option>
            {tournaments.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
          <select
            value={form.team}
            onChange={(e) => setForm({ ...form, team: e.target.value })}
            className="border p-2 rounded text-black"
            required
          >
            <option value="">Seleccionar Equipo</option>
            {teams
              .filter((team) => String(team.tournament?._id) === form.tournament)
              .map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
          </select>
          <button
            type="submit"
            className="col-span-1 md:col-span-2 lg:col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Actualizar" : "Guardar"}
          </button>
        </form>
      </div>

      {/* Lista agrupada */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6">
        🧑‍🤝‍🧑 Lista de Jugadores
      </h2>
      {groupedByTournament.map((tournament) => (
        <div key={tournament._id} className="mb-10">
          {/* Torneo */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={tournament.logo || "/default-logo.png"}
              alt={tournament.name}
              className="w-20 h-20 rounded-full object-cover border mb-2"
            />
            <h3 className="text-2xl font-bold">{tournament.name}</h3>
          </div>

          {/* Equipos */}
          {tournament.teams.map((team) => (
            <div key={team._id} className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src={team.logo || "/default-logo.png"}
                  alt={team.name}
                  className="w-8 h-8 rounded-full border"
                />
                <h4 className="text-lg font-bold">{team.name}</h4>
              </div>

              {/* Jugadores */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {team.players.length === 0 ? (
                  <p className="text-gray-500 col-span-full text-center">
                    No hay jugadores en este equipo.
                  </p>
                ) : (
                  team.players.map((player) => (
                    <div
                      key={player._id}
                      className="bg-white rounded-lg shadow p-3 flex flex-col items-center text-center"
                    >
                      <img
                        src={player.photo || "/default-player.png"}
                        alt={player.name}
                        className="w-14 h-14 rounded-full object-cover border mb-2"
                      />
                      <h4 className="text-base font-bold">{player.name}</h4>
                      <p className="text-xs text-gray-600">
                        {player.position}
                      </p>
                      <p className="text-xs mt-1">
                        Equipo: {player.team?.name}
                      </p>
                      <p className="text-xs">
                        Torneo: {player.team?.tournament?.name}
                      </p>

                      {/* Stats rápidas */}
                      <div className="mt-2 w-full">
                        <div className="flex justify-between text-xs mb-1">
                          <label>⚽</label>
                          <input
                            type="number"
                            defaultValue={player.goals}
                            onChange={(e) =>
                              setUpdatingStats((prev) => ({
                                ...prev,
                                [player._id]: {
                                  ...prev[player._id],
                                  goals: Number(e.target.value),
                                },
                              }))
                            }
                            className="w-12 border rounded p-1 text-black text-xs"
                          />
                        </div>
                        <div className="flex justify-between text-xs mb-1">
                          <label className="text-yellow-600">🟨</label>
                          <input
                            type="number"
                            defaultValue={player.yellowCards}
                            onChange={(e) =>
                              setUpdatingStats((prev) => ({
                                ...prev,
                                [player._id]: {
                                  ...prev[player._id],
                                  yellowCards: Number(e.target.value),
                                },
                              }))
                            }
                            className="w-12 border rounded p-1 text-black text-xs"
                          />
                        </div>
                        <div className="flex justify-between text-xs mb-1">
                          <label className="text-red-600">🟥</label>
                          <input
                            type="number"
                            defaultValue={player.redCards}
                            onChange={(e) =>
                              setUpdatingStats((prev) => ({
                                ...prev,
                                [player._id]: {
                                  ...prev[player._id],
                                  redCards: Number(e.target.value),
                                },
                              }))
                            }
                            className="w-12 border rounded p-1 text-black text-xs"
                          />
                        </div>
                        <button
                          onClick={() => handleUpdateStats(player._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs w-full"
                        >
                          Guardar Stats
                        </button>
                      </div>

                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={() => handleEdit(player)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black px-2 py-1 rounded text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(player._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PlayerPage;
