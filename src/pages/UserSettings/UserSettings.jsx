import './UserSettings.css';
import edit from './../../assets/edit-icon-01.svg';
import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import axiosWithAuth from "../../helpers/axiosWithAuth.js"

function UserSettings() {
    const {  user } = useAuth();
    const [formData, setFormData] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [selectedClassTime, setSelectedClassTime] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosWithAuth().get(`http://localhost:8080/users/${user.email}`);
                setFormData(response.data);
                setSelectedClassTime(response.data.student.defaultSlot);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [user.email]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "defaultSlot") {
            setSelectedClassTime(value);
        }
        setFormData(prev => ({
            ...prev,
            student: {
                ...prev.student,
                [name]: value
            }
        }));
    };

    const handleSaveChanges = async () => {
        try {
            await axiosWithAuth().put(`http://localhost:8080/users/${user.email}`, formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            alert("Gegevens succesvol bijgewerkt.");
            setEditingField(null);
        } catch (error) {
            console.error("Update failed", error);
            alert("Fout bij opslaan van wijzigingen.");
        }
    };


    const handlePasswordChange = async () => {
        try {
            await axiosWithAuth().put(`http://localhost:8080/users/${user.email}/password`, { newPassword });
            alert("Wachtwoord succesvol gewijzigd.");
            setNewPassword("");
            setEditingField(null);
        } catch (error) {
            console.error("Password update failed", error);
            alert("Fout bij wachtwoord wijzigen.");
        }
    };

    if (!formData) return <p className="loading">Loading...</p>;

    return (
        <main className="user-settings-outer-container">
            <section className="user-settings-container">
                <h3 className="user-settings-header">Account</h3>
                <ul className="user-settings-list">
                    <li className="user-settings-item">
                        <label>Voornaam:</label>
                        {editingField === "firstname" ? (
                            <input type="text" name="firstname" value={formData.student.firstname}
                                   onChange={handleInputChange}/>
                        ) : (
                            <span>{formData.student.firstname}</span>
                        )}
                        <img className="icon-edit" src={edit} alt="wijzig"
                             onClick={() => setEditingField("firstname")}/>
                    </li>
                    <li className="user-settings-item">
                        <label>Achternaam:</label>
                        {editingField === "lastname" ? (
                            <input type="text" name="lastname" value={formData.student.lastname}
                                   onChange={handleInputChange}/>
                        ) : (
                            <span>{formData.student.lastname}</span>
                        )}
                        <img className="icon-edit" src={edit} alt="wijzig" onClick={() => setEditingField("lastname")}/>
                    </li>
                    <li className="user-settings-item">
                        <label>Email:</label>
                        <span>{formData.email}</span>
                    </li>
                    <li className="user-settings-item">
                        <label>Wachtwoord:</label>
                        {editingField === "password" ? (
                            <input type="password" value={newPassword}
                                   onChange={(e) => setNewPassword(e.target.value)}/>
                        ) : (
                            <span>{"*".repeat(8)}</span>
                        )}
                        <img className="icon-edit" src={edit} alt="wijzig" onClick={() => setEditingField("password")}/>
                    </li>
                    <li className="user-settings-item">
                        <label>Standaard les moment:</label>
                        <select
                            name="defaultSlot"
                            value={selectedClassTime}
                            onChange={handleInputChange}
                        >
                            <option value="Woensdag Avond">Woensdag Avond</option>
                            <option value="Vrijdag Avond">Vrijdag Avond</option>
                            <option value="Zaterdag Ochtend">Zaterdag Ochtend</option>
                        </select>
                    </li>
                </ul>
                <button className="save-settings-button"
                        onClick={editingField === "password" ? handlePasswordChange : handleSaveChanges}>
                    Opslaan
                </button>
            </section>
        </main>
    );
}

export default UserSettings;
