import '../LessonPlanning.css';
import {useState, useEffect} from "react";
import axiosWithAuth from "../../../helpers/axiosWithAuth.js";
import UserWeekNavigator from "../../../components/user/UserWeekNavigator.jsx";
import LessonSwitcher from "../../../components/user/LessonSwitcher.jsx";
import LessonGrid from "../../../components/user/LessonGrid.jsx";

function UserLessonPlanning() {
    const [allData, setAllData] = useState([]);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const [selections, setSelections] = useState({});

    const handleSlotChange = (lessonId, newLessonId) => {
        setSelections(prev => ({...prev, [lessonId]: newLessonId}));
    };

    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                const response = await axiosWithAuth().get("/weeks");

                if (Array.isArray(response.data)) {
                    const sortedWeeks = response.data
                        .map(week => ({
                            ...week,
                            lessons: week.lessons.map(lesson => ({...lesson, weekId: week.id}))
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                        }))
                        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

                    setAllData(sortedWeeks);
                } else {
                    setError("Dataformaat is ongeldig.");
                }
            } catch (err) {
                console.error("Error fetching week data:", err);
                setError("Fout bij het laden van weekdata.");
            } finally {
                setLoading(false);
            }
        };

        void fetchWeeks();
    }, [token]);

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

    const handleSlotUpdate = async (originalLesson, newLessonId) => {
        const studentEmail = user.student.email;

        if (newLessonId === "niet-aanwezig") {
            if (!originalLesson) return;
            try {
                await axiosWithAuth().delete(`/weeks/${originalLesson.weekId}/lessons/${originalLesson.id}/students/${studentEmail}`);
                alert("Je bent afgemeld voor deze les.");
                window.location.reload();
            } catch (err) {
                console.error("Afmelden mislukt", err);
                alert("Fout bij afmelden.");
            }
            return;
        }

        const newLesson = allData.flatMap(w => w.lessons).find(l => l.id === newLessonId);
        if (!newLesson || (originalLesson && newLesson.id === originalLesson.id)) return;

        try {
            if (originalLesson) {
                await axiosWithAuth().delete(`/weeks/${originalLesson.weekId}/lessons/${originalLesson.id}/students/${studentEmail}`);
            }
            await axiosWithAuth().post(`/weeks/${newLesson.weekId}/lessons/${newLesson.id}/students/${user.student.email}`);
            alert("Inschrijving bijgewerkt!");
            window.location.reload();
        } catch (err) {
            console.error("Update failed", err);
            alert("Fout bij het bijwerken van je inschrijving.");
        }
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p style={{color: "red"}}>{error}</p>;
    if (!allData.length) return <p>Geen lesdata beschikbaar.</p>;
    if (!user || !user?.student) return <p style={{color: "red"}}>Gebruiker niet gevonden. Log opnieuw in.</p>;

    const currentWeek = allData[currentWeekIndex];
    const upcomingWeeks = allData.slice(currentWeekIndex + 1, currentWeekIndex + 3);

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
                    upcomingLessons={upcomingWeeks.flatMap(w => w.lessons)}
                    selections={selections}
                    onSlotChange={handleSlotChange}
                    onSlotUpdate={handleSlotUpdate}
                    combinedLessons={[...currentWeek.lessons, ...upcomingWeeks.flatMap(w => w.lessons)]}
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
