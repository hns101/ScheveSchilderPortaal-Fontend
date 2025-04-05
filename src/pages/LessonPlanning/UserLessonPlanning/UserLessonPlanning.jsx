import '../LessonPlanning.css'
import {useState} from "react";
import testDataAll from "../../../TestData/testDataAll.json";

function UserLessonPlanning({user}) {
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
                    <div className="lesson-changer">
                        <h3 className="lesson-student-fullname">{user.firstname} {user.lastname}</h3>
                        <select
                            className="lesson-student-input" name="class" id="class">
                            {allData[currentWeekIndex].lessons.map((data) => (
                            <option key={data.slot} value={data.slot}>{data.slot} {data.Date}</option>))}

                        </select>
                    </div>


                    <div className="lesson-container">
                        {allData[currentWeekIndex].lessons.map((data) => (
                            <div key={data.Date} className="lesson">
                                <div className="lesson-info">
                                    <p className="lesson-info-slot">{data.slot}</p>
                                    <p className="lesson-info-time">{data.Time}</p>
                                    <p className="lesson-info-date">{data.Date}</p>
                                </div>
                                <div className="lesson-students">
                                    {data.Students.map((student) => (
                                        <p key={student.id}
                                           className={student.id === user.id ? "lesson-student-name-active" : "lesson-student-name"}>
                                            {student.firstname}
                                        </p>
                                    ))}
                                    {[...Array(10 - data.Students.length)].map((_, index) => (
                                        <p key={`empty-slot-${index}`} className="lesson-student-filler"></p>
                                    ))}
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