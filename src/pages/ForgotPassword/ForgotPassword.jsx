import React, { useState } from 'react';
// 1. CHANGE THIS: Import our new public apiClient instead of the default axios
import { apiClient } from '../../api/api.js';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';
import logo from '../../assets/ScheveSchilder-logo.svg';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            // 2. CHANGE THIS: Use the clean apiClient for the request
            const response = await apiClient.post('/api/auth/forgot-password', {
                email: email
            });
            setMessage(response.data); // Display the success message from the backend
        } catch (err) {
            setError('Er is iets misgegaan. Probeer het later opnieuw.');
            console.error("Forgot Password error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form">
                <form className="forgot-password-form-form" onSubmit={handleSubmit}>
                    <h2 className="forgot-password-h2">Wachtwoord vergeten</h2>
                    <p className="forgot-password-description">
                        Voer je e-mailadres in om een link voor het opnieuw instellen van je wachtwoord te ontvangen.
                    </p>

                    <label className="forgot-password-form-label">Email</label>
                    <input
                        className="forgot-password-form-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Voer je e-mail in"
                        required
                    />

                    <button className="forgot-password-button" type="submit" disabled={loading}>
                        {loading ? 'Bezig met verzenden...' : 'Verstuur herstellink'}
                    </button>

                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}

                    <div className="back-to-login-container">
                        <Link className="back-to-login-container-link" to="/login">Terug naar Login</Link>
                    </div>
                </form>
            </div>
            <div className="forgot-password-hero">
                <img className="forgot-password-logo" src={logo} alt="ScheveSchilder-logo" />
            </div>
        </div>
    );
}

export default ForgotPassword;