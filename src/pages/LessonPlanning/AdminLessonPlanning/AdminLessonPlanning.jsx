import React, { useEffect, useState } from "react";
import axios from "axios";
import "../LessonPlanning.css";

// Helper functions to manage student add/remove operations
import { handleAddStudent ,handleRemoveStudent } from "../../../helpers/adminLessonHelpers.js";

// Reusable components for lesson display, student list, and week/lesson navigation
import LessonCard from "../../../components/admin/LessonCard.jsx";
import StudentList from "../../../components/admin/StudentList.jsx";
import LessonSelector from "../../../components/admin/LessonSelector.jsx";
import WeekNavigator from "../../../components/admin/WeekNavigator.jsx";

function AdminLessonPlanning() {
    // === Application state ===
    const [weekData, setWeekData] = useState([]);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [removeMessage, setRemoveMessage] = useState("");
    const [allStudents, setAllStudents] = useState([]);
    const [selectedLessonId, setSelectedLessonId] = useState(null);

    // === Initial data loading ===
    // Fetch week and student data once after component mounts
    useEffect(() => {
        fetchData();
        fetchStudents();
    }, []);

    // When week data changes or index updates, select the first lesson by default (if not yet selected)
    useEffect(() => {
        if (weekData.length > 0 && !selectedLessonId) {
            const firstLesson = weekData[currentWeekIndex]?.lessons[0];
            if (firstLesson) {
                setSelectedLessonId(firstLesson.id);
            }
        }
    }, [weekData, currentWeekIndex]);

    // === Backend integration ===

    // Fetch all planned weeks with associated lessons and students
    const fetchData = async () => {
        try {
            const result = await axios.get("http://localhost:8080/weeks");
            if (Array.isArray(result.data)) {
                setWeekData(result.data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    // Fetch all registered students (used to add them to lessons)
    const fetchStudents = async () => {
        try {
            const result = await axios.get("http://localhost:8080/students");
            if (Array.isArray(result.data)) {
                setAllStudents(result.data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    return (
        <main className="main">
            <h2 className="planning-h2">Les overzicht</h2>

            {weekData.length === 0 ? (
                <p>Loading...</p>
            ) : (
                <div className="lesson-outer-container">

                    {/* Navigation bar for browsing between weeks */}
                    <WeekNavigator
                        currentWeekIndex={currentWeekIndex}
                        totalWeeks={weekData.length}
                        onPrev={() => setCurrentWeekIndex((i) => Math.max(i - 1, 0))}
                        onNext={() => setCurrentWeekIndex((i) => Math.min(i + 1, weekData.length - 1))}
                        weekNum={weekData[currentWeekIndex].weekNum}
                    />

                    {/* Display each lesson and its current student list */}
                    <div className="lesson-container">
                        {weekData[currentWeekIndex].lessons.map((lesson) => (
                            <LessonCard
                                key={lesson.id}
                                lesson={lesson}
                                weekId={weekData[currentWeekIndex].id}
                                onRemoveStudent={(weekId, lessonId, student) =>
                                    handleRemoveStudent({
                                        weekId,
                                        lessonId,
                                        student,
                                        setMessage: setRemoveMessage,
                                        onSuccess: fetchData,
                                    })
                                }
                            />
                        ))}
                    </div>

                    {/* Feedback messages (e.g., success/failure of operations) */}
                    <p className="removal-message">{removeMessage}</p>

                    {/* Dropdown selector to choose a specific lesson to add students to */}
                    <LessonSelector
                        lessons={weekData[currentWeekIndex].lessons}
                        selectedLessonId={selectedLessonId}
                        onChange={setSelectedLessonId}
                    />

                    {/* List of all students. Click to add them to the selected lesson */}
                    <StudentList
                        students={allStudents}
                        onStudentClick={(student) =>
                            handleAddStudent({
                                weekId: weekData[currentWeekIndex].id,
                                lessonId: selectedLessonId,
                                student,
                                setMessage: setRemoveMessage,
                                onSuccess: fetchData,
                            })
                        }
                    />
                    <section className="adding-week-form">

                    </section>
                </div>
            )}
        </main>
    );
}

export default AdminLessonPlanning;