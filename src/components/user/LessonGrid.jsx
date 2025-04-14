function LessonGrid({ lessons, studentId }) {
    return (
        <div className="lesson-container">
            {lessons.map((lesson) => (
                <div key={lesson.id} className="lesson">
                    <div className="lesson-info">
                        <p className="lesson-info-slot">{lesson.slot}</p>
                        <p className="lesson-info-time">{lesson.time}</p>
                        <p className="lesson-info-date">{lesson.date}</p>
                    </div>
                    <div className="lesson-students">
                        {lesson.students.map((student) => (
                            <p
                                key={student.id}
                                className={
                                    student.id === studentId
                                        ? "lesson-student-name-active"
                                        : "lesson-student-name"
                                }
                            >
                                {student.firstname}
                            </p>
                        ))}
                        {[...Array(10 - lesson.students.length)].map((_, index) => (
                            <p
                                key={`empty-slot-${index}`}
                                className="lesson-student-filler"
                            ></p>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default LessonGrid;
