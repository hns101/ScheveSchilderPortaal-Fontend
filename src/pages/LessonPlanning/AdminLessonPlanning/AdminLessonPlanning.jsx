import "../LessonPlanning.css";
import {useEffect, useState} from "react";
import useAdminWeeks from "../../../hooks/useAdminWeeks.js";
import {handleAddStudent, handleRemoveStudent} from "../../../helpers/adminLessonHelpers.js";
import axiosWithAuth from "../../../helpers/axiosWithAuth.js";

import LessonCard from "../../../components/admin/LessonCard.jsx";
import StudentList from "../../../components/admin/StudentList.jsx";
import LessonSelector from "../../../components/admin/LessonSelector.jsx";
import WeekNavigator from "../../../components/admin/WeekNavigator.jsx";
import AddWeekCard from "../../../components/admin/AddWeekCard.jsx";

import testWeekInputData from "../../../assets/weekInputData/weekInputData.json";

function AdminLessonPlanning() {
    const {
        weekData,
        allStudents,
        loading,
        error,
        message,
        setMessage,
        addWeek,
        removeWeek,
        fetchWeeks,
    } = useAdminWeeks();

    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [editableWeek, setEditableWeek] = useState(testWeekInputData);

    // --- FIX: Create the authenticated instance once ---
    const authenticatedAxios = axiosWithAuth();

    useEffect(() => {
        const firstLesson = weekData[currentWeekIndex]?.lessons?.[0];
        if (firstLesson) {
            setSelectedLessonId(firstLesson.id);
        } else {
            setSelectedLessonId(null);
        }
    }, [currentWeekIndex, weekData]);

    const currentWeek = weekData[currentWeekIndex];

    // --- FIX: Pass the created instance to the helpers ---
    const modifiedHandleAddStudent = (params) =>
        handleAddStudent({...params, axiosInstance: authenticatedAxios});

    const modifiedHandleRemoveStudent = (params) =>
        handleRemoveStudent({...params, axiosInstance: authenticatedAxios});

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p style={{color: "red"}}>{error}</p>;

    return (
        <main className="main">
            <h2 className="planning-h2">Les overzicht</h2>

            {currentWeek ? (
                <div className="lesson-outer-container">
                    <WeekNavigator
                        currentWeekIndex={currentWeekIndex}
                        totalWeeks={weekData.length}
                        onPrev={() => setCurrentWeekIndex((i) => Math.max(i - 1, 0))}
                        onNext={() => setCurrentWeekIndex((i) => Math.min(i + 1, weekData.length - 1))}
                        weekNum={currentWeek.weekNum ?? ""}
                        onDelete={() => {
                            removeWeek(currentWeek.id, () => {
                                setCurrentWeekIndex((prev) => Math.max(prev - 1, 0));
                            });
                        }}
                    />

                    <div className="lesson-container">
                        {currentWeek.lessons?.map((lesson) => (
                            <LessonCard
                                key={lesson.id}
                                lesson={lesson}
                                weekId={currentWeek.id}
                                onRemoveStudent={(weekId, lessonId, student) =>
                                    modifiedHandleRemoveStudent({
                                        weekId,
                                        lessonId,
                                        student,
                                        setMessage,
                                        onSuccess: fetchWeeks,
                                    })
                                }
                            />
                        ))}
                    </div>

                    <p className="removal-message">{message}</p>

                    <section className="lesson-editor-box">
                        <div className="student-selector-admin">
                            <LessonSelector
                                lessons={currentWeek.lessons ?? []}
                                selectedLessonId={selectedLessonId}
                                onChange={setSelectedLessonId}
                            />
                            <StudentList
                                students={allStudents}
                                onStudentClick={(student) =>
                                    modifiedHandleAddStudent({
                                        weekId: currentWeek.id,
                                        lessonId: selectedLessonId,
                                        student,
                                        setMessage,
                                        onSuccess: fetchWeeks,
                                    })
                                }
                            />
                        </div>
                        <AddWeekCard
                            id="weekcard-adder-admin"
                            editableWeek={editableWeek}
                            setEditableWeek={setEditableWeek}
                            allStudents={allStudents}
                            handleSubmitWeek={() => addWeek(editableWeek)}
                        />
                    </section>
                </div>
            ) : (
                <p>Geen weekdata beschikbaar.</p>
            )}
        </main>
    );
}

export default AdminLessonPlanning;