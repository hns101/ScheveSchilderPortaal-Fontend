import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/ScheveSchilder-logo.svg'; // Assuming this is the correct path to your logo
import './PublicHeader.css'; // We'll create this next

function PublicHeader() {
    return (
        <header className="public-header">
            <div className="public-header-content">
                <Link to="/galleries">
                    <img src={logo} alt="ScheveSchilder Logo" className="public-header-logo" />
                </Link>
            </div>
        </header>
    );
}

export default PublicHeader;