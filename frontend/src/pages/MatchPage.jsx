import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card.jsx";

const MatchPage = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [formData, setFormData] = useState({
    homeTeam: "",
    awayTeam: "",
    score: "",
    tournament: ""
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMatches();
    fetchTeams();
    fetchTournaments();
  }, []);

  const fetchMatches = async () => {
    const res = await axios.get("http://localhost:5000/api/matches");
    setMatches(res.data);
  };

  const fetchTeams = async () => {
    const res = await axios.get("http://localhost:5000/api/teams");
    setTeams(res.data);
  };

  const fetchTournaments = async () => {
    const res = await axios.get("http://localhost:5000/api/tournaments");
    setTournaments(res.data);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/api/matches/${editId}`, formData);
    } else {
      await axios.post("http://localhost:5000/api/matches", formData);
    }
    setFormData({ homeTeam: "", awayTeam: "", score: "", tournament: "" });
    setEditId(null);
    fetchMatches();
  };

  const handleEdit = (match) => {
    setFormData({
      homeTeam: match.homeTeam?._id || "",
      awayTeam: match.awayTeam?._id || "",
      score: match.score || "",
      tournament: match.tournament?._id || ""
    });
    setEditId(match._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/matches/${id}`);
    fetchMatches();
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-black">Partidos</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md mb-6"
      >
        <select
          name="homeTeam"
          value={formData.homeTeam}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded text-black"
          required
        >
          <option value="">Seleccionar equipo local</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          name="awayTeam"
          value={formData.awayTeam}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded text-black"
          required
        >
          <option value="">Seleccionar equipo visitante</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="score"
          placeholder="Ej: 2-1"
          value={formData.score}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded text-black"
        />

        <select
          name="tournament"
          value={formData.tournament}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded text-black"
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
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {/* Listado */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl">
        {matches.map((match) => (
          <Card key={match._id}>
            <div className="flex items-center justify-between gap-3 mb-3">
              {/* Local */}
              <div className="flex flex-col items-center w-1/3">
                {match.homeTeam?.logo && (
                  <img
                    src={match.homeTeam.logo}
                    alt={match.homeTeam.name}
                    className="w-12 h-12 object-contain mb-1"
                  />
                )}
                <p className="font-bold text-sm text-center">
                  {match.homeTeam?.name}
                </p>
              </div>

              {/* Resultado */}
              <div className="w-1/3 text-center">
                <p className="text-lg font-bold">{match.score || " - "}</p>
              </div>

              {/* Visitante */}
              <div className="flex flex-col items-center w-1/3">
                {match.awayTeam?.logo && (
                  <img
                    src={match.awayTeam.logo}
                    alt={match.awayTeam.name}
                    className="w-12 h-12 object-contain mb-1"
                  />
                )}
                <p className="font-bold text-sm text-center">
                  {match.awayTeam?.name}
                </p>
              </div>
            </div>

            <p className="text-center text-gray-600">
              Torneo: {match.tournament?.name || "Sin torneo"}
            </p>

            <div className="flex gap-3 mt-3 justify-center">
              <button
                onClick={() => handleEdit(match)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(match._id)}
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

export default MatchPage;



