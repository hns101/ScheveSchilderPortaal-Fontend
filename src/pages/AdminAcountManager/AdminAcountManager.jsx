import './AdminAcountManager.css';
import { useEffect, useState } from "react";
import axiosWithAuth from "../../helpers/axiosWithAuth.js";
import CreateUserModal from "../../components/admin/CreateUserModal.jsx";
import EditUserModal from "../../components/admin/EditUserModal.jsx";

const SLOT_OPTIONS = ["Woensdag Avond", "Vrijdag Avond", "Zaterdag Ochtend"];

function AdminAccountManager() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await axiosWithAuth().get("/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setErrorMessage("Kon gebruikers niet ophalen.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (email) => {
        if (!window.confirm(`Weet je zeker dat je ${email} wilt verwijderen?`)) return;

        try {
            const res = await axiosWithAuth().delete(`/users/${email}`);
            if (res.status === 204) {
                alert("Gebruiker verwijderd.");
                fetchUsers();
            }
        } catch (err) {
            console.error("Delete failed", err);
            alert("Verwijderen mislukt.");
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
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onUserCreated={fetchUsers}
                    slotOptions={SLOT_OPTIONS}
                />
            )}

            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onUserUpdated={fetchUsers}
                    slotOptions={SLOT_OPTIONS}
                />
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
                        <button onClick={() => setEditingUser({ ...user })}>✏️ Bewerken</button>
                        <button onClick={() => handleDelete(user.email)}>🗑 Verwijderen</button>
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default AdminAccountManager;
