import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";

const TeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    tournamentId: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTournaments();
    fetchTeams();
  }, []);

  const fetchTournaments = async () => {
    const res = await axios.get("http://localhost:5000/api/tournaments");
    setTournaments(res.data);
  };

  const fetchTeams = async () => {
    const res = await axios.get("http://localhost:5000/api/teams");
    setTeams(res.data);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`http://localhost:5000/api/teams/${editingId}`, formData);
      setEditingId(null);
    } else {
      await axios.post("http://localhost:5000/api/teams", formData);
    }

    setFormData({ name: "", logo: "", tournamentId: "" });
    await fetchTeams();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/teams/${id}`);
    fetchTeams();
  };

  const handleEdit = (team) => {
    setEditingId(team._id);
    setFormData({
      name: team.name,
      logo: team.logo || "",
      tournamentId: team.tournamentId?._id || "",
    });
  };

  const groupedByTournament = tournaments.map((t) => {
    const list = teams.filter((team) => {
      const tid =
        team?.tournamentId?._id ||
        team?.tournament?._id ||
        team?.tournamentId ||
        team?.tournament;
      return String(tid) === String(t._id);
    });

    return { tournament: t, teams: list };
  });

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-black">Gestión de Equipos</h1>

      {/* Formulario */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xl">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre del equipo"
            className="w-full p-2 border rounded text-black"
            required
          />

          <input
            type="text"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            placeholder="URL del escudo (opcional)"
            className="w-full p-2 border rounded text-black"
          />

          <select
            name="tournamentId"
            value={formData.tournamentId}
            onChange={handleChange}
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

          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${
              editingId ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editingId ? "Actualizar Equipo" : "Agregar Equipo"}
          </button>
        </form>
      </Card>

      {/* Listado agrupado por torneo */}
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

            {teams.length === 0 ? (
              <p className="text-center text-gray-600">No hay equipos para este torneo.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {teams.map((team) => (
                  <div
                    key={team._id}
                    className="flex flex-col items-center bg-gray-100 p-3 rounded-lg"
                  >
                    {team.logo && (
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-12 h-12 object-cover mb-2"
                      />
                    )}
                    <p className="font-semibold text-black">{team.name}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(team)}
                        className="bg-yellow-500 text-white text-sm px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(team._id)}
                        className="bg-red-600 text-white text-sm px-2 py-1 rounded hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;






