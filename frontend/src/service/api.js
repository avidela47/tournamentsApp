// frontend/service/api.js
import axios from "axios";

// ============================
// Configuración base de Axios
// ============================
const API = axios.create({
  baseURL: "http://localhost:5000/api", // ⚠️ Cambiar si usás otro puerto/host
  withCredentials: false,
});

// ============================
// Interceptor para agregar Token
// ============================
API.interceptors.request.use(
  (config) => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const { token } = JSON.parse(storedAuth);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================
// Auth
// ============================
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// ============================
// Torneos
// ============================
export const getTournaments = () => API.get("/tournaments");
export const getTournament = (id) => API.get(`/tournaments/${id}`);
export const createTournament = (data) => API.post("/tournaments", data);
export const updateTournament = (id, data) => API.put(`/tournaments/${id}`, data);
export const deleteTournament = (id) => API.delete(`/tournaments/${id}`);

// ============================
// Equipos
// ============================
export const getTeams = () => API.get("/teams");
export const getTeam = (id) => API.get(`/teams/${id}`);
export const createTeam = (data) => API.post("/teams", data);
export const updateTeam = (id, data) => API.put(`/teams/${id}`, data);
export const deleteTeam = (id) => API.delete(`/teams/${id}`);

// ============================
// Jugadores
// ============================
export const getPlayers = () => API.get("/players");
export const getPlayer = (id) => API.get(`/players/${id}`);
export const createPlayer = (data) => API.post("/players", data);
export const updatePlayer = (id, data) => API.put(`/players/${id}`, data);
export const deletePlayer = (id) => API.delete(`/players/${id}`);

// ============================
// Partidos
// ============================
export const getMatches = () => API.get("/matches");
export const getMatch = (id) => API.get(`/matches/${id}`);
export const createMatch = (data) => API.post("/matches", data);
export const updateMatch = (id, data) => API.put(`/matches/${id}`, data);
export const deleteMatch = (id) => API.delete(`/matches/${id}`);

// ============================
// Tabla de posiciones
// ============================
export const getStandings = (tournamentId) =>
  API.get(`/standings/${tournamentId}`);

export default API;

