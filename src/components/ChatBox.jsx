import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://doodlebackend-fw0e.onrender.com"); //Use Socket.IO

export default function ChatBox({user,lobbyId}) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        //Listen for messages from the server
        socket.on("receive-message", (message) => {
            console.log("Message recieved from server:",message);
            
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off("receive-message"); //Cleanup listener
        };
    }, []);

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (input.trim()) {
    //         const message = { text: input, sender: "user" };

    //         // Send message via Socket.IO
    //         socket.emit("send-message", message);

    //         //Update local message list
    //         setMessages((prevMessages) => [...prevMessages, message]);
    //         setInput("");
    //     }
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()&& lobbyId) {
            const message = { 
                text: input, 
                sender: user?.username || "Anonymous",  // Attach the logged-in username
                lobbyId
            };

            console.log("Sending message:",message);
            
            // Send message via WebSocket
            socket.emit("send-message", message);
    
            // Update local message list
            // setMessages((prevMessages) => [...prevMessages, message]);
            setInput("");
        }
    };
    

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender}>
                        <strong className="text-success">{msg.sender}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
