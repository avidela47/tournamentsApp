import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import HomePage from "./pages/HomePage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import PlayerPage from "./pages/PlayerPage.jsx";
import MatchPage from "./pages/MatchPage.jsx";
import TournamentPage from "./pages/TournamentPage.jsx";
import StandingsPage from "./pages/StandingsPage.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teams" element={<TeamPage />} />
          <Route path="/players" element={<PlayerPage />} />
          <Route path="/matches" element={<MatchPage />} />
          <Route path="/tournaments" element={<TournamentPage />} />
          <Route path="/standings" element={<StandingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
