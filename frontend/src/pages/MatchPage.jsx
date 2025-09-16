import React, { useState, useEffect } from "react";

const MatchPage = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [form, setForm] = useState({
    tournament: "",
    date: "",
    jornada: "",
    homeTeam: "",
    awayTeam: "",
    homeGoals: "",
    awayGoals: "",
    referee: "",
  });
  const [editingId, setEditingId] = useState(null);

  // 🌍 API para Render o Local
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchJSON = async (url, options = {}) => {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Error ${res.status} en ${url}`);
    return res.json();
  };

  const loadMatches = async () => {
    const data = await fetchJSON(`${API_URL}/matches`);
    setMatches(data || []);
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
    loadMatches();
    loadTeams();
    loadTournaments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetchJSON(`${API_URL}/matches/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetchJSON(`${API_URL}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({
      tournament: "",
      date: "",
      jornada: "",
      homeTeam: "",
      awayTeam: "",
      homeGoals: "",
      awayGoals: "",
      referee: "",
    });
    setEditingId(null);
    await loadMatches();
  };

  const handleEdit = (match) => {
    setForm({
      tournament: match.tournament?._id || "",
      date: match.date?.substring(0, 10) || "",
      jornada: match.jornada || "",
      homeTeam: match.homeTeam?._id || "",
      awayTeam: match.awayTeam?._id || "",
      homeGoals: match.homeGoals,
      awayGoals: match.awayGoals,
      referee: match.referee,
    });
    setEditingId(match._id);
  };

  const handleDelete = async (id) => {
    await fetchJSON(`${API_URL}/matches/${id}`, {
      method: "DELETE",
    });
    await loadMatches();
  };

  // Agrupación de partidos por torneo y fecha
  const groupedMatches = tournaments.map((t) => ({
    ...t,
    matches: matches
      .filter((m) => m.tournament && String(m.tournament._id) === String(t._id))
      .sort((a, b) => new Date(a.date) - new Date(b.date)),
  }));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 text-black">
      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-center mb-4">
          ➕ {editingId ? "Editar Partido" : "Crear Partido"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center"
        >
          {/* Torneo */}
          <select
            value={form.tournament}
            onChange={(e) => setForm({ ...form, tournament: e.target.value })}
            className="border p-2 rounded text-black w-full"
            required
          >
            <option value="">-- Seleccionar Torneo --</option>
            {tournaments.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Fecha del partido */}
          <input
            type="date"
            placeholder="Fecha del partido"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border p-2 rounded text-black w-full"
          />

          {/* Número de jornada */}
          <input
            type="number"
            placeholder="Fecha (ej: 1, 2, 3...)"
            value={form.jornada}
            onChange={(e) => setForm({ ...form, jornada: e.target.value })}
            className="border p-2 rounded text-black w-full"
            min="1"
          />

          {/* Equipo local + goles */}
          <div className="flex gap-2">
            <select
              value={form.homeTeam}
              onChange={(e) => setForm({ ...form, homeTeam: e.target.value })}
              className="border p-2 rounded text-black w-2/3"
              required
            >
              <option value="">-- Equipo Local --</option>
              {teams
                .filter((team) => String(team.tournament?._id) === form.tournament)
                .map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
            </select>
            <input
              type="number"
              placeholder="Goles Local"
              value={form.homeGoals}
              onChange={(e) => setForm({ ...form, homeGoals: e.target.value })}
              className="border p-2 rounded text-black w-1/3"
            />
          </div>

          {/* Equipo visitante + goles */}
          <div className="flex gap-2">
            <select
              value={form.awayTeam}
              onChange={(e) => setForm({ ...form, awayTeam: e.target.value })}
              className="border p-2 rounded text-black w-2/3"
              required
            >
              <option value="">-- Equipo Visitante --</option>
              {teams
                .filter((team) => String(team.tournament?._id) === form.tournament)
                .map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
            </select>
            <input
              type="number"
              placeholder="Goles Visitante"
              value={form.awayGoals}
              onChange={(e) => setForm({ ...form, awayGoals: e.target.value })}
              className="border p-2 rounded text-black w-1/3"
            />
          </div>

          {/* Árbitro */}
          <input
            type="text"
            placeholder="Árbitro"
            value={form.referee}
            onChange={(e) => setForm({ ...form, referee: e.target.value })}
            className="border p-2 rounded text-black w-full md:w-2/3"
          />

          <button
            type="submit"
            className="col-span-1 md:col-span-2 lg:col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Actualizar" : "Guardar"}
          </button>
        </form>
      </div>

      {/* Render partidos agrupados */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6">
        📅 Lista de Partidos
      </h2>
      {groupedMatches.map((tournament) => (
        <div key={tournament._id} className="mb-10">
          {/* Torneo */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={tournament.logo || "/default-logo.png"}
              alt={tournament.name}
              className="w-24 h-24 rounded-full object-cover border mb-2"
            />
            <h3 className="text-2xl font-bold">{tournament.name}</h3>
          </div>

          {/* Fechas */}
          {tournament.matches.length === 0 ? (
            <p className="text-gray-500 text-center">
              No hay partidos en este torneo.
            </p>
          ) : (
            [...new Set(tournament.matches.map((m) => m.jornada))].map(
              (jornada) => (
                <div key={jornada} className="mb-6">
                  <h4 className="text-lg font-bold uppercase text-center mb-3">
                    FECHA {jornada}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tournament.matches
                      .filter((m) => m.jornada === jornada)
                      .map((match) => (
                        <div
                          key={match._id}
                          className="bg-white rounded-lg shadow p-2 flex flex-col items-center text-center"
                        >
                          <p className="text-xs text-gray-600 mb-2">
                            {new Date(match.date).toLocaleDateString()} — Árbitro:{" "}
                            {match.referee}
                          </p>
                          <div className="flex items-center justify-center gap-3">
                            <div className="flex flex-col items-center">
                              <img
                                src={match.homeTeam?.logo || "/default-logo.png"}
                                alt={match.homeTeam?.name}
                                className="w-10 h-10 rounded-full border mb-1"
                              />
                              <p className="text-sm">{match.homeTeam?.name}</p>
                            </div>
                            <span className="font-bold text-base">
                              {match.homeGoals} - {match.awayGoals}
                            </span>
                            <div className="flex flex-col items-center">
                              <img
                                src={match.awayTeam?.logo || "/default-logo.png"}
                                alt={match.awayTeam?.name}
                                className="w-10 h-10 rounded-full border mb-1"
                              />
                              <p className="text-sm">{match.awayTeam?.name}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleEdit(match)}
                              className="bg-yellow-400 hover:bg-yellow-500 text-black px-2 py-1 rounded text-xs"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(match._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default MatchPage;




