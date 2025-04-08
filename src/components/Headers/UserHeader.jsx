import './Headers.css'
import {Link, NavLink, useNavigate} from "react-router-dom";
import logo from '../../assets/ScheveSchilder-logo.svg'
import {useAuth} from "../../context/AuthContext.jsx";

function UserHeader() {

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
                            <NavLink to="/planning"
                                     className={({isActive}) =>
                                         isActive ? 'active-menu-lesplanning' : 'default-menu-link'}
                            >Les Planning</NavLink>
                        </li>
                        <li className="menu-item">
                            <NavLink to="/gallerij"
                                     id="gallerij"
                                     className={({isActive}) =>
                                         isActive ? 'active-menu-gallerij' : 'default-menu-link'}
                            >Gallerij</NavLink>
                        </li>
                        <li className="menu-item">
                            <NavLink to="/settings"
                                     id="settings"
                                     className={({isActive}) =>
                                         isActive ? 'active-menu-settings' : 'default-menu-link'}
                            >Settings</NavLink>
                        </li>
                        <button type="button" className="logout-button" onClick={handleLogout}>Logout</button>
                    </ul>
                </nav>
            </header>
        </>
    );
}

export default UserHeader;
