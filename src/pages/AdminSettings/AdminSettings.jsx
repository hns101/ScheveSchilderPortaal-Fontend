import React from 'react';
import './AdminSettings.css'
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";

function AdminSettings() {

    const handleLogout = () => {
        logout();  // Call logout from AuthContext
        navigate('/login'); // Redirect to login page
    };

    const navigate = useNavigate();
    const { logout } = useAuth(); // Get logout function

    return (
        <>
            <button type="button" className="logout-button" onClick={handleLogout}>
                Logout
            </button>

        </>
    );
}

export default AdminSettings;