import './UserSettings.css';
import edit from './../../assets/edit-icon-01.svg';
import { useAuth } from "../../context/AuthContext.jsx";
import useUserSettings from "../../hooks/useUserSettings";
import {useState} from "react";

function UserSettings() {
    const { user } = useAuth();
    const {
        formData,
        loading,
        selectedClassTime,
        newPassword,
        setNewPassword,
        handleChange,
        saveChanges,
        changePassword
    } = useUserSettings(user.email);

    const [editingField, setEditingField] = useState(null);

    if (loading || !formData) return <p className="loading">Loading...</p>;

    const handleSubmit = async () => {
        try {
            if (editingField === "password") {
                await changePassword();
                alert("Wachtwoord succesvol gewijzigd.");
            } else {
                await saveChanges();
                alert("Gegevens succesvol bijgewerkt.");
            }
            setEditingField(null);
        } catch (error) {
            alert("Fout bij opslaan.");
            console.error(error);
        }
    };

    return (
        <main className="user-settings-outer-container">
            <section className="user-settings-container">
                <h3 className="user-settings-header">Account</h3>
                <ul className="user-settings-list">
                    <EditableField
                        label="Voornaam"
                        fieldKey="firstname"
                        value={formData.student.firstname}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                    />
                    <EditableField
                        label="Achternaam"
                        fieldKey="lastname"
                        value={formData.student.lastname}
                        onChange={handleChange}
                        editingField={editingField}
                        setEditingField={setEditingField}
                    />
                    <li className="user-settings-item">
                        <label>Email:</label>
                        <span>{formData.email}</span>
                    </li>
                    <li className="user-settings-item">
                        <label>Wachtwoord:</label>
                        {editingField === "password" ? (
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        ) : (
                            <span>{"*".repeat(8)}</span>
                        )}
                        <img className="icon-edit" src={edit} alt="wijzig" onClick={() => setEditingField("password")} />
                    </li>
                    <li className="user-settings-item">
                        <label>Standaard les moment:</label>
                        <select
                            name="defaultSlot"
                            value={selectedClassTime}
                            onChange={handleChange}
                        >
                            {["Woensdag Avond", "Vrijdag Avond", "Zaterdag Ochtend"].map(slot => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                    </li>
                </ul>
                <button className="save-settings-button" onClick={handleSubmit}>
                    Opslaan
                </button>
            </section>
        </main>
    );
}

function EditableField({ label, fieldKey, value, onChange, editingField, setEditingField }) {
    return (
        <li className="user-settings-item">
            <label>{label}:</label>
            {editingField === fieldKey ? (
                <input type="text" name={fieldKey} value={value} onChange={onChange} />
            ) : (
                <span>{value}</span>
            )}
            <img className="icon-edit" src={edit} alt="wijzig" onClick={() => setEditingField(fieldKey)} />
        </li>
    );
}

export default UserSettings;
