import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import CardsTable from "../components/CardsTable";

const CardsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [cards, setCards] = useState({ yellow: [], red: [] });

  // 🌍 API Render o Local
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await axios.get(`${API_URL}/tournaments`);
      setTournaments(res.data);
    } catch (err) {
      console.error("Error cargando torneos:", err);
    }
  };

  const fetchCards = async (tournamentId) => {
    try {
      const res = await axios.get(`${API_URL}/stats/cards/${tournamentId}`);
      setCards(res.data);
    } catch (err) {
      console.error("Error cargando tarjetas:", err);
    }
  };

  const handleTournamentChange = (e) => {
    const id = e.target.value;
    setSelectedTournament(id);
    if (id) {
      fetchCards(id);
    } else {
      setCards({ yellow: [], red: [] });
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-black">
        Tarjetas del Torneo
      </h1>

      {/* Seleccionar torneo */}
      <Card>
        <select
          value={selectedTournament}
          onChange={handleTournamentChange}
          className="w-full p-2 border rounded text-black"
        >
          <option value="">Seleccionar torneo</option>
          {tournaments.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </Card>

      {/* Tablas */}
      {selectedTournament && (
        <div className="mt-6 w-full max-w-3xl">
          <Card>
            {cards.yellow.length === 0 && cards.red.length === 0 ? (
              <p className="text-center text-gray-600">
                No hay datos de tarjetas para este torneo.
              </p>
            ) : (
              <>
                <CardsTable cards={cards.yellow} type="yellow" />
                <CardsTable cards={cards.red} type="red" />
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default CardsPage;
