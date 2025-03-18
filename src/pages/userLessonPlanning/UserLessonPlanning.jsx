import './UserLessonPlanning.css'
import {useState} from "react";
import testData from "./testData.json";

function UserLessonPlanning() {
    const [data, setData] = useState(testData);

    return (
        <>
            <main className="main">
                <div className="lesson-outer-container">
                    <p className="test"> Les week {data.Week}</p>
                    <div className="lesson-container">
                        {data.Lessons.map((data) => (
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