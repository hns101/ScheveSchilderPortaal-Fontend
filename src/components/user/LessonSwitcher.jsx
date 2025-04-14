function LessonSwitcher({
                            user,
                            lessons = [],
                            upcomingLessons = [],
                            selections,
                            onSlotChange,
                            onSlotUpdate,
                            combinedLessons
                        }) {
    const lessonsWithStudent = lessons.filter(lesson =>
        lesson.students?.some(s => s.id === user.student.id)
    );

    // CASE: User is already in a lesson
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
                        {lessons
                            .filter(lesson =>
                                (lesson.students.every(s => s.id !== user.student.id) || lesson.id === originalLesson.id) &&
                                lesson.students.length < 10
                            )
                            .map(lesson => (
                                <option key={lesson.id} value={lesson.id}>
                                    {lesson.slot} {lesson.date}
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

    // CASE: User is not in any lesson for this week
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
                                {lesson.slot} {lesson.date}
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
