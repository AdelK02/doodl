
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            const endpoint = isLogin ? "login" : "register";
            const payload = isLogin ? { email, password } : { username, email, password };

            // const response = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, payload);
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/${endpoint}`, payload);


            if (isLogin) {
                const { token, username } = response.data;  //  Extract username from response
                localStorage.setItem("token", token);
                localStorage.setItem("username", username); //  Store username in localStorage
                console.log("Login successful - Stored in localStorage:", { token, username });
                setUser({ username }); //  Update user state in App.jsx
                navigate("/");
            }
            else {
                alert("Registration successful! Please log in.");
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <div className="container">
            <div className="header card">
                <h2 className="mb-3">{isLogin ? "Login" : "Sign Up"}</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input 
                            className="inpfield mb-3"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    )}
                    <input
                        className="inpfield mb-3"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="inpfield mb-3"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="mb-3" type="submit">{isLogin ? "Login" : "Sign Up"}</button>
                </form>

                <p onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "New user? Sign up here" : "Already have an account? Login"}
                </p>
            </div>
        </div>
    );
};

export default Login;


