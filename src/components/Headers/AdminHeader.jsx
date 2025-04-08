import React from 'react';
import './Headers.css'
import logo from "../../assets/ScheveSchilder-logo.svg";
import {NavLink, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";

function AdminHeader() {

    const handleLogout = () => {
        logout();  // Call logout from AuthContext
        navigate('/login'); // Redirect to login page
    };

    const navigate = useNavigate();
    const { logout } = useAuth(); // Get logout function

    return (
        <>
            <header className="header">
                <img className="header-logo" src={logo} alt="ScheveSchilder-logo"/>
                <nav className="header-nav">
                    <ul className="menu-list">
                        <li className="menu-item">
                            <NavLink to="/planning-beheer"
                                     className={({isActive}) =>
                                         isActive ? 'active-menu-lesbeheer' : 'default-menu-link'}
                            >Les beheer</NavLink>
                        </li>
                        <li className="menu-item">
                            <NavLink to="/gallerij-beheer"
                                     id="gallerij-beheer"
                                     className={({isActive}) =>
                                         isActive ? 'active-menu-admin-gallerij' : 'default-menu-link'}
                            >Gallerij beheer</NavLink>
                        </li>
                        <li className="menu-item">
                            <NavLink to="/account-beheer"
                                     id="account-beheer"
                                     className={({isActive}) =>
                                         isActive ? 'active-menu-account-beheer' : 'default-menu-link'}
                            >Account beheer</NavLink>
                        </li>
                        <button type="button" className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </ul>
                </nav>
            </header>


        </>
    );
}

export default AdminHeader;