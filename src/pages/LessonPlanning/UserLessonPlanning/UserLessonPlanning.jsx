import '../LessonPlanning.css';
import { useState } from "react";
import UserWeekNavigator from "../../../components/user/UserWeekNavigator.jsx";
import LessonSwitcher from "../../../components/user/LessonSwitcher.jsx";
import LessonGrid from "../../../components/user/LessonGrid.jsx";
import useWeeks from "../../../hooks/useWeeks";
import useAuth from "../../../hooks/useAuth";
import { updateLessonSlot } from "../../../helpers/lessonHelpers.js";

function UserLessonPlanning() {
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [selections, setSelections] = useState({});
    const { user, token } = useAuth();
    const { weeks: allData, loading, error } = useWeeks(token);

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
    if (!allData.length) return <p className="loading" >Geen lesdata beschikbaar.</p>;
    if (!user || !user?.student) return <p className="loading" style={{ color: "red" }}>Gebruiker niet gevonden. Log opnieuw in.</p>;

    const currentWeek = allData[currentWeekIndex];
    const upcomingWeeksRaw = allData.slice(currentWeekIndex + 1, currentWeekIndex + 3);

// Count how many lessons the student is already in across both weeks
    const totalUpcomingRegistrations = upcomingWeeksRaw.reduce((count, week) => {
        return count + week.lessons.filter(lesson =>
            lesson.students.some(s => s.id === user.student.id)
        ).length;
    }, 0);

// Only allow extra options if the student is in fewer than 3 lessons for the coming 2 weeks
    const upcomingLessons = totalUpcomingRegistrations >= 3
        ? [] // no extra options if 3 or more
        : upcomingWeeksRaw
            .flatMap(week =>
                week.lessons.filter(lesson => {
                    const isFull = lesson.students.length >= 10;
                    const alreadyRegistered = lesson.students.some(s => s.id === user.student.id);
                    return !isFull && !alreadyRegistered;
                })
            );


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
                    upcomingLessons={upcomingLessons}
                    selections={selections}
                    onSlotChange={handleSlotChange}
                    onSlotUpdate={handleSlotUpdate}
                    combinedLessons={[...currentWeek.lessons, ...upcomingLessons]}
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

