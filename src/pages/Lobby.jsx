
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Lobby = () => {
  const [lobbyId, setLobbyId] = useState("");
  const navigate = useNavigate();

  const handleStartGame = () => {
    if (lobbyId.trim()) {
      //  Pass lobbyId as state while navigating
      navigate("/game", { state: { lobbyId } });
    } else {
      alert("Please enter a lobby ID.");
    }
  };

  return (
    <>
      <Header />
      <div className="lobby-container ps-4 lobby">
        <h2 className="pb-4">Lobby</h2>
        <input
          className="mb-2"
          type="text"
          placeholder="Enter Lobby ID"
          value={lobbyId}
          onChange={(e) => setLobbyId(e.target.value)}
        />
        <button className="ms-2" onClick={handleStartGame}>Start Game</button>
      </div>
    </>
  );
};

export default Lobby;
