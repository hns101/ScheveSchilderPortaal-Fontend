import React, { useState } from 'react';
import './Login.css';
import logo from '../../assets/ScheveSchilder-logo.svg';
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // This will now only handle the success case
            await login(email, password);
            navigate('/planning-beheer'); // Redirect on successful login

        } catch (err) {
            // All errors are now caught here. We check the error object for details.
            if (err.response && err.response.status === 401) {
                // If the error has a response object with status 401, it's a failed login
                setError("Login mislukt! Controleer je e-mail en wachtwoord.");
            } else {
                // For any other errors (network issues, server down, etc.)
                console.error("An unexpected error occurred:", err.message);
                setError("Er is een onverwachte fout opgetreden. Probeer het later opnieuw.");
            }
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

                    <div className="forgot-password-container-link">
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
