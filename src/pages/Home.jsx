
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleCreateLobby = () => {
    if (!user || !user.username) {
      setShowModal(true); // Show modal if user is not logged in
    } else {
      navigate("/lobby"); // Allow navigation if logged in
    }
  };

  return (
    <>
      <Header user={user} />

      <div className="welcome-container" style={{ textAlign: "center" }}>
        <h1>Hello 👋</h1>
        <h2>Welcome on Doodl</h2>
        <div className="rules">
          <h3>The rules are simple:</h3>
          <ol className="rulesol" style={{ textAlign: "left" }}>
            <li>Every round takes max. 2 minutes</li>
            <li>You need at least 2 players to start the game</li>
            <li>As a painter, you have to draw pictures suggesting the drawn word</li>
            <li>As a viewer, you have to guess the word</li>
          </ol>
          <p>Start Doodling 😁</p>
        </div>
        <button onClick={handleCreateLobby}>Create a room</button>
      </div>

      {/* Modal Popup */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>You need to log in to create a room.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Home;
