import './UserLessonPlanning.css'
import {useState} from "react";
import testData from "./testData.json";

function UserLessonPlanning() {
    const [data, setData] = useState(testData);

    return (
        <>
            <main className="main">
                <div className="user-lesson-planning">
                    <p className="test"> Les week {data.Week}</p>
                    <div className=""></div>
                    {data.Lessons.map((data) => (
                        <div key={data.slot}>
                            <p>{data.Date}</p>
                            <p>{data.slot}</p>
                            <p>{data.Time}</p>
                            <div>{data.Students.map((data) => (<p key={data.id} >{data.firstname}</p>))}</div>


                        </div>
                        ))}
                </div>
            </main>
        </>
    );
}

export default UserLessonPlanning;