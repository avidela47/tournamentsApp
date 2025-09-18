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
      <span className="text-xs sm:text-sm font-semibold text-center text-black">
        {team?.name || "EQUIPO"}
      </span>
      {editable ? (
        <input
          type="number"
          className="mt-1 border rounded w-12 text-center text-sm text-black"
          value={goals}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      ) : (
        <span className="font-bold text-black">{goals}</span>
      )}
    </div>
  );

  const MatchCard = ({ round, index, match, side, final = false }) => {
    if (!match?.home || !match?.away) return null;
    const [hg, ag] = match.score || [0, 0];

    return (
      <div
        className={`match-card relative ${
          final
            ? "bracket-connector-final"
            : side === "left"
            ? "bracket-connector-right"
            : "bracket-connector-left"
        }`}
      >
        <div className="bg-white shadow rounded-lg p-2 sm:p-3 flex flex-col items-center min-w-[160px]">
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
            <p className="mt-2 text-xs sm:text-sm font-bold text-green-600">
              GANADOR: {match.winner?.name}
            </p>
          )}
        </div>
      </div>
    );
  };

  // obtener campeón
  const champion = bracket?.final?.[0]?.winner;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        🏆 RONDA FINAL
      </h2>

      {/* selector de torneo */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <select
          value={selectedTournament}
          onChange={handleTournamentChange}
          className="border p-2 rounded w-full text-black"
        >
          <option value="">-- SELECCIONA UN TORNEO --</option>
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
            INICIAR BRACKET CON TOP 8
          </button>
        )}
      </div>

      {loading && <p className="text-center text-gray-600">CARGANDO...</p>}

      {/* Bracket en árbol */}
      {bracket && (
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          {/* Lado A */}
          <div className="flex flex-col gap-10 items-center">
            <h3 className="text-center font-bold text-white mb-2">LADO A</h3>
            <h4 className="text-sm font-bold text-white mb-2">CUARTOS</h4>
            {bracket.quarters?.slice(0, 2).map((m, i) => (
              <MatchCard
                key={`qA${i}`}
                round="quarters"
                index={i}
                match={m}
                side="left"
              />
            ))}
            <h4 className="text-sm font-bold text-white mt-6">SEMIFINAL</h4>
            {bracket.semis?.[0] && (
              <MatchCard
                round="semis"
                index={0}
                match={bracket.semis[0]}
                side="left"
              />
            )}
          </div>

          {/* Final */}
<div className="flex flex-col items-center justify-center relative">
  <h3 className="text-center font-bold mb-2 text-white">GRAN FINAL</h3>
  {bracket.final?.[0] && (
    <div className="match-card bracket-connector-final">
      {/* Línea vertical izquierda */}
      <div className="final-vertical-left"></div>

      <MatchCard
        round="final"
        index={0}
        match={bracket.final[0]}
        final={true}
      />

      {/* Línea vertical derecha */}
      <div className="final-vertical-right"></div>
    </div>
  )}

  {champion && (
    <div className="mt-6 bg-white shadow-lg rounded-lg p-4 flex flex-col items-center w-60 relative">
      <img
        src={champion.logo || "/default-logo.png"}
        alt={champion.name}
        className="w-20 h-20 rounded-full border object-cover mb-3"
      />
      <h4 className="font-bold text-lg text-yellow-600 text-center">
        🏆 CAMPEÓN
      </h4>
      <p className="text-black font-semibold">{champion.name}</p>
      <img
        src="/trophy.png"
        alt="Trofeo"
        className="w-16 h-16 mt-3"
        onError={(e) => (e.target.style.display = "none")}
      />

      {/* unión central */}
      <div className="champion-connector"></div>
    </div>
  )}
</div>

          {/* Lado B */}
          <div className="flex flex-col gap-10 items-center">
            <h3 className="text-center font-bold text-white mb-2">LADO B</h3>
            <h4 className="text-sm font-bold text-white mb-2">CUARTOS</h4>
            {bracket.quarters?.slice(2, 4).map((m, i) => (
              <MatchCard
                key={`qB${i}`}
                round="quarters"
                index={i + 2}
                match={m}
                side="right"
              />
            ))}
            <h4 className="text-sm font-bold text-white mt-6">SEMIFINAL</h4>
            {bracket.semis?.[1] && (
              <MatchCard
                round="semis"
                index={1}
                match={bracket.semis[1]}
                side="right"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalsPage;
