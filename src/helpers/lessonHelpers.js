import axiosWithAuth from "./axiosWithAuth.js";

export async function updateLessonSlot({ originalLesson, newLessonId, studentEmail, allData }) {
    const axios = axiosWithAuth();

    if (newLessonId === "niet-aanwezig") {
        if (!originalLesson) return;
        await axios.delete(`/weeks/${originalLesson.weekId}/lessons/${originalLesson.id}/students/${studentEmail}`);
        return;
    }

    const newLesson = allData.flatMap(w => w.lessons).find(l => l.id === newLessonId);
    if (!newLesson || (originalLesson && newLesson.id === originalLesson.id)) return;

    if (originalLesson) {
        await axios.delete(`/weeks/${originalLesson.weekId}/lessons/${originalLesson.id}/students/${studentEmail}`);
    }

    await axios.post(`/weeks/${newLesson.weekId}/lessons/${newLesson.id}/students/${studentEmail}`);
}
