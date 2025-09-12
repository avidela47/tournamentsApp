import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card.jsx";

const TeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({ name: "", logo: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const res = await axios.get("http://localhost:5000/api/teams");
    setTeams(res.data);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/api/teams/${editId}`, formData);
    } else {
      await axios.post("http://localhost:5000/api/teams", formData);
    }
    setFormData({ name: "", logo: "" });
    setEditId(null);
    fetchTeams();
  };

  const handleEdit = (team) => {
    setFormData({ name: team.name, logo: team.logo || "" });
    setEditId(team._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/teams/${id}`);
    fetchTeams();
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-black">Equipos</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md mb-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Nombre del equipo"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded text-black"
          required
        />

        <input
          type="text"
          name="logo"
          placeholder="URL del escudo"
          value={formData.logo}
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
        {teams.map((team) => (
          <Card key={team._id}>
            {team.logo && (
              <img
                src={team.logo}
                alt={team.name}
                className="w-20 h-20 object-contain mx-auto mb-3"
              />
            )}
            <h2 className="text-lg font-bold text-center">{team.name}</h2>
            <div className="flex gap-3 mt-3 justify-center">
              <button
                onClick={() => handleEdit(team)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(team._id)}
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

export default TeamPage;


