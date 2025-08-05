import React from "react";
import "../../pages/LessonPlanning/LessonPlanning.css";

// Helper function to reformat the date string
const formatDate = (dateString) => {
    if (!dateString) return ""; // Return empty if no date is provided
    const parts = dateString.split('-'); // Splits "2025-02-28" into ["2025", "02", "28"]
    if (parts.length !== 3) return dateString; // Return original if format is unexpected
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // Joins them as "28-02-2025"
};

function LessonCard({ lesson, weekId, onRemoveStudent }) {
    return (
        <div className="lesson">
            <div className="lesson-info">
                <p className="lesson-info-slot">{lesson.slot}</p>
                <p className="lesson-info-time">{lesson.time}</p>
                {/* Use the formatDate function to display the date */}
                <p className="lesson-info-date">{formatDate(lesson.date)}</p>
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