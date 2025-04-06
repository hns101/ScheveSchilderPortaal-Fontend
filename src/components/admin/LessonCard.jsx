import React from "react";
import "../../pages/LessonPlanning/LessonPlanning.css";

function LessonCard({ lesson, weekId, onRemoveStudent }) {
    return (
        <div className="lesson">
            <div className="lesson-info">
                <p className="lesson-info-slot">{lesson.slot}</p>
                <p className="lesson-info-time">{lesson.time}</p>
                <p className="lesson-info-date">{lesson.date}</p>
            </div>
            <div className="lesson-students">
                {lesson.students.map((student) => (
                    <p
                        key={student.id}
                        className="lesson-student-name-overview"
                        onClick={() => onRemoveStudent(weekId, lesson.id, student)}
                    >
                        {student.firstname}
                    </p>
                ))}
                {[...Array(10 - lesson.students.length)].map((_, index) => (
                    <p key={`empty-slot-${index}`} className="lesson-student-filler"></p>
                ))}
            </div>
        </div>
    );
}

export default LessonCard;