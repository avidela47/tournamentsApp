import React, { useEffect, useState } from "react";
import axios from "axios";
import StandingsTable from "../components/StandingsTable.jsx";

const StandingsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tournaments");
      setTournaments(res.data);
    } catch (err) {
      console.error("Error al cargar torneos", err);
    }
  };

  const fetchStandings = async (tournamentId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/standings/${tournamentId}`
      );
      setStandings(res.data);
    } catch (err) {
      console.error("Error al cargar posiciones", err);
    }
  };

  const handleChange = (e) => {
    const tournamentId = e.target.value;
    setSelectedTournament(tournamentId);
    if (tournamentId) fetchStandings(tournamentId);
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-black text-center">
        Tabla de Posiciones
      </h1>

      {/* Selector de torneo */}
      <div className="w-full max-w-md mb-6">
        <select
          value={selectedTournament}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        >
          <option value="">Seleccionar Torneo</option>
          {tournaments.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de posiciones */}
      <div className="w-full max-w-4xl">
        {selectedTournament ? (
          <StandingsTable standings={standings} />
        ) : (
          <p className="text-gray-500 text-center">
            Selecciona un torneo para ver la tabla
          </p>
        )}
      </div>
    </div>
  );
};

export default StandingsPage;

