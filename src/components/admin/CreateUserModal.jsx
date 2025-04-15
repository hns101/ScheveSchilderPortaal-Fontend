import React, { useState } from "react";
import axiosWithAuth from "../../helpers/axiosWithAuth.js";

function CreateUserModal({ onClose, onUserCreated, slotOptions }) {
    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        defaultSlot: slotOptions[0]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            await axiosWithAuth().post("/register", form); // Now sends a complete RegisterStudentDto
            alert("Gebruiker aangemaakt.");
            onClose();
            onUserCreated();
        } catch (err) {
            console.error("Create failed:", err);
            alert("Fout bij aanmaken gebruiker.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Nieuwe gebruiker</h3>

                <label>Voornaam</label>
                <input name="firstname" value={form.firstname} onChange={handleChange} />

                <label>Achternaam</label>
                <input name="lastname" value={form.lastname} onChange={handleChange} />

                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} />

                <label>Wachtwoord</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} />

                <label>Voorkeurs tijdslot</label>
                <select className="user-edit-selector"
                    name="defaultSlot" value={form.defaultSlot} onChange={handleChange}>
                    {slotOptions.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                    ))}
                </select>

                <div className="modal-buttons">
                    <button onClick={handleSubmit}>✅ Aanmaken</button>
                    <button onClick={onClose}>❌ Annuleren</button>
                </div>
            </div>
        </div>
    );
}

export default CreateUserModal;
