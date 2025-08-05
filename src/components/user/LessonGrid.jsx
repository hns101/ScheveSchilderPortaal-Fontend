import React from "react";
// Assuming the CSS is in the same folder or parent folder
// import './LessonGrid.css';

// Helper function to reformat the date string
const formatDate = (dateString) => {
    if (!dateString) return ""; // Return empty if no date is provided
    const parts = dateString.split('-'); // Splits "2025-02-28" into ["2025", "02", "28"]
    if (parts.length !== 3) return dateString; // Return original if format is unexpected
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // Joins them as "28-02-2025"
};

function LessonGrid({ lessons, studentId }) {
    return (
        <div className="lesson-container">
            {lessons.map((lesson) => (
                <div key={lesson.id} className="lesson">
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
