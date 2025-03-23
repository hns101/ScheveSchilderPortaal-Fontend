import './UserLessonPlanning.css'
import {useState} from "react";
import testDataAll from "../../testData/testDataAll.json";

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
                            {allData[currentWeekIndex].Lessons.map((data) => (
                            <option value={data.slot}>{data.slot} {data.Date}</option>))}

                        </select>
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
                                        (<p key={data.id}
                                            className={data.id === user.id ?
                                                        "lesson-student-name-active" :"lesson-student-name"}
                                        >{data.firstname} </p>))}
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