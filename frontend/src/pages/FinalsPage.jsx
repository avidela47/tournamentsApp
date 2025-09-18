import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const FinalsPage = () => {
  const { auth } = useAuth();
  const isAdmin = auth?.role === "admin";

  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [standings, setStandings] = useState([]);
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchJSON = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth?.token}`,
      },
    });
    if (!res.ok) throw new Error(`Error ${res.status} en ${url}`);
    return res.json();
  };

  // cargar torneos
  useEffect(() => {
    const load = async () => {
      try {
        const ts = await fetchJSON(`${API_URL}/tournaments`);
        setTournaments(ts || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  // al cambiar torneo
  const handleTournamentChange = async (e) => {
    const id = e.target.value;
    setSelectedTournament(id);
    setStandings([]);
    setBracket(null);

    if (!id) return;

    setLoading(true);
    try {
      const table = await fetchJSON(`${API_URL}/standings/${id}`);
      table.sort(
        (a, b) =>
          b.points - a.points ||
          b.goalDiff - a.goalDiff ||
          b.goalsFor - a.goalsFor
      );
      setStandings(table);

      const bk = await fetchJSON(`${API_URL}/finals/${id}`);
      setBracket(bk);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // inicializar bracket con Top 8
  const initBracket = async () => {
    const top8 = standings.slice(0, 8).map((s) => ({
      _id: s._id,
      name: s.name,
      logo: s.logo || "/default-logo.png",
    }));

    const bk = await fetchJSON(`${API_URL}/finals/init/${selectedTournament}`, {
      method: "POST",
      body: JSON.stringify({ teams: top8 }),
    });
    setBracket(bk);
  };

  // actualizar resultado (solo admin)
  const updateMatch = async (round, index, homeGoals, awayGoals) => {
    const bk = await fetchJSON(
      `${API_URL}/finals/${selectedTournament}/update`,
      {
        method: "POST",
        body: JSON.stringify({ round, index, homeGoals, awayGoals }),
      }
    );
    setBracket(bk);
  };

  const TeamCell = ({ team, goals, editable, onChange }) => (
    <div className="flex flex-col items-center">
      <img
        src={team?.logo || "/default-logo.png"}
        alt={team?.name || "Equipo"}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border object-cover mb-1"
      />
      <span className="text-xs sm:text-sm font-semibold text-center">
        {team?.name || "Equipo"}
      </span>
      {editable ? (
        <input
          type="number"
          className="mt-1 border rounded w-12 text-center text-sm text-black"
          value={goals}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      ) : (
        <span className="font-bold">{goals}</span>
      )}
    </div>
  );

  const MatchCard = ({ round, index, match }) => {
    if (!match?.home || !match?.away) return null;
    const [hg, ag] = match.score || [0, 0];

    return (
      <div className="bg-white shadow rounded-lg p-2 sm:p-3 flex flex-col items-center min-w-[150px]">
        <div className="flex items-center justify-between w-full">
          <TeamCell
            team={match.home}
            goals={hg}
            editable={isAdmin}
            onChange={(val) => updateMatch(round, index, val, ag)}
          />
          <span className="font-bold text-gray-700 text-xs sm:text-base px-2">
            VS
          </span>
          <TeamCell
            team={match.away}
            goals={ag}
            editable={isAdmin}
            onChange={(val) => updateMatch(round, index, hg, val)}
          />
        </div>
        {match.winner && (
          <p className="mt-2 text-xs sm:text-sm font-semibold text-green-600">
            Ganador: {match.winner?.name}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 text-black">
      <h2 className="text-2xl font-bold text-center mb-6">🏆 Ronda Final</h2>

      {/* selector de torneo */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <select
          value={selectedTournament}
          onChange={handleTournamentChange}
          className="border p-2 rounded w-full text-black"
        >
          <option value="">-- Selecciona un torneo --</option>
          {tournaments.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        {isAdmin && selectedTournament && !bracket && standings.length >= 8 && (
          <button
            onClick={initBracket}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Iniciar Bracket con Top 8
          </button>
        )}
      </div>

      {loading && <p className="text-center text-gray-600">Cargando...</p>}

      {/* Bracket estilo Libertadores */}
      {bracket && (
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          {/* Lado Izquierdo */}
          <div className="flex flex-col gap-10">
            <h3 className="text-center font-bold">Lado A</h3>
            {bracket.quarters?.slice(0, 2).map((m, i) => (
              <div key={`qA${i}`} className="bracket-connector-right">
                <MatchCard round="quarters" index={i} match={m} />
              </div>
            ))}
            {bracket.semis?.[0] && (
              <div className="bracket-connector-right-strong">
                <MatchCard round="semis" index={0} match={bracket.semis[0]} />
              </div>
            )}
          </div>

          {/* Final */}
          <div className="flex flex-col justify-center items-center">
            <h3 className="text-center font-bold">Gran Final</h3>
            {bracket.final?.[0] && (
              <MatchCard round="final" index={0} match={bracket.final[0]} />
            )}
          </div>

          {/* Lado Derecho */}
          <div className="flex flex-col gap-10">
            <h3 className="text-center font-bold">Lado B</h3>
            {bracket.quarters?.slice(2, 4).map((m, i) => (
              <div key={`qB${i}`} className="bracket-connector-left">
                <MatchCard round="quarters" index={i + 2} match={m} />
              </div>
            ))}
            {bracket.semis?.[1] && (
              <div className="bracket-connector-left-strong">
                <MatchCard round="semis" index={1} match={bracket.semis[1]} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalsPage;



