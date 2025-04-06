import React from "react";
import "../../pages/LessonPlanning/LessonPlanning.css";

function WeekNavigator({currentWeekIndex, totalWeeks, onPrev, onNext, onDelete, weekNum}) {
    return (<>

        <div className="lesson-week-nav">
            <button
                className="week-button"
                onClick={onPrev}
                disabled={currentWeekIndex === 0}
            >
                ◀
            </button>

            <p className="week-name">Les week {weekNum}</p>

            <button
                className="week-button"
                onClick={onNext}
                disabled={currentWeekIndex === totalWeeks - 1}
            >
                ▶
            </button>


        </div>
        {onDelete && (
            <button
                className="delete-week-button"
                onClick={onDelete}
                title="Verwijder deze week"
            > Delete
            </button>
        )}
    </>);
}

export default WeekNavigator;
