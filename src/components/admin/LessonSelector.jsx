import React, { useEffect } from "react";
import "../../pages/LessonPlanning/LessonPlanning.css";

function LessonSelector({ lessons, selectedLessonId, onChange }) {
    // Auto-select the first lesson if none is selected
    useEffect(() => {
        if (lessons.length > 0 && !selectedLessonId) {
            onChange(lessons[0].id);
        }
    }, [lessons, selectedLessonId, onChange]);

    return (
        <select
            className="lesson-student-adding-input"
            name="class"
            id="class"
            value={selectedLessonId || ""}
            onChange={(e) => onChange(Number(e.target.value))}
        >
            {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                    {lesson.slot} {lesson.date}
                </option>
            ))}
        </select>
    );
}

export default LessonSelector;