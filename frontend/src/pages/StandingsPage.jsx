import React, { useEffect, useMemo, useState } from "react";
import StandingsTable from "../components/StandingsTable";

const StandingsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [standings, setStandings] = useState([]);
  const [cardsSummary, setCardsSummary] = useState({ yellow: 0, red: 0 });
  const [loading, setLoading] = useState(false);

  // -------------------------
  // 🔹 Fetch helper
  // -------------------------
  const fetchJSON = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status} en ${url}`);
    return res.json();
  };

  // -------------------------
  // 🔹 Cargar torneos
  // -------------------------
  useEffect(() => {
    (async () => {
      try {
        // ⚠️ Usa la ruta que tengas en tu backend: 
        // si en tu server.js pusiste app.use("/api/tournaments", tournamentRoutes),
        // entonces esta URL es correcta.
        const data = await fetchJSON("http://localhost:5000/api/tournaments");
        setTournaments(data || []);

        if (data?.length) {
          setSelectedTournament(data[0]._id || data[0].id);
        }
      } catch (e) {
        console.error("Error cargando torneos:", e);
      }
    })();
  }, []);

  // -------------------------
  // 🔹 Cargar standings + tarjetas
  // -------------------------
  useEffect(() => {
    if (!selectedTournament) return;

    (async () => {
      setLoading(true);
      try {
        const tabla = await fetchJSON(
          `http://localhost:5000/api/standings/${selectedTournament}`
        );

        const normalizados =
          (tabla || []).map((t) => ({
            teamId: t.teamId || t.team?._id || t._id || t.id,
            team: t.team?.name || t.name || "Equipo",
            logo: t.team?.logo || t.logo || "",
            played: t.played ?? 0,
            wins: t.wins ?? 0,
            draws: t.draws ?? 0,
            losses: t.losses ?? 0,
            goalsFor: t.goalsFor ?? 0,
            goalsAgainst: t.goalsAgainst ?? 0,
            goalDiff: (t.goalsFor ?? 0) - (t.goalsAgainst ?? 0),
            points: t.points ?? 0,
          })) ?? [];

        normalizados.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
          return (b.goalsFor || 0) - (a.goalsFor || 0);
        });

        setStandings(normalizados);

        // Tarjetas
        const stats = await fetchJSON(
          `http://localhost:5000/api/stats?tournamentId=${selectedTournament}`
        );
        const yellow =
          stats?.filter((s) => s.type === "yellow" || s.card === "yellow")
            ?.length || 0;
        const red =
          stats?.filter((s) => s.type === "red" || s.card === "red")?.length ||
          0;

        setCardsSummary({ yellow, red });
      } catch (e) {
        console.error("Error cargando standings/stats:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedTournament]);

  const selectedName = useMemo(
    () =>
      tournaments.find((t) => (t._id || t.id) === selectedTournament)?.name ||
      "",
    [tournaments, selectedTournament]
  );

  return (
    <div className="w-full">
      {/* 🔹 Selector de torneo */}
      <div className="w-full max-w-xl mx-auto mt-6 px-4">
        <select
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(e.target.value)}
          className="w-full bg-white text-black border border-gray-300 rounded-xl px-4 py-3 shadow-sm outline-none"
        >
          <option value="">Seleccionar torneo</option>
          {tournaments.map((t) => (
            <option key={t._id || t.id} value={t._id || t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Card: Tabla de posiciones */}
      <section className="w-full max-w-6xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-black text-center mb-4">
            📊 Tabla de Posiciones
          </h2>

          {loading ? (
            <p className="text-center text-gray-600 py-6">Cargando…</p>
          ) : (
            <StandingsTable standings={standings} />
          )}
        </div>
      </section>

      {/* 🔹 Card: Tarjetas */}
      <section className="w-full max-w-4xl mx-auto mt-8 px-4 mb-10">
        <div className="bg-white rounded-2xl shadow-xl p-5">
          <h3 className="text-xl md:text-2xl font-extrabold text-black mb-3">
            🟨🟥 Tarjetas del Torneo
          </h3>

          <div className="space-y-2 text-black">
            <div className="flex items-center justify-between bg-yellow-50 rounded-lg px-4 py-2 ring-1 ring-yellow-100">
              <span className="font-semibold">
                Total jugadores con amarillas:
              </span>
              <span className="font-bold text-yellow-600">
                {cardsSummary.yellow}
              </span>
            </div>

            <div className="flex items-center justify-between bg-red-50 rounded-lg px-4 py-2 ring-1 ring-red-100">
              <span className="font-semibold">Total jugadores con rojas:</span>
              <span className="font-bold text-red-600">
                {cardsSummary.red}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StandingsPage;







