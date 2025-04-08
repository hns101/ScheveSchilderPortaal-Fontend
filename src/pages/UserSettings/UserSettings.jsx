import './UserSettings.css';
import edit from './../../assets/edit-icon-01.svg';
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import {useState} from "react";

function UserSettings({ user }) {
    const navigate = useNavigate();
    const { logout } = useAuth(); // Get logout function
    const [selectedClassTime, setSelectedClassTime] = useState(user.defaultClassTime || "Woensdag Avond"); // Default value

    const handleClassTimeChange = (event) => {
        setSelectedClassTime(event.target.value);
    };

    const handleLogout = () => {
        logout();  // Call logout from AuthContext
        navigate('/login'); // Redirect to login page
    };

    return (
        <>
            <main className="user-settings-outer-container">
                <section className="user-settings-container">
                    <button type="button" className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                    <h3 className="user-settings-header">Account</h3>
                    <ul className="user-settings-list">
                        <li className="user-settings-item">
                            <p><label>Voornaam : </label>{user.firstname}</p>
                            <img className="icon-edit" src={edit} alt="wijzig"/>
                        </li>
                        <li className="user-settings-item">
                            <p><label>Achternaam : </label>{user.lastname}</p>
                            <img className="icon-edit" src={edit} alt="wijzig"/>
                        </li>
                        <li className="user-settings-item">
                            <p><label>Email : </label>{user.email}</p>
                            <img className="icon-edit" src={edit} alt="wijzig"/>
                        </li>
                        <li className="user-settings-item">
                            <p><label>Password : </label>{"*".repeat(8)}</p> {/* Hide actual password */}
                            <img className="icon-edit" src={edit} alt="wijzig"/>
                        </li>
                        <li className="user-settings-item">
                            <label>Standaard les moment : </label>
                            <select name="Default-class" id="Default-class" value={selectedClassTime}
                                    onChange={handleClassTimeChange}>
                                <option value="Woensdag Avond">Woensdag Avond</option>
                                <option value="Vrijdag Avond">Vrijdag Avond</option>
                                <option value="Zaterdag Ochtend">Zaterdag Ochtend</option>
                            </select>
                        </li>
                    </ul>
                </section>

            </main>
        </>
    );
}

export default UserSettings;
