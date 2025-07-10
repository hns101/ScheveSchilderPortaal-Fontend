import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/api.js';
import './ResetPassword.css';
import logo from '../../assets/ScheveSchilder-logo.svg';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // --- NEW: Client-side validation checks ---
        if (password.length < 8) {
            setError('Wachtwoord moet minimaal 8 tekens lang zijn.');
            return; // Stop the submission
        }

        if (password !== confirmPassword) {
            setError('Wachtwoorden komen niet overeen.');
            return; // Stop the submission
        }

        setLoading(true);

        try {
            const response = await apiClient.post('/api/auth/reset-password', {
                token: token,
                newPassword: password
            });
            setMessage(response.data);
            setIsSuccess(true);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Er is iets misgegaan. De link is mogelijk verlopen of ongeldig.');
            }
            console.error("Reset Password error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-form">
                {isSuccess ? (
                    <div className="reset-password-form-form">
                        <h2 className="reset-password-h2">Succes!</h2>
                        <p className="success-message">{message}</p>
                        <Link to="/login" className="reset-password-button success-button">
                            Ga naar Login
                        </Link>
                    </div>
                ) : (
                    <form className="reset-password-form-form" onSubmit={handleSubmit}>
                        <h2 className="reset-password-h2">Wachtwoord opnieuw instellen</h2>
                        <p className="reset-password-description">
                            Voer een nieuw wachtwoord in voor je account.
                        </p>

                        <label className="reset-password-form-label">Nieuw wachtwoord</label>
                        <input
                            className="reset-password-form-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimaal 8 tekens"
                            required
                            minLength="8" // Standard HTML validation
                        />

                        <label className="reset-password-form-label">Bevestig wachtwoord</label>
                        <input
                            className="reset-password-form-input"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Bevestig nieuw wachtwoord"
                            required
                            minLength="8" // Standard HTML validation
                        />

                        <button className="reset-password-button" type="submit" disabled={loading}>
                            {loading ? 'Bezig...' : 'Wachtwoord bijwerken'}
                        </button>

                        {error && <p className="error-message">{error}</p>}
                    </form>
                )}
            </div>
            <div className="reset-password-hero">
                <img className="reset-password-logo" src={logo} alt="ScheveSchilder-logo" />
            </div>
        </div>
    );
}

export default ResetPassword;