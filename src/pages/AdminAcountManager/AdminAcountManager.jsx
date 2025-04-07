import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminAcountManager.css';

function AdminAcountManager() {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/register/admin/users");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                setErrorMessage("Kon gebruikers niet ophalen.");
            }
        };

        fetchUsers();
    }, []);

    return (
        <main className="account-management-container">
            <h2>Account beheer</h2>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <ul className="user-list">
                {users.map((user) => (
                    <li key={user.email} className="user-list-item">
                        📧 {user.email}
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default AdminAcountManager;
