import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card.jsx";

const PlayerPage = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    team: "",
    photo: ""
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const fetchPlayers = async () => {
    const res = await axios.get("http://localhost:5000/api/players");
    setPlayers(res.data);
  };

  const fetchTeams = async () => {
    const res = await axios.get("http://localhost:5000/api/teams");
    setTeams(res.data);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/api/players/${editId}`, formData);
    } else {
      await axios.post("http://localhost:5000/api/players", formData);
    }
    setFormData({ name: "", position: "", team: "", photo: "" });
    setEditId(null);
    fetchPlayers();
  };

  const handleEdit = (player) => {
    setFormData({
      name: player.name,
      position: player.position,
      team: player.team?._id || "",
      photo: player.photo || ""
    });
    setEditId(player._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/players/${id}`);
    fetchPlayers();
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-black">Jugadores</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md mb-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Nombre del jugador"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded text-black"
          required
        />

        <input
          type="text"
          name="position"
          placeholder="Posición"
          value={formData.position}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded text-black"
          required
        />

        <select
          name="team"
          value={formData.team}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded text-black"
          required
        >
          <option value="">Seleccionar equipo</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="photo"
          placeholder="URL de la foto"
          value={formData.photo}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded text-black"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {/* Listado */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-4xl">
        {players.map((player) => (
          <Card key={player._id}>
            {player.photo && (
              <img
                src={player.photo}
                alt={player.name}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-3"
              />
            )}
            <h2 className="text-lg font-bold text-center">{player.name}</h2>
            <p className="text-center">Posición: {player.position}</p>
            <p className="text-center">
              Equipo: {player.team?.name || "Sin equipo"}
            </p>
            <div className="flex gap-3 mt-3 justify-center">
              <button
                onClick={() => handleEdit(player)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(player._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlayerPage;



