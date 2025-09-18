import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import HomePage from "./pages/HomePage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import PlayerPage from "./pages/PlayerPage.jsx";
import MatchPage from "./pages/MatchPage.jsx";
import TournamentPage from "./pages/TournamentPage.jsx";
import StandingsPage from "./pages/StandingsPage.jsx";
import FinalsPage from "./pages/FinalsPage.jsx"; // ⬅️ agregado

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import Protected from "./components/Protected.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="pt-16">
          <Routes>
            {/* Páginas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Páginas protegidas */}
            <Route
              path="/"
              element={
                <Protected>
                  <HomePage />
                </Protected>
              }
            />
            <Route
              path="/teams"
              element={
                <Protected>
                  <TeamPage />
                </Protected>
              }
            />
            <Route
              path="/players"
              element={
                <Protected>
                  <PlayerPage />
                </Protected>
              }
            />
            <Route
              path="/matches"
              element={
                <Protected>
                  <MatchPage />
                </Protected>
              }
            />
            <Route
              path="/tournaments"
              element={
                <Protected>
                  <TournamentPage />
                </Protected>
              }
            />
            <Route
              path="/standings"
              element={
                <Protected>
                  <StandingsPage />
                </Protected>
              }
            />
            <Route
              path="/finals"
              element={
                <Protected>
                  <FinalsPage />
                </Protected>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
