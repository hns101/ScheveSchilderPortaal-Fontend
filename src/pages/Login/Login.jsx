import React, { useState } from 'react';
import './Login.css';
import logo from '../../assets/ScheveSchilder-logo.svg';
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth(); // Get login function from AuthContext
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            const response = await login(email, password);// Call login function
            if (response.status === 401) {
                setError("Login mislukt! Controleer je e-mail en wachtwoord.");
            } else {
                navigate('/planning-beheer'); // Try's to direct to admin page, user will be redirected by PrivateRoute
            }

        } catch (err) {
            console.error(err.message);
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <form className="login-form-form" onSubmit={handleSubmit}>
                    <h2 className="login-h2">Login</h2>
                    <p className="login-description">
                        Gebruik het portaal om je lessen te wijzigen en kunstwerken te uploaden.
                    </p>

                    <label className="login-form-label">Email</label>
                    <input
                        className="login-form-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Voer je e-mail in"
                        required
                    />

                    <label className="login-form-label">Wachtwoord</label>
                    <input
                        className="login-form-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Voer je wachtwoord in"
                        required
                    />

                    <button className="login-button" type="submit">
                        Login
                    </button>
                    {error && <p className="error-message">{error}</p>}

                    {/* --- NEW: Forgot Password Link --- */}
                    <div className="forgot-password-container">
                        <Link className="forgot-password-link" to="/forgot-password">Wachtwoord vergeten?</Link>
                    </div>
                </form>
            </div>
            <div className="login-hero">
                <img className="login-logo" src={logo} alt="ScheveSchilder-logo" />
            </div>
        </div>
    );
}

export default Login;