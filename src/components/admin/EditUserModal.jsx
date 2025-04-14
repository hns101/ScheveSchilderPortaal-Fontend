import React, { useState } from "react";
import axiosWithAuth from "../../helpers/axiosWithAuth.js";

function EditUserModal({ user, onClose, onUserUpdated, slotOptions }) {
    const [form, setForm] = useState({ ...user });
    const [newPassword, setNewPassword] = useState("");
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("student.")) {
            const key = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                student: { ...prev.student, [key]: value },
            }));
        } else if (name === "roles") {
            setForm((prev) => ({ ...prev, roles: value.split(",").map((r) => r.trim()) }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        try {
            await axiosWithAuth().put(`/users/${form.email}`, form);
            alert("Gebruiker bijgewerkt.");
            onClose();
            onUserUpdated();
        } catch (err) {
            console.error("Update failed:", err);
            alert("Fout bij opslaan wijzigingen.");
        }
    };

    const handlePasswordChange = async () => {
        try {
            await axiosWithAuth().put(`/users/${form.email}/password`, { newPassword });
            alert("Wachtwoord gewijzigd.");
            setNewPassword("");
            setShowPasswordModal(false);
        } catch (err) {
            console.error("Password change failed:", err);
            alert("Fout bij wijzigen wachtwoord.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Gebruiker bewerken</h3>

                <label>Email</label>
                <input type="text" name="email" value={form.email} readOnly />

                <label>Roles (comma-separated)</label>
                <input name="roles" value={form.roles.join(", ")} onChange={handleChange} />

                <button className="password-edit-button" onClick={() => setShowPasswordModal(true)}>
                    🔒 Wachtwoord wijzigen
                </button>

                {showPasswordModal && (
                    <div className="modal-sub">
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
                )}

                {form.student && (
                    <>
                        <label>Voornaam</label>
                        <input name="student.firstname" value={form.student.firstname} onChange={handleChange} />

                        <label>Achternaam</label>
                        <input name="student.lastname" value={form.student.lastname} onChange={handleChange} />

                        <label>Voorkeurs tijdslot</label>
                        <select
                            name="student.defaultSlot"
                            value={form.student.defaultSlot}
                            onChange={handleChange}
                        >
                            {slotOptions.map((slot) => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                    </>
                )}

                <div className="modal-buttons">
                    <button onClick={handleSave}>💾 Opslaan</button>
                    <button onClick={onClose}>❌ Annuleer</button>
                </div>
            </div>
        </div>
    );
}

export default EditUserModal;
