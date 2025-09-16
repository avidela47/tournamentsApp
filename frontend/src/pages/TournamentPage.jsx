import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TournamentPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    logo: "",
    totalRounds: "",
    totalTeams: "",
  });
  const [editingId, setEditingId] = useState(null);

  // ============================
  // Fetch Helper
  // ============================
  const fetchJSON = async (url, options = {}) => {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Error ${res.status} en ${url}`);
    return res.json();
  };

  // ============================
  // Cargar Torneos
  // ============================
  const loadTournaments = async () => {
    const data = await fetchJSON(`${API_URL}/tournaments`);
    setTournaments(data || []);
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  // ============================
  // Crear / Actualizar Torneo
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await fetchJSON(`${API_URL}/tournaments/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetchJSON(`${API_URL}/tournaments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({ name: "", logo: "", totalRounds: "", totalTeams: "" });
    setEditingId(null);
    await loadTournaments();
  };

  // ============================
  // Editar Torneo
  // ============================
  const handleEdit = (tournament) => {
    setForm({
      name: tournament.name,
      logo: tournament.logo,
      totalRounds: tournament.totalRounds,
      totalTeams: tournament.totalTeams,
    });
    setEditingId(tournament._id);
  };

  // ============================
  // Eliminar Torneo
  // ============================
  const handleDelete = async (id) => {
    await fetchJSON(`${API_URL}/tournaments/${id}`, {
      method: "DELETE",
    });
    await loadTournaments();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 text-black">
      {/* =======================
          📌 FORMULARIO TORNEO
      ======================= */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-center mb-4">
          ➕ {editingId ? "Editar Torneo" : "Crear Torneo"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Nombre del Torneo"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded text-black"
            required
          />
          <input
            type="text"
            placeholder="URL del Logo"
            value={form.logo}
            onChange={(e) => setForm({ ...form, logo: e.target.value })}
            className="border p-2 rounded text-black"
          />
          <input
            type="number"
            placeholder="Cantidad de Fechas"
            value={form.totalRounds}
            onChange={(e) => setForm({ ...form, totalRounds: e.target.value })}
            className="border p-2 rounded text-black"
            required
          />
          <input
            type="number"
            placeholder="Cantidad de Equipos"
            value={form.totalTeams}
            onChange={(e) => setForm({ ...form, totalTeams: e.target.value })}
            className="border p-2 rounded text-black"
            required
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Actualizar" : "Guardar"}
          </button>
        </form>
      </div>

      {/* =======================
          📌 LISTADO TORNEOS
      ======================= */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6">
        🏆 Lista de Torneos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div
            key={tournament._id}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
          >
            <img
              src={tournament.logo || "/default-logo.png"}
              alt={tournament.name}
              className="w-20 h-20 object-cover mb-4"
            />
            <h3 className="text-lg font-bold">{tournament.name}</h3>
            <p className="text-sm text-gray-600">
              Fechas: {tournament.totalRounds}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Equipos: {tournament.totalTeams}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(tournament)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(tournament._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-bold"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentPage;




