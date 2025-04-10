import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminAcountManager.css';

function AdminAcountManager() {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [editingUser, setEditingUser] = useState(null); // popup state
    const SLOT_OPTIONS = ["Woensdag Avond", "Vrijdag Avond", "Zaterdag Ochtend"];
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUserData, setNewUserData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        defaultSlot: SLOT_OPTIONS[0]
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/users");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                setErrorMessage("Kon gebruikers niet ophalen.");
            }
        };
        fetchUsers();
    }, []);

    const handlePasswordChange = async () => {
        try {
            await axios.put(`http://localhost:8080/users/${editingUser.email}/password`, {
                newPassword
            });
            alert("Wachtwoord succesvol gewijzigd.");
            setShowPasswordModal(false);
            setNewPassword("");
        } catch (error) {
            console.error("Error changing password", error);
            alert("Fout bij het wijzigen van wachtwoord.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("student.")) {
            const key = name.split(".")[1];
            setEditingUser((prev) => ({
                ...prev,
                student: { ...prev.student, [key]: value }
            }));
        } else if (name === "roles") {
            setEditingUser((prev) => ({
                ...prev,
                roles: value.split(",").map(role => role.trim())
            }));
        } else {
            setEditingUser((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const saveUserChanges = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/users/${editingUser.email}`, editingUser, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.status === 200) {
                setErrorMessage("Gebruiker succesvol bijgewerkt.");
                setEditingUser(null);
                const updated = await axios.get("http://localhost:8080/users");
                setUsers(updated.data);
            }
        } catch (err) {
            console.error("Save failed:", err);
            setErrorMessage("Fout bij opslaan.");
        }
    };

    const deleteUser = async (email) => {
        const confirm = window.confirm(`Weet je zeker dat je gebruiker ${email} wilt verwijderen?`);
        if (!confirm) return;

        try {
            const response = await axios.delete(`http://localhost:8080/users/${email}`);
            if (response.status === 204) {
                setErrorMessage("Gebruiker succesvol verwijderd.");
                const updated = await axios.get("http://localhost:8080/users");
                setUsers(updated.data);
            }
        } catch (err) {
            console.error("Delete failed:", err);
            setErrorMessage("Fout bij verwijderen.");
        }
    };

    const handleNewUserInputChange = (e) => {
        const { name, value } = e.target;
        setNewUserData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateUser = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.post("http://localhost:8080/register", newUserData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            alert("Gebruiker succesvol aangemaakt.");
            setShowCreateModal(false);
            setNewUserData({
                id: "",
                firstname: "",
                lastname: "",
                email: "",
                defaultSlot: SLOT_OPTIONS[0]
            });

            // Refresh list
            const updated = await axios.get("http://localhost:8080/users", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setUsers(updated.data);
        } catch (err) {
            console.error("Create failed:", err);
            alert("Fout bij het aanmaken van gebruiker.");
        }
    };




    return (
        <main className="account-management-container">
            <h2>Account beheer</h2>
            <button className="create-user-button" onClick={() => setShowCreateModal(true)}>
                ➕ Nieuwe gebruiker toevoegen
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {showCreateModal && (
                <div className="edit-modal">
                    <div className="edit-modal-content">
                        <h3>Nieuwe student aanmaken</h3>
                        <label>Voornaam</label>
                        <input name="firstname" value={newUserData.firstname} onChange={handleNewUserInputChange} />
                        <label>Achternaam</label>
                        <input name="lastname" value={newUserData.lastname} onChange={handleNewUserInputChange} />
                        <label>Email</label>
                        <input name="email" value={newUserData.email} onChange={handleNewUserInputChange} />
                        <label>Voorkeurs tijdslot</label>
                        <select name="defaultSlot" value={newUserData.defaultSlot} onChange={handleNewUserInputChange}>
                            {SLOT_OPTIONS.map(slot => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>

                        <div className="edit-modal-buttons">
                            <button onClick={handleCreateUser}>✅ Aanmaken</button>
                            <button onClick={() => setShowCreateModal(false)}>❌ Annuleer</button>
                        </div>
                    </div>
                </div>
            )}

            <ul className="user-list">
                {users.map((user) => (
                    <li key={user.email} className="user-list-item">
                        <p>📧 {user.email} — 🪪 {user.roles.join(", ")}</p>
                        {user.student && (
                            <p>
                                ID:{user.student.id} 👤 {user.student.firstname} {user.student.lastname} —
                                🎨 {user.student.defaultSlot}
                            </p>
                        )}
                        <button className="user-edit-button" onClick={() => setEditingUser({...user})}> Edit ✏️</button>
                        <button className="user-edit-button" onClick={() => deleteUser(user.email)}>Verwijder 🗑 </button>
                    </li>
                ))}
            </ul>

            {editingUser && (
                <div className="edit-modal">
                    <div className="edit-modal-content">
                        <h3>Gebruiker bewerken</h3>

                        <label>Email</label>
                        <input
                            type="text"
                            name="email"
                            value={editingUser.email}
                            readOnly
                            style={{backgroundColor: "#f0f0f0", cursor: "not-allowed"}}
                        />
                        <button className="password-edit-button" onClick={() => setShowPasswordModal(true)}>🔒 Wachtwoord
                            wijzigen
                        </button>
                        <label>Roles (comma-separated)</label>
                        <input
                            type="text"
                            name="roles"
                            value={editingUser.roles.join(", ")}
                            onChange={handleInputChange}
                        />
                        {showPasswordModal && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h3>Wachtwoord wijzigen</h3>
                                    <input
                                        type="password"
                                        placeholder="Nieuw wachtwoord"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <div className="modal-buttons">
                                        <button onClick={handlePasswordChange}>Opslaan</button>
                                        <button onClick={() => setShowPasswordModal(false)}>Annuleren</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {editingUser.student && (
                            <>
                                <label>Voornaam</label>
                                <input
                                    type="text"
                                    name="student.firstname"
                                    value={editingUser.student.firstname}
                                    onChange={handleInputChange}
                                />
                                <label>Achternaam</label>
                                <input
                                    type="text"
                                    name="student.lastname"
                                    value={editingUser.student.lastname}
                                    onChange={handleInputChange}
                                />
                                <label>Voorkeurs tijdslot</label>
                                <select
                                    name="student.defaultSlot"
                                    value={editingUser.student.defaultSlot}
                                    onChange={handleInputChange}
                                >
                                    {SLOT_OPTIONS.map((slot) => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </>
                        )}


                        <div className="edit-modal-buttons">
                            <button onClick={saveUserChanges}>💾 Opslaan</button>
                            <button onClick={() => setEditingUser(null)}>❌ Annuleer</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default AdminAcountManager;

