import React from "react";
import "../../pages/LessonPlanning/LessonPlanning.css";

function StudentList({ students, onStudentClick }) {
    return (
        <div className="adding-students">
            {students.map((student) => (
                <p
                    key={student.id}
                    className="adding-students-names"
                    onClick={() => onStudentClick(student)}
                >
                    {student.firstname} {student.lastname}
                </p>
            ))}
        </div>
    );
}

export default StudentList;