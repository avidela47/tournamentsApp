import axios from "axios";

// Configuración base de la API
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

/* ============================
   📌 EQUIPOS
============================ */
export const getTeams = () => API.get("/teams");
export const getTeam = (id) => API.get(`/teams/${id}`);
export const createTeam = (data) => API.post("/teams", data);
export const updateTeam = (id, data) => API.put(`/teams/${id}`, data);
export const deleteTeam = (id) => API.delete(`/teams/${id}`);

/* ============================
   📌 JUGADORES
============================ */
export const getPlayers = () => API.get("/players");
export const getPlayer = (id) => API.get(`/players/${id}`);
export const createPlayer = (data) => API.post("/players", data);
export const updatePlayer = (id, data) => API.put(`/players/${id}`, data);
export const deletePlayer = (id) => API.delete(`/players/${id}`);

/* ============================
   📌 PARTIDOS
============================ */
export const getMatches = () => API.get("/matches");
export const getMatch = (id) => API.get(`/matches/${id}`);
export const createMatch = (data) => API.post("/matches", data);
export const updateMatch = (id, data) => API.put(`/matches/${id}`, data);
export const deleteMatch = (id) => API.delete(`/matches/${id}`);

/* ============================
   📌 TORNEOS
============================ */
export const getTournaments = () => API.get("/tournaments");
export const getTournament = (id) => API.get(`/tournaments/${id}`);
export const createTournament = (data) => API.post("/tournaments", data);
export const updateTournament = (id, data) => API.put(`/tournaments/${id}`, data);
export const deleteTournament = (id) => API.delete(`/tournaments/${id}`);

