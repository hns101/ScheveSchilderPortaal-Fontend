import React from 'react';
import './AdminHeader.css'
import logo from "../../assets/ScheveSchilder-logo.svg";
import {NavLink} from "react-router-dom";

function AdminHeader() {
    return (
        <>
            <header className="admin-header">
                <img className="header-logo" src={logo} alt="ScheveSchilder-logo"/>
                <nav className="admin-header-nav">
                    <ul className="menu-list">
                        <li className="menu-item">
                            <NavLink to="/"
                                     className={({isActive}) =>
                                         isActive ? 'active-menu-lesbeheer' : 'default-menu-link'}
                            >Les beheer</NavLink>
                        </li>
                        <li className="menu-item">
                            <NavLink to="/gallerij-beheer"
                                     id="gallerij-beheer"
                                     className={({isActive}) =>
                                         isActive ? 'active-menu-gallerij' : 'default-menu-link'}
                            >Gallerij beheer</NavLink>
                        </li>
                        <li className="menu-item">
                            <NavLink to="/account-beheer"
                                     id="account-beheer"
                                     className={({isActive}) =>
                                         isActive ? 'active-menu-account-beheer' : 'default-menu-link'}
                            >Account beheer</NavLink>
                        </li>
                        <li className="menu-item">
                            <NavLink to="/settings"
                                     id="settings"
                                     className={({isActive}) =>
                                         isActive ? 'active-menu-settings' : 'default-menu-link'}
                            >Settings</NavLink>
                        </li>
                    </ul>
                </nav>
            </header>


        </>
    );
}

export default AdminHeader;