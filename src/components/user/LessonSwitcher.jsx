import React from 'react';

function LessonSwitcher({
                            user,
                            lessons = [],
                            selections,
                            onSlotChange,
                            onSlotUpdate,
                            combinedLessons // This now contains all relevant lessons
                        }) {
    const lessonsWithStudent = lessons.filter(lesson =>
        lesson.students?.some(s => s.id === user.student.id)
    );

    // Helper to format the date string
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString;
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };

    // CASE: User is already in a lesson for the current week
    if (lessonsWithStudent.length > 0) {
        return lessonsWithStudent.map(originalLesson => {
            const selectedValue = selections[originalLesson.id] ?? originalLesson.id;

            return (
                <div key={originalLesson.id} className="lesson-slot-selector">
                    <h3 className="lesson-student-fullname">
                        {user.student.firstname} {user.student.lastname}
                    </h3>
                    <select
                        className="lesson-student-input"
                        value={selectedValue}
                        onChange={(e) =>
                            onSlotChange(
                                originalLesson.id,
                                e.target.value === "niet-aanwezig" ? "niet-aanwezig" : parseInt(e.target.value)
                            )
                        }
                    >
                        <option value="niet-aanwezig">Niet aanwezig</option>
                        {/* --- FIX: Use combinedLessons for all options --- */}
                        {(combinedLessons || [])
                            .filter(lesson =>
                                // Show a lesson if it's not full, OR if it's the lesson the user is already in
                                (lesson.students.length < 10 || lesson.id === originalLesson.id)
                            )
                            .map(lesson => (
                                <option key={lesson.id} value={lesson.id}>
                                    {lesson.slot} {formatDate(lesson.date)}
                                </option>
                            ))}
                    </select>
                    <button
                        className="lesson-send-button"
                        onClick={() => onSlotUpdate(originalLesson, selectedValue)}
                        disabled={selectedValue === originalLesson.id}
                    >
                        wijzig
                    </button>
                </div>
            );
        });
    }

    // CASE: User is NOT in any lesson for this week
    const selectedNew = selections["new"];
    return (
        <div className="lesson-slot-selector">
            <h3 className="lesson-student-fullname">
                {user.student.firstname} {user.student.lastname}
            </h3>
            <span className='lesson-student-option'>
                <select
                    className="lesson-student-input"
                    value={selectedNew || "niet-aanwezig"}
                    onChange={(e) =>
                        onSlotChange("new", e.target.value === "niet-aanwezig" ? "niet-aanwezig" : parseInt(e.target.value))
                    }
                >
                    <option value="niet-aanwezig">Niet aanwezig</option>
                    {(combinedLessons || [])
                        .filter(lesson => lesson.students.length < 10)
                        .map(lesson => (
                            <option key={lesson.id} value={lesson.id}>
                                {lesson.slot} {formatDate(lesson.date)}
                            </option>
                        ))}
                </select>
                <button
                    className="lesson-send-button"
                    onClick={() => onSlotUpdate(null, selectedNew)}
                    disabled={!selectedNew || selectedNew === "niet-aanwezig"}
                >
                    wijzig
                </button>
            </span>
        </div>
    );
}

export default LessonSwitcher;
