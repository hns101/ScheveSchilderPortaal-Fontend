import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import UserHeader from '../../components/Headers/UserHeader.jsx';
import AdminHeader from '../../components/Headers/AdminHeader.jsx';
import './NotFound.css'; // We will create this next

function NotFound() {
    const { user } = useAuth();

    // Determine which header to show based on user and role
    const renderHeader = () => {
        if (!user) {
            return null; // No header for logged-out users
        }
        if (user.roles?.includes("ROLE_ADMIN")) {
            return <AdminHeader />;
        }
        return <UserHeader />;
    };

    return (
        <>
            {renderHeader()}
            <div className="not-found-container">
                <div className="not-found-content">
                    <h1>404</h1>
                    <h2>Pagina niet gevonden</h2>
                    <p>Sorry, de pagina die je zoekt bestaat niet of is verplaatst.</p>
                    <Link to={user ? "/planning" : "/login"} className="not-found-button">
                        {user ? "Ga naar Planning" : "Ga naar Login"}
                    </Link>
                </div>
            </div>
        </>
    );
}

export default NotFound;