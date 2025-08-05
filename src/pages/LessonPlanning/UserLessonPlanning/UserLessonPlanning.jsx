import React, { useState } from 'react';
import './../LessonPlanning.css';
import UserWeekNavigator from "../../../components/user/UserWeekNavigator.jsx";
import LessonSwitcher from "../../../components/user/LessonSwitcher.jsx";
import LessonGrid from "../../../components/user/LessonGrid.jsx";
import useWeeks from "../../../hooks/useWeeks";
import { useAuth } from "../../../context/AuthContext.jsx";
import { updateLessonSlot } from "../../../helpers/lessonHelpers.js";

function UserLessonPlanning() {
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [selections, setSelections] = useState({});
    const { user } = useAuth();
    const { weeks: allData, loading, error } = useWeeks(user?.token);

    const handleSlotChange = (lessonId, newLessonId) => {
        setSelections(prev => ({ ...prev, [lessonId]: newLessonId }));
    };

    const handleSlotUpdate = async (originalLesson, newLessonId) => {
        try {
            await updateLessonSlot({
                originalLesson,
                newLessonId,
                studentEmail: user.student.email,
                allData,
            });
            alert("Inschrijving bijgewerkt!");
            window.location.reload();
        } catch (err) {
            console.error("Update failed", err);
            alert("Fout bij het bijwerken van je inschrijving.");
        }
    };

    const nextWeek = () => {
        if (currentWeekIndex < allData.length - 1) {
            setCurrentWeekIndex(currentWeekIndex + 1);
        }
    };

    const prevWeek = () => {
        if (currentWeekIndex > 0) {
            setCurrentWeekIndex(currentWeekIndex - 1);
        }
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="loading" style={{ color: "red" }}>{error}</p>;
    if (!user || !user?.student) return <p className="loading" style={{ color: "red" }}>Gebruiker niet gevonden. Log opnieuw in.</p>;

    if (!user.student.active) {
        return (
            <main className="main">
                <div className="inactive-message-container">
                    <h2>Account Inactief</h2>
                    <p>Je account is momenteel inactief. Je kunt geen lessen plannen of wijzigen.</p>
                    <p>Neem contact op met de beheerder voor meer informatie.</p>
                </div>
            </main>
        );
    }

    if (!allData.length) return <p className="loading" >Geen lesdata beschikbaar.</p>;

    const currentWeek = allData[currentWeekIndex];

    // Calculate the full range of lessons for the dropdowns
    // (1 week before, current week, and 2 weeks after)
    const relevantWeeksStartIndex = Math.max(0, currentWeekIndex - 1);
    const relevantWeeksEndIndex = Math.min(allData.length, currentWeekIndex + 3);
    const relevantWeeks = allData.slice(relevantWeeksStartIndex, relevantWeeksEndIndex);
    const allAvailableLessons = relevantWeeks.flatMap(week => week.lessons);

    return (
        <main className="main">
            <div className="lesson-outer-container">
                <UserWeekNavigator
                    currentWeekIndex={currentWeekIndex}
                    totalWeeks={allData.length}
                    onPrev={prevWeek}
                    onNext={nextWeek}
                    weekNum={currentWeek.weekNum}
                />

                <LessonSwitcher
                    user={user}
                    lessons={currentWeek.lessons}
                    selections={selections}
                    onSlotChange={handleSlotChange}
                    onSlotUpdate={handleSlotUpdate}
                    combinedLessons={allAvailableLessons} // Pass the single, correct list of lessons
                />

                <LessonGrid
                    lessons={currentWeek.lessons}
                    studentId={user.student.id}
                />
            </div>
        </main>
    );
}

export default UserLessonPlanning;