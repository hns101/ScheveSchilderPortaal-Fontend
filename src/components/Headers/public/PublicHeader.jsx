import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/ScheveSchilder-logo.svg'; // Assuming this is the correct path to your logo
import './PublicHeader.css'; // We'll create this next

function PublicHeader() {
    return (
        <header className="public-header">
            <div className="public-header-content">

                <a
                    href="https://www.scheveschilder.nl/"
                    className="external-site-link"
                    // target="_blank"
                    // rel="noopener noreferrer"
                >
                    <img src={logo} alt="ScheveSchilder Logo" className="public-header-logo"/>
                </a>
            </div>
        </header>
    );
}

export default PublicHeader;