import './UserLessonPlanning.css'
import {useState} from "react";
import testDataAll from "./testDataAll.json";

function UserLessonPlanning() {
    const [allData, setAllData] = useState(testDataAll);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

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

    return (
        <>
            <main className="main">
                <div className="lesson-outer-container">
                    <div className="lesson-week-nav">
                        <button className="week-button" onClick={prevWeek} disabled={currentWeekIndex === 0}>
                            ◀
                        </button>
                        <p className="week-name"> Les week {allData[currentWeekIndex].Week}</p>
                        <button className="week-button" onClick={nextWeek} disabled={currentWeekIndex === allData.length - 1}>
                            ▶
                        </button>
                    </div>


                    <div className="lesson-container">
                        {allData[currentWeekIndex].Lessons.map((data) => (
                            <div key={data.slot} className="lesson">
                                <div className="lesson-info">
                                    <p className="lesson-info-slot">{data.slot}</p>
                                    <p className="lesson-info-time">{data.Time}</p>
                                    <p className="lesson-info-date">{data.Date}</p>
                                </div>
                                <div className="lesson-students">
                                    {data.Students.map((data) =>
                                        (<p key={data.id} className="lesson-student-name">{data.firstname}</p>))}
                                    {[...Array(10 - data.Students.length)].map(() => (
                                        <p key={data.id} className="lesson-student-filler"></p>))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}

export default UserLessonPlanning;