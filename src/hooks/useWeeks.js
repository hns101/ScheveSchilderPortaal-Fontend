import { useEffect, useState } from "react";
import axiosWithAuth from "../helpers/axiosWithAuth";

export default function useWeeks(token) {
    const [weeks, setWeeks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                const response = await axiosWithAuth().get("/weeks");
                if (Array.isArray(response.data)) {
                    const sorted = response.data
                        .map(week => ({
                            ...week,
                            lessons: week.lessons.map(lesson => ({ ...lesson, weekId: week.id }))
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                        }))
                        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                    setWeeks(sorted);
                } else {
                    setError("Dataformaat is ongeldig.");
                }
            } catch (err) {
                console.error("Error fetching weeks:", err);
                setError("Fout bij het laden van weekdata.");
            } finally {
                setLoading(false);
            }
        };

        void fetchWeeks();
    }, [token]);

    return { weeks, loading, error };
}