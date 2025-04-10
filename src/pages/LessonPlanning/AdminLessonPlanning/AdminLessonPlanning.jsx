import React, { useEffect, useState } from "react";
import "../LessonPlanning.css";

// Helper functions to manage student add/remove operations
import { handleAddStudent, handleRemoveStudent } from "../../../helpers/adminLessonHelpers.js";
import axiosWithAuth from "../../../helpers/axiosWithAuth.js"

// Reusable components for lesson display, student list, and week/lesson navigation
import LessonCard from "../../../components/admin/LessonCard.jsx";
import StudentList from "../../../components/admin/StudentList.jsx";
import LessonSelector from "../../../components/admin/LessonSelector.jsx";
import WeekNavigator from "../../../components/admin/WeekNavigator.jsx";
import AddWeekCard from "../../../components/admin/AddWeekCard.jsx";

import testWeekInputData from "../../../TestData/testWeekInputData.json";

function AdminLessonPlanning() {
    // === Application state ===
    const [weekData, setWeekData] = useState([]);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [removeMessage, setRemoveMessage] = useState("");
    const [allStudents, setAllStudents] = useState([]);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [editableWeek, setEditableWeek] = useState(testWeekInputData);

    // Get the token from localStorage
    const token = localStorage.getItem("token");


    // === Initial data loading ===
    // Fetch week and student data once after component mounts
    useEffect(() => {
        fetchData();
        fetchStudents();
    }, [token]);

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
            const result = await axiosWithAuth().get("/weeks");

            if (Array.isArray(result.data)) {
                const sortedWeeks = result.data
                    .map(week => ({
                        ...week,
                        lessons: Array.isArray(week.lessons)
                            ? [...week.lessons].sort((a, b) => new Date(a.date) - new Date(b.date))
                            : []
                    }))
                    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

                setWeekData(sortedWeeks);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    // Fetch all registered students (used to add them to lessons)
    const fetchStudents = async () => {
        try {
            const result = await axiosWithAuth().get("/students");
            if (Array.isArray(result.data)) {
                setAllStudents(result.data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const handleSubmitWeek = async () => {
        try {
            const result = await axiosWithAuth().post("/weeks", editableWeek);

            if (result.status === 201) {
                setRemoveMessage("Nieuwe week succesvol toegevoegd.");
                await fetchData(); // refresh the list
            }
        } catch (error) {
            console.error("Post error:", error);
            setRemoveMessage("Fout bij het toevoegen van week.");
        }
    };

    const deleteWeek = async (weekId, onSuccess) => {
        try {
            const response = await axiosWithAuth().delete(`/weeks/${weekId}`);
            if (response.status === 204) {
                setRemoveMessage("Week succesvol verwijderd.");
                if (onSuccess) onSuccess();
                await fetchData();
                setCurrentWeekIndex((prev) => Math.max(prev - 1, 0));
            }
            else {
                throw new Error("Verwijderen mislukt");
            }
        } catch (error) {
            console.error("Delete week error:", error);
            setRemoveMessage("Fout bij het verwijderen van week.");
        } finally {
            await fetchData();
            setCurrentWeekIndex((prev) => Math.max(prev - 1, 0));
        }
    };

    // Need to update the helper functions to use axiosWithAuth
    // You'll need to modify the imported helper functions or pass axiosWithAuth to them
    const modifiedHandleAddStudent = (params) => {
        return handleAddStudent({
            ...params,
            axiosInstance: axiosWithAuth
        });
    };

    const modifiedHandleRemoveStudent = (params) => {
        return handleRemoveStudent({
            ...params,
            axiosInstance: axiosWithAuth
        });
    };

    return (
        <main className="main">
            <h2 className="planning-h2">Les overzicht</h2>

            {weekData.length === 0 ? (
                <p>Loading...</p>
            ) : (
                weekData[currentWeekIndex] && (
                    <div className="lesson-outer-container">

                        {/* Navigation bar for browsing between weeks */}
                        <WeekNavigator
                            currentWeekIndex={currentWeekIndex}
                            totalWeeks={weekData.length}
                            onPrev={() => setCurrentWeekIndex((i) => Math.max(i - 1, 0))}
                            onNext={() => setCurrentWeekIndex((i) => Math.min(i + 1, weekData.length - 1))}
                            weekNum={weekData[currentWeekIndex]?.weekNum ?? ""}
                            onDelete={() =>
                                deleteWeek(
                                    weekData[currentWeekIndex].id,
                                    setRemoveMessage
                                )
                            }
                        />

                        {/* Display each lesson and its current student list */}
                        <div className="lesson-container">
                            {weekData[currentWeekIndex]?.lessons?.map((lesson) => (
                                <LessonCard
                                    key={lesson.id}
                                    lesson={lesson}
                                    weekId={weekData[currentWeekIndex].id}
                                    onRemoveStudent={(weekId, lessonId, student) =>
                                        modifiedHandleRemoveStudent({
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
                            lessons={weekData[currentWeekIndex]?.lessons ?? []}
                            selectedLessonId={selectedLessonId}
                            onChange={setSelectedLessonId}
                        />

                        {/* List of all students. Click to add them to the selected lesson */}
                        <StudentList
                            students={allStudents}
                            onStudentClick={(student) =>
                                modifiedHandleAddStudent({
                                    weekId: weekData[currentWeekIndex]?.id,
                                    lessonId: selectedLessonId,
                                    student,
                                    setMessage: setRemoveMessage,
                                    onSuccess: fetchData,
                                })
                            }
                        />
                        <AddWeekCard
                            editableWeek={editableWeek}
                            setEditableWeek={setEditableWeek}
                            allStudents={allStudents}
                            handleSubmitWeek={handleSubmitWeek}
                        />
                    </div>
                ))}
        </main>
    );
}

export default AdminLessonPlanning;