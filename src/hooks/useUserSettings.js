import { useState, useEffect } from "react";
import axiosWithAuth from "../helpers/axiosWithAuth";

export default function useUserSettings(email) {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedClassTime, setSelectedClassTime] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosWithAuth().get(`/users/${email}`);
                setFormData(data);
                setSelectedClassTime(data.student.defaultSlot);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [email]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "defaultSlot") setSelectedClassTime(value);

        setFormData(prev => ({
            ...prev,
            student: {
                ...prev.student,
                [name]: value
            }
        }));
    };

    const saveChanges = async () => {
        await axiosWithAuth().put(`/users/${email}`, formData);
    };

    const changePassword = async () => {
        await axiosWithAuth().put(`/users/${email}/password`, { newPassword });
        setNewPassword("");
    };

    return {
        formData,
        loading,
        selectedClassTime,
        newPassword,
        setNewPassword,
        handleChange,
        saveChanges,
        changePassword,
    };
}
