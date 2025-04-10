import '../LessonPlanning.css';
import {useState, useEffect} from "react";
import axios from "axios";

function UserLessonPlanning() {
    const [allData, setAllData] = useState([]);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token"); // Get the token from localStorage
    const [selections, setSelections] = useState({});

    // Create axios instance with default headers
    const axiosWithAuth = axios.create({
        baseURL: "http://localhost:8080",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const handleSlotChange = (lessonId, newLessonId) => {
        setSelections(prev => ({...prev, [lessonId]: newLessonId}));
    };

    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                const response = await axiosWithAuth.get("/weeks");

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

        fetchWeeks();
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
            try {
                await axiosWithAuth.delete(`/weeks/${originalLesson.weekId}/lessons/${originalLesson.id}/students/${studentEmail}`);
                alert("Je bent afgemeld voor deze les.");
                window.location.reload();
            } catch (err) {
                console.error("Afmelden mislukt", err);
                alert("Fout bij afmelden.");
            }
            return;
        }

        const newLesson = allData.flatMap(w => w.lessons).find(l => l.id === newLessonId);
        if (!newLesson || newLesson.id === originalLesson.id) return;

        try {
            await axiosWithAuth.delete(`/weeks/${originalLesson.weekId}/lessons/${originalLesson.id}/students/${studentEmail}`);
            await axiosWithAuth.post(`/weeks/${newLesson.weekId}/lessons/${newLesson.id}/students/${studentEmail}`);
            alert("Inschrijving bijgewerkt!");
            window.location.reload();
        } catch (err) {
            console.error("Update failed", err);
            alert("Fout bij het bijwerken van je inschrijving.");
        }
    };

    if (loading) return <p className="loading" >Loading...</p>;
    if (error) return <p style={{color: "red"}}>{error}</p>;
    if (!allData.length) return <p>Geen lesdata beschikbaar.</p>;
    if (!user) return <p style={{color: "red"}}>Gebruiker niet gevonden. Log opnieuw in.</p>;

    const currentWeek = allData[currentWeekIndex];
    const upcomingWeeks = allData.slice(currentWeekIndex + 1, currentWeekIndex + 3);

    return (
        <main className="main">
            <div className="lesson-outer-container">
                <div className="lesson-week-nav">
                    <button className="week-button" onClick={prevWeek} disabled={currentWeekIndex === 0}>◀</button>
                    <p className="week-name"> Les week {currentWeek.weekNum}</p>
                    <button className="week-button" onClick={nextWeek}
                            disabled={currentWeekIndex === allData.length - 1}>▶
                    </button>
                </div>

                <div className="lesson-changer">
                    {(() => {
                        const lessonsWithStudent = user?.student
                            ? currentWeek.lessons.filter(lesson =>
                                lesson.students.some(s => s.id === user.student.id)
                            )
                            : [];

                        if (lessonsWithStudent.length > 0) {
                            return lessonsWithStudent.map((originalLesson) => (
                                <div key={originalLesson.id} className="lesson-slot-selector">
                                    <h3 className="lesson-student-fullname">
                                        {user.student.firstname} {user.student.lastname}
                                    </h3>
                                    <select
                                        className="lesson-student-input"
                                        value={selections[originalLesson.id] || originalLesson.id}
                                        onChange={(e) => handleSlotChange(originalLesson.id, e.target.value === "niet-aanwezig" ? "niet-aanwezig" : parseInt(e.target.value))}
                                    >
                                        <option value="niet-aanwezig">Niet aanwezig</option>
                                        {currentWeek.lessons
                                            .filter(lesson =>
                                                (lesson.students.every(s => s.id !== user.student.id) || lesson.id === originalLesson.id) &&
                                                lesson.students.length < 10
                                            )
                                            .map(lesson => (
                                                <option key={lesson.id} value={lesson.id}>
                                                    {lesson.slot} {lesson.date}
                                                </option>
                                            ))}
                                    </select>
                                    <button
                                        className="lesson-send-button"
                                        onClick={() => handleSlotUpdate(originalLesson, selections[originalLesson.id] || originalLesson.id)}
                                        disabled={!selections[originalLesson.id] || selections[originalLesson.id] === originalLesson.id}
                                    >
                                        wijzig
                                    </button>
                                </div>
                            ));
                        } else {
                            const studentEmail = user.student.email;
                            const futureLessons = upcomingWeeks.flatMap(week => week.lessons);
                            const registeredCount = futureLessons.filter(lesson =>
                                lesson.students.some(s => s.id === user.student.id)
                            ).length;

                            // Get all available current week lessons
                            const currentAvailable = currentWeek.lessons.filter(lesson =>
                                lesson.students.every(s => s.id !== user.student.id) && lesson.students.length < 10
                            );

                            // Get all available future lessons
                            const futureAvailable = registeredCount < 3
                                ? futureLessons.filter(lesson =>
                                    lesson.students.every(s => s.id !== user.student.id) && lesson.students.length < 10
                                )
                                : [];

                            // Always combine all available lessons, don't make it conditional on selection
                            const combinedLessons = [...currentAvailable, ...futureAvailable];

                            return (
                                <div className="lesson-slot-selector">
                                    <h3 className="lesson-student-fullname">
                                        {user.student.firstname} {user.student.lastname}
                                    </h3>
                                    <span className='lesson-student-option'>
                                    <select
                                        className="lesson-student-input"
                                        value={selections["new"] || "niet-aanwezig"}
                                        onChange={(e) => {
                                            const newVal = e.target.value;
                                            setSelections(prev => ({...prev, new: newVal}));
                                        }}
                                    >
                                        <option value="niet-aanwezig">Niet aanwezig</option>
                                        {combinedLessons.map(lesson => (
                                            <option key={lesson.id} value={lesson.id}>
                                                {lesson.slot} {lesson.date}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="lesson-send-button"
                                        onClick={async () => {
                                            const newLessonId = selections["new"];
                                            if (!newLessonId || newLessonId === "niet-aanwezig") {
                                                alert("Geen wijziging aangebracht.");
                                                return;
                                            }

                                            const targetLesson = combinedLessons.find(
                                                lesson => lesson.id === parseInt(newLessonId)
                                            );

                                            if (!targetLesson) {
                                                alert("Ongeldige keuze.");
                                                return;
                                            }

                                            try {
                                                await axiosWithAuth.post(
                                                    `/weeks/${targetLesson.weekId}/lessons/${targetLesson.id}/students/${user.student.email}`
                                                );
                                                alert("Je bent aangemeld voor deze les.");
                                                window.location.reload();
                                            } catch (err) {
                                                console.error("Aanmelden mislukt", err);
                                                alert("Er ging iets mis bij aanmelden.");
                                            }
                                        }}
                                        disabled={!selections["new"] || selections["new"] === "niet-aanwezig"}
                                    >
                                        wijzig
                                    </button>
                                    </span>
                                </div>
                            );
                        }
                    })()}
                </div>

                <div className="lesson-container">
                    {currentWeek.lessons.map((lesson) => (
                        <div key={lesson.id} className="lesson">
                            <div className="lesson-info">
                                <p className="lesson-info-slot">{lesson.slot}</p>
                                <p className="lesson-info-time">{lesson.time}</p>
                                <p className="lesson-info-date">{lesson.date}</p>
                            </div>
                            <div className="lesson-students">
                                {lesson.students.map((student) => (
                                    <p key={student.id}
                                       className={student.id === user.student.id ? "lesson-student-name-active" : "lesson-student-name"}>
                                        {student.firstname}
                                    </p>
                                ))}
                                {[...Array(10 - lesson.students.length)].map((_, index) => (
                                    <p key={`empty-slot-${index}`} className="lesson-student-filler"></p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default UserLessonPlanning;