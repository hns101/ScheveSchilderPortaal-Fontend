import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './NotFound.css';

function NotFound() {
    const { user } = useAuth();

    // The MainLayout component now handles the header.
    // This component only needs to display the 404 content.

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1>404</h1>
                <h2>Pagina niet gevonden</h2>
                <p>Sorry, de pagina die je zoekt bestaat niet of is verplaatst.</p>
                {/* The link destination depends on whether the user is logged in or not */}
                <Link to={user ? "/planning" : "/login"} className="not-found-button">
                    {user ? "Ga naar je Planning" : "Ga naar Login"}
                </Link>
            </div>
        </div>
    );
}

export default NotFound;