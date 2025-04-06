import React from "react";
import {
    addLesson,
    addStudentsByDefaultSlot,
    removeLesson,
    removeStudentFromLesson
} from "../../helpers/adminLessonHelpers.js";

function AddWeekCard({
                         editableWeek,
                         setEditableWeek,
                         allStudents,
                         handleSubmitWeek
                     }) {
    return (
        <section className="adding-week-form">
            <button className="submit-week-button" onClick={handleSubmitWeek}>
                📤 Les week toevoegen
            </button>

            <div className="input-week-item">
                <div className="input-week-item-bundel">
                    <label>Week Nummer</label>
                    <input
                        type="number"
                        value={editableWeek.weekNum}
                        onChange={(e) =>
                            setEditableWeek({ ...editableWeek, weekNum: parseInt(e.target.value) })
                        }
                    />
                </div>
                <div className="input-week-item-bundel">
                    <label>StartDate</label>
                    <input
                        type="text"
                        value={editableWeek.startDate}
                        onChange={(e) =>
                            setEditableWeek({ ...editableWeek, startDate: e.target.value })
                        }
                    />
                </div>
                <button
                    className="input-week-lesson-button"
                    onClick={() => addLesson(editableWeek, setEditableWeek)}
                >
                    ➕ Les toevoegen
                </button>
            </div>

            <div className="week-lesson-input">
                {editableWeek.lessons.map((lesson, index) => (
                    <div className="week-lesson-input-container" key={index}>
                        <button
                            className="week-lesson-delete-button"
                            onClick={() => removeLesson(editableWeek, setEditableWeek, index)}
                        >
                            Delete
                        </button>
                        <label>slot</label>
                        <input
                            type="text"
                            value={lesson.slot}
                            onChange={(e) => {
                                const updatedLessons = [...editableWeek.lessons];
                                updatedLessons[index].slot = e.target.value;
                                setEditableWeek({ ...editableWeek, lessons: updatedLessons });
                            }}
                        />
                        <label>Time</label>
                        <input
                            type="text"
                            value={lesson.time}
                            onChange={(e) => {
                                const updatedLessons = [...editableWeek.lessons];
                                updatedLessons[index].time = e.target.value;
                                setEditableWeek({ ...editableWeek, lessons: updatedLessons });
                            }}
                        />
                        <label>Date</label>
                        <input
                            type="text"
                            value={lesson.date}
                            onChange={(e) => {
                                const updatedLessons = [...editableWeek.lessons];
                                updatedLessons[index].date = e.target.value;
                                setEditableWeek({ ...editableWeek, lessons: updatedLessons });
                            }}
                        />
                        <label>Students</label>
                        <button
                            className="input-week-lesson-button"
                            onClick={() => addStudentsByDefaultSlot(editableWeek, setEditableWeek, index, allStudents)}
                        >
                            ➕load default
                        </button>
                        {lesson.students.map((student) => (
                            <p className="input-week-lesson-student"
                                key={student.id}
                                onClick={() =>
                                    removeStudentFromLesson(editableWeek, setEditableWeek, index, student.id)}
                            >{allStudents.find((s) => s.id === student.id)?.firstname}
                            </p>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default AddWeekCard;
