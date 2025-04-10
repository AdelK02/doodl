import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Lobby from "./pages/Lobby.jsx";
import Game from "./pages/Game.jsx";
import Home from "./pages/Home.jsx";
import Login from "./components/Login.jsx";
import Header from "./components/Header.jsx";

function App() {
  const [user, setUser] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
  
    console.log("App useEffect triggered - Loaded from localStorage:", { token, username });
  
    if (token && username) {
      setUser({ username });  //  Directly set user state
    } else {
      setUser(null);
    }
  }, []);
  

  // Function to handle logout
  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/" element={<Home user={user}/>} />

        {/* Protect lobby and game routes */}
        <Route path="/lobby" element={user ? <Lobby user={user} /> : <Navigate to="/login" />} />
        <Route path="/game" element={user ? <Game user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
