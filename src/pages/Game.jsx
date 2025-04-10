import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import ChatBox from "../components/ChatBox";
import Header from "../components/Header";
import { Modal, Button } from "react-bootstrap";

const socket = io.connect("https://doodlebackend-fw0e.onrender.com");

const animalWords = [
  "sun", "moon", "star", "cloud", "rain", "snow", "tree", "flower", "leaf", "mountain",
  "house", "car", "bus", "boat", "airplane", "train", "ball", "book", "phone", "clock",
  "cat", "dog", "fish", "bird", "elephant", "giraffe", "rabbit", "turtle", "snake", "kangaroo",
  "apple", "banana", "pizza", "icecream", "cake", "burger", "bread", "egg", "carrot", "watermelon",
  "chair", "table", "pen", "cup", "hat", "shoe", "key", "door", "ladder", "lamp"
];


const Game = ({ user }) => {
  console.log("Game received user", user);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const { state } = useLocation();
  const lobbyId = state?.lobbyId || "default-room";

  const [drawing, setDrawing] = useState(false);
  const [players, setPlayers] = useState([]);
  const [drawer, setDrawer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [wordOptions, setWordOptions] = useState([]); // Store word choices
  const [selectedWord, setSelectedWord] = useState(""); // Store chosen word
  const [showModal, setShowModal] = useState(false); // Control popup visibility
  const [winner, setWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);


  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;

    canvas.width = parent.clientWidth * 2;
    canvas.height = parent.clientHeight * 2;
    canvas.style.width = `${parent.clientWidth}px`;
    canvas.style.height = `${parent.clientHeight}px`;
    canvas.style.border = "3px solid black";

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;

    if (!socket.hasJoined) {
      socket.emit("join-lobby", { lobbyId, username: user.username });
      socket.hasJoined = true;
    }

    socket.on("update-players", (playersList) => {
      setPlayers(playersList);
    });

    socket.on("start-round", ({ drawer }) => {
      setDrawer(drawer);
      setTimeLeft(120);

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      if (socket.id === drawer) {
        // Generate 3 random animal words for the drawer
        const randomWords = animalWords.sort(() => 0.5 - Math.random()).slice(0, 3);
        setWordOptions(randomWords);
        setShowModal(true); // Show word selection popup
      }
    });

    socket.on("update-timer", (time) => {
      console.log(`⏳ Timer updated to: ${time}`);
      setTimeLeft(time);
    });

    socket.on("choose-word", (word) => {
      setSelectedWord(word);
    });

    socket.on("start-drawing", ({ x, y }) => {
      contextRef.current.beginPath();
      contextRef.current.moveTo(x * canvas.width, y * canvas.height);
    });

    socket.on("drawing", ({ x, y }) => {
      contextRef.current.lineTo(x * canvas.width, y * canvas.height);
      contextRef.current.stroke();
    });

    socket.on("winner-announced", ({ winner, word }) => {
      console.log(`🏆 Winner received on frontend: ${winner} guessed "${word}"`);
      setWinner({ name: winner, word });
      setShowWinnerModal(true);
    });

    return () => {
      socket.off("update-players");
      socket.off("start-round");
      socket.off("update-timer");
      socket.off("choose-word");
      socket.off("start-drawing");
      socket.off("drawing");
      socket.off("winner-announced");
    };
  }, []);

  const handleWordSelect = (word) => {
    setSelectedWord(word);
    setShowModal(false);
    socket.emit("choose-word", { lobbyId, word });

    // Start the timer only after the word is chosen
    socket.emit("start-timer", { lobbyId });
  };

  const startDrawing = ({ nativeEvent }) => {
    if (socket.id !== drawer) return;

    setDrawing(true);
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);

    socket.emit("start-drawing", {
      lobbyId,
      x: offsetX / canvasRef.current.width,
      y: offsetY / canvasRef.current.height,
    });
  };

  const stopDrawing = () => {
    setDrawing(false);
    contextRef.current.closePath();
  };

  const drawOnCanvas = (x, y) => {
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  let lastEmit = 0;
  const draw = ({ nativeEvent }) => {
    if (!drawing || socket.id !== drawer) return;

    const { offsetX, offsetY } = nativeEvent;
    drawOnCanvas(offsetX, offsetY);

    const now = Date.now();
    if (now - lastEmit > 50) {
      socket.emit("drawing", {
        lobbyId,
        x: offsetX / canvasRef.current.width,
        y: offsetY / canvasRef.current.height,
      });
      lastEmit = now;
    }
  };

  return (
    <>
      <Header />
      <div className="game-container row" style={{ paddingTop: "100px" }}>
        <div>
          <h2>Lobby: {lobbyId}</h2>
          <h4>Time Left: {timeLeft}s</h4>
          <h5>Current Drawer: {players.find((p) => p.id === drawer)?.username || "Waiting..."}</h5>
          {socket.id === drawer && <h3>Your Word: {selectedWord || "Choosing..."}</h3>}
        </div>
        <div className="col-lg-8">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            onMouseOut={stopDrawing}
          ></canvas>
        </div>
        <div className="col-lg-2">
          <h2>Chat</h2>
          <ChatBox user={user} lobbyId={lobbyId}/>
        </div>
        <div className="col-lg-2">
          <h2>Players</h2>
          <ul>
            {players.map((player) => (
              <li key={player.id} style={{ fontWeight: player.id === drawer ? "bold" : "normal" }}>
                {player.username} {player.id === drawer ? "(Drawing)" : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Word Selection Popup for Drawer */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Choose a Word</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Select one word to draw:</p>
          <div className="d-flex justify-content-around">
            {wordOptions.map((word) => (
              <Button key={word} variant="primary" onClick={() => handleWordSelect(word)}>
                {word}
              </Button>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      {/* Winner Announcement Modal */}
      <Modal show={showWinnerModal} onHide={() => setShowWinnerModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>We Have a Winner! 🎉</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>{winner?.name} guessed the correct word!</h4>
          <p>The word was: <strong>{winner?.word}</strong></p>
          <p>click ok and wait for a few seconds</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowWinnerModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default Game;
