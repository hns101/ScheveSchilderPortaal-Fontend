function UserWeekNavigator({ currentWeekIndex, totalWeeks, onPrev, onNext, weekNum }) {
    return (
        <div className="lesson-week-nav">
            <button
                className="week-button"
                onClick={onPrev}
                disabled={currentWeekIndex === 0}
            >
                ◀
            </button>
            <p className="week-name"> Les week {weekNum}</p>
            <button
                className="week-button"
                onClick={onNext}
                disabled={currentWeekIndex === totalWeeks - 1}
            >
                ▶
            </button>
        </div>
    );
}

export default UserWeekNavigator;
