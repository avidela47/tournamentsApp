import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card.jsx";

const TournamentPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    rounds: "",
    teamsCount: "",
    startDate: "",
    endDate: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tournaments");
      setTournaments(res.data);
    } catch (err) {
      console.error("Error cargando torneos:", err);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/tournaments/${editId}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/tournaments", formData);
      }
      setFormData({
        name: "",
        logo: "",
        rounds: "",
        teamsCount: "",
        startDate: "",
        endDate: "",
      });
      setEditId(null);
      fetchTournaments();
    } catch (err) {
      console.error("Error guardando torneo:", err);
    }
  };

  const handleEdit = (t) => {
    setFormData({
      name: t.name,
      logo: t.logo || "",
      rounds: t.rounds || "",
      teamsCount: t.teamsCount || "",
      startDate: t.startDate ? t.startDate.slice(0, 10) : "",
      endDate: t.endDate ? t.endDate.slice(0, 10) : "",
    });
    setEditId(t._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tournaments/${id}`);
      fetchTournaments();
    } catch (err) {
      console.error("Error eliminando torneo:", err);
    }
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
          name="logo"
          placeholder="URL del logo"
          value={formData.logo}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded text-black"
        />

        <input
          type="number"
          name="rounds"
          placeholder="Cantidad de fechas"
          value={formData.rounds}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded text-black"
          required
        />

        <input
          type="number"
          name="teamsCount"
          placeholder="Cantidad de equipos"
          value={formData.teamsCount}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded text-black"
          required
        />

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded text-black"
        />

        <input
          type="date"
          name="endDate"
          value={formData.endDate}
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
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl">
        {tournaments.map((t) => (
          <Card key={t._id}>
            <div className="flex items-center gap-3 mb-4">
              {t.logo && (
                <img
                  src={t.logo}
                  alt={t.name}
                  className="w-12 h-12 object-contain"
                />
              )}
              <h2 className="text-xl font-bold text-black">{t.name}</h2>
            </div>
            <p className="text-sm text-gray-600">Fechas: {t.rounds}</p>
            <p className="text-sm text-gray-600">Equipos: {t.teamsCount || 0}</p>
            {t.startDate && (
              <p className="text-sm text-gray-600">
                Desde: {new Date(t.startDate).toLocaleDateString()}
              </p>
            )}
            {t.endDate && (
              <p className="text-sm text-gray-600">
                Hasta: {new Date(t.endDate).toLocaleDateString()}
              </p>
            )}
            <div className="flex gap-2 mt-4 justify-center">
              <button
                onClick={() => handleEdit(t)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(t._id)}
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

