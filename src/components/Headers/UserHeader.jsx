import './Headers.css'
import {Link, NavLink} from "react-router-dom";
import logo from '../../assets/ScheveSchilder-logo.svg'

function UserHeader() {
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
                    </ul>
                </nav>
            </header>
        </>
    );
}

export default UserHeader;
