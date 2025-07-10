import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';
import logo from '../../assets/ScheveSchilder-logo.svg';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { token } = useParams(); // Get the token from the URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Wachtwoorden komen niet overeen.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/auth/reset-password', {
                token: token,
                newPassword: password
            });
            setMessage(response.data);
            setIsSuccess(true); // Set success state to change the view
        } catch (err) {
            setError(err.response?.data || 'Er is iets misgegaan. De link is mogelijk verlopen of ongeldig.');
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
                            placeholder="Voer nieuw wachtwoord in"
                            required
                        />

                        <label className="reset-password-form-label">Bevestig wachtwoord</label>
                        <input
                            className="reset-password-form-input"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Bevestig nieuw wachtwoord"
                            required
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