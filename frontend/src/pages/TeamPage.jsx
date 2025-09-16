import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    logo: "",
    tournament: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchJSON = async (url, options = {}) => {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Error ${res.status} en ${url}`);
    return res.json();
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
    loadTeams();
    loadTournaments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetchJSON(`${API_URL}/teams/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetchJSON(`${API_URL}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ name: "", logo: "", tournament: "" });
    setEditingId(null);
    await loadTeams();
  };

  const handleEdit = (team) => {
    setForm({
      name: team.name,
      logo: team.logo,
      tournament: team.tournament?._id || "",
    });
    setEditingId(team._id);
  };

  const handleDelete = async (id) => {
    await fetchJSON(`${API_URL}/teams/${id}`, { method: "DELETE" });
    await loadTeams();
  };

  // Agrupación por torneo
  const groupedByTournament = tournaments.map((tournament) => ({
    ...tournament,
    teams: teams.filter(
      (team) => String(team.tournament?._id) === String(tournament._id)
    ),
  }));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 text-black">
      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-center mb-4">
          ➕ {editingId ? "Editar Equipo" : "Crear Equipo"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <input
            type="text"
            placeholder="Nombre del Equipo"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded text-black"
            required
          />
          <input
            type="text"
            placeholder="URL del Escudo"
            value={form.logo}
            onChange={(e) => setForm({ ...form, logo: e.target.value })}
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
        🏆 Lista de Equipos
      </h2>
      {groupedByTournament.map((tournament) => (
        <div key={tournament._id} className="mb-10">
          <div className="flex flex-col items-center mb-6">
            <img
              src={tournament.logo || "/default-logo.png"}
              alt={tournament.name}
              className="w-24 h-24 rounded-full object-cover border mb-2"
            />
            <h3 className="text-2xl font-bold">{tournament.name}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tournament.teams.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center">
                No hay equipos en este torneo.
              </p>
            ) : (
              tournament.teams.map((team) => (
                <div
                  key={team._id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center w-52"
                >
                  <img
                    src={team.logo || "/default-logo.png"}
                    alt={team.name}
                    className="w-20 h-20 rounded-full object-cover border mb-3"
                  />
                  <h4 className="text-lg font-bold">{team.name}</h4>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(team)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-2 py-1 rounded text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(team._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
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
  );
};

export default TeamPage;
