import '../LessonPlanning.css';
import { useState, useEffect } from "react";
import axios from "axios";

function UserLessonPlanning() {
    const [allData, setAllData] = useState([]);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));
    const [selections, setSelections] = useState({});
    const handleSlotChange = (lessonId, newSlot) => {
        setSelections(prev => ({ ...prev, [lessonId]: newSlot }));
    };

    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/weeks");

                if (Array.isArray(response.data)) {
                    const sortedWeeks = response.data
                        .map(week => ({
                            ...week,
                            lessons: [...week.lessons].sort(
                                (a, b) => new Date(a.date) - new Date(b.date)
                            )
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
    }, []);

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

    const handleSlotUpdate = async (originalLesson, newSlot) => {
        const studentEmail = user.student.email;

        // 🆕 Handle "Niet aanwezig" — just remove the student from the lesson
        if (newSlot === "niet-aanwezig") {
            try {
                await axios.delete(`http://localhost:8080/weeks/${currentWeek.id}/lessons/${originalLesson.id}/students/${studentEmail}`);
                alert("Je bent afgemeld voor deze les.");
                window.location.reload();
            } catch (err) {
                console.error("Afmelden mislukt", err);
                alert("Fout bij afmelden.");
            }
            return;
        }

        const newLesson = currentWeek.lessons.find(l => l.slot === newSlot);

        // 🛑 If nothing changed, skip
        if (!newLesson || newLesson.id === originalLesson.id) return;

        try {
            // 1. Remove from old slot
            await axios.delete(`http://localhost:8080/weeks/${currentWeek.id}/lessons/${originalLesson.id}/students/${studentEmail}`);

            // 2. Add to new slot
            await axios.post(`http://localhost:8080/weeks/${currentWeek.id}/lessons/${newLesson.id}/students/${studentEmail}`);

            alert("Inschrijving bijgewerkt!");
            window.location.reload();
        } catch (err) {
            console.error("Update failed", err);
            alert("Fout bij het bijwerken van je inschrijving.");
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!allData.length) return <p>Geen lesdata beschikbaar.</p>;
    if (!user) return <p style={{ color: "red" }}>Gebruiker niet gevonden. Log opnieuw in.</p>;

    const currentWeek = allData[currentWeekIndex];

    return (
        <main className="main">
            <div className="lesson-outer-container">
                <div className="lesson-week-nav">
                    <button className="week-button" onClick={prevWeek} disabled={currentWeekIndex === 0}>
                        ◀
                    </button>
                    <p className="week-name"> Les week {currentWeek.weekNum}</p>
                    <button className="week-button" onClick={nextWeek}
                            disabled={currentWeekIndex === allData.length - 1}>
                        ▶
                    </button>
                </div>

                <div className="lesson-changer">
                    {(() => {
                        const lessonsWithStudent = currentWeek.lessons.filter(lesson =>
                            lesson.students.some(s => s.id === user.student.id)
                        );

                        if (lessonsWithStudent.length > 0) {
                            return lessonsWithStudent.map((originalLesson) => (
                                <div key={originalLesson.id} className="lesson-slot-selector">
                                    <h3 className="lesson-student-fullname">
                                        {user.student.firstname} {user.student.lastname}
                                    </h3>
                                    <select
                                        className="lesson-student-input"
                                        defaultValue={originalLesson.slot}
                                        onChange={(e) =>
                                            handleSlotChange(originalLesson.id, e.target.value)
                                        }
                                    >
                                        <option value="niet-aanwezig">Niet aanwezig</option>
                                        {currentWeek.lessons
                                            .filter(
                                                lesson =>
                                                    lesson.students.every(s => s.id !== user.student.id) ||
                                                    lesson.id === originalLesson.id
                                            )
                                            .map(lesson => (
                                                <option key={lesson.id} value={lesson.slot}>
                                                    {lesson.slot} {lesson.date}
                                                </option>
                                            ))}
                                    </select>
                                    <button
                                        className="lesson-send-button"
                                        onClick={() =>
                                            handleSlotUpdate(originalLesson, selections[originalLesson.id] || originalLesson.slot)
                                        }
                                        disabled={
                                            !selections[originalLesson.id] ||
                                            selections[originalLesson.id] === originalLesson.slot
                                        }
                                    >
                                        Verzenden
                                    </button>
                                </div>
                            ));
                        } else {
                            return (
                                <div className="lesson-slot-selector">
                                    <h3 className="lesson-student-fullname">
                                        {user.student.firstname} {user.student.lastname}
                                    </h3>
                                    <select
                                        className="lesson-student-input"
                                        value={selections["new"] || "niet-aanwezig"}
                                        onChange={(e) =>
                                            setSelections(prev => ({ ...prev, new: e.target.value }))
                                        }
                                    >
                                        <option value="niet-aanwezig">Niet aanwezig</option>
                                        {currentWeek.lessons
                                            .filter(lesson =>
                                                lesson.students.every(s => s.id !== user.student.id)
                                            )
                                            .map(lesson => (
                                                <option key={lesson.id} value={lesson.slot}>
                                                    {lesson.slot} {lesson.date}
                                                </option>
                                            ))}
                                    </select>
                                    <button
                                        className="lesson-send-button"
                                        onClick={async () => {
                                            const newSlot = selections["new"];
                                            const studentEmail = user.student.email;

                                            if (!newSlot || newSlot === "niet-aanwezig") {
                                                alert("Geen wijziging aangebracht.");
                                                return;
                                            }

                                            const targetLesson = currentWeek.lessons.find(
                                                lesson => lesson.slot === newSlot
                                            );

                                            if (!targetLesson) {
                                                alert("Ongeldige keuze.");
                                                return;
                                            }

                                            try {
                                                await axios.post(
                                                    `http://localhost:8080/weeks/${currentWeek.id}/lessons/${targetLesson.id}/students/${studentEmail}`
                                                );
                                                alert("Je bent aangemeld voor deze les.");
                                                window.location.reload();
                                            } catch (err) {
                                                console.error("Aanmelden mislukt", err);
                                                alert("Er ging iets mis bij aanmelden.");
                                            }
                                        }}
                                        disabled={
                                            !selections["new"] || selections["new"] === "niet-aanwezig"
                                        }
                                    >
                                        Verzenden
                                    </button>
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
                                       className={student.id === user.student.id
                                           ? "lesson-student-name-active"
                                           : "lesson-student-name"}>
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
