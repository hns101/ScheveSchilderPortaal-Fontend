// The functions now accept the 'axiosInstance' as a parameter
export async function handleAddStudent({ weekId, lessonId, student, setMessage, onSuccess, axiosInstance }) {
    try {
        // --- FIX: Use the provided axiosInstance, not the default axios ---
        const result = await axiosInstance.post(
            `/weeks/${weekId}/lessons/${lessonId}/students/${student.email}`
        );

        if (result.status === 200) {
            setMessage(`${student.firstname} successfully added`);
            if (onSuccess) {
                onSuccess();
            }
        }
    } catch (error) {
        console.error("Add student error:", error);
        const message = error?.response?.data || "Failed to add student.";
        setMessage(message);
    }
}

export async function handleRemoveStudent({ weekId, lessonId, student, setMessage, onSuccess, axiosInstance }) {
    try {
        // --- FIX: Use the provided axiosInstance, not the default axios ---
        const result = await axiosInstance.delete(
            `/weeks/${weekId}/lessons/${lessonId}/students/${student.email}`
        );

        if (result.status === 200) {
            setMessage(`${student.firstname} successfully removed`);
            if (onSuccess) {
                onSuccess();
            }
        }
    } catch (error) {
        console.error("Remove student error:", error);
        const message = error?.response?.data || "Failed to remove student.";
        setMessage(message);
    }
}

export const addLesson = (editableWeek, setEditableWeek) => {
    const newLesson = {
        slot: "", time: "", date: "", students: []
    };
    setEditableWeek({
        ...editableWeek,
        lessons: [...editableWeek.lessons, newLesson]
    });
};

// Removes a lesson at given index
export const removeLesson = (editableWeek, setEditableWeek, index) => {
    const updatedLessons = editableWeek.lessons.filter((_, i) => i !== index);
    setEditableWeek({ ...editableWeek, lessons: updatedLessons });
};

// Adds a student (by ID) to a specific lesson
export const addStudentToLesson = (editableWeek, setEditableWeek, lessonIndex, studentId) => {
    const updatedLessons = [...editableWeek.lessons];
    const lesson = updatedLessons[lessonIndex];
    if (!lesson.students.find(s => s.id === studentId)) {
        lesson.students.push({ id: studentId });
        setEditableWeek({ ...editableWeek, lessons: updatedLessons });
    }
};

// Removes a student (by ID) from a lesson
export const removeStudentFromLesson = (editableWeek, setEditableWeek, lessonIndex, studentId) => {
    const updatedLessons = [...editableWeek.lessons];
    updatedLessons[lessonIndex].students = updatedLessons[lessonIndex].students.filter(s => s.id !== studentId);
    setEditableWeek({ ...editableWeek, lessons: updatedLessons });
};

export const addStudentsByDefaultSlot = (editableWeek, setEditableWeek, lessonIndex, allStudents) => {
    const updatedLessons = [...editableWeek.lessons];
    const lesson = updatedLessons[lessonIndex];
    const slot = lesson.slot;
    const studentIdsToAdd = allStudents
        .filter(s => s.defaultSlot === slot && !lesson.students.some(ls => ls.id === s.id))
        .map(s => ({ id: s.id }));

    lesson.students.push(...studentIdsToAdd);
    setEditableWeek({ ...editableWeek, lessons: updatedLessons });
};