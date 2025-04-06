import axios from "axios";

export async function handleAddStudent({ weekId, lessonId, student, setMessage, onSuccess }) {
    try {
        const result = await axios.post(
            `http://localhost:8080/weeks/${weekId}/lessons/${lessonId}/students/${student.email}`
        );

        if (result.status === 200) {
            setMessage(`${student.firstname} successfully added`);
            if (onSuccess) {
                onSuccess(); // e.g., refetch data
            }
        }
    } catch (error) {
        console.error("Add student error:", error);
        const message = error?.response?.data || "Failed to add student.";
        setMessage(message);
    }
}

export async function handleRemoveStudent({ weekId, lessonId, student, setMessage, onSuccess }) {
    try {
        const result = await axios.delete(
            `http://localhost:8080/weeks/${weekId}/lessons/${lessonId}/students/${student.email}`
        );

        if (result.status === 200) {
            setMessage(`${student.firstname} successfully removed`);
            if (onSuccess) {
                onSuccess(); // e.g., refetch data
            }
        }
    } catch (error) {
        console.error("Remove student error:", error);
        const message = error?.response?.data || "Failed to remove student.";
        setMessage(message);
    }
}
