import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card.jsx";

const TournamentPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [formData, setFormData] = useState({ name: "", location: "", logo: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const res = await axios.get("http://localhost:5000/api/tournaments");
    setTournaments(res.data);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/api/tournaments/${editId}`, formData);
    } else {
      await axios.post("http://localhost:5000/api/tournaments", formData);
    }
    setFormData({ name: "", location: "", logo: "" });
    setEditId(null);
    fetchTournaments();
  };

  const handleEdit = (tournament) => {
    setFormData({
      name: tournament.name,
      location: tournament.location,
      logo: tournament.logo || ""
    });
    setEditId(tournament._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/tournaments/${id}`);
    fetchTournaments();
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-black">Torneos</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md mb-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Nombre del torneo"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded text-black"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Ubicación"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded text-black"
          required
        />

        <input
          type="text"
          name="logo"
          placeholder="URL del logo/banner"
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
        {tournaments.map((tournament) => (
          <Card key={tournament._id}>
            {tournament.logo && (
              <img
                src={tournament.logo}
                alt={tournament.name}
                className="w-full h-32 object-contain mb-3"
              />
            )}
            <h2 className="text-lg font-bold text-center">{tournament.name}</h2>
            <p className="text-center">Ubicación: {tournament.location}</p>
            <div className="flex gap-3 mt-3 justify-center">
              <button
                onClick={() => handleEdit(tournament)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(tournament._id)}
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

export default TournamentPage;




