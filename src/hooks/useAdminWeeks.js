import { useEffect, useState } from "react";
import axiosWithAuth from "../helpers/axiosWithAuth";

export default function useAdminWeeks() {
    const [weekData, setWeekData] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchWeeks = async () => {
        setLoading(true); // start loading
        try {
            const response = await axiosWithAuth().get("/weeks");
            if (Array.isArray(response.data)) {
                const sortedWeeks = response.data.map(week => ({
                    ...week,
                    lessons: Array.isArray(week.lessons)
                        ? [...week.lessons].sort((a, b) => new Date(a.date) - new Date(b.date))
                        : []
                })).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                setWeekData(sortedWeeks);
            }
        } catch (err) {
            setError("Kon weekdata niet ophalen.");
            console.error(err);
        } finally {
            setLoading(false); // end loading
        }
    };

    const fetchStudents = async () => {
        try {
            const result = await axiosWithAuth().get("/students");
            if (Array.isArray(result.data)) {
                setAllStudents(result.data);
            }
        } catch (err) {
            setError("Kon studenten niet ophalen.");
            console.error(err);
        }
    };


    const addWeek = async (week) => {
        try {
            const result = await axiosWithAuth().post("/weeks", week);
            if (result.status === 201) {
                setMessage("Nieuwe week succesvol toegevoegd.");
                await fetchWeeks();
            }
        } catch (err) {
            setMessage("Fout bij toevoegen van week.");
            console.error(err);
        }
    };

    const removeWeek = async (weekId) => {
        try {
            const result = await axiosWithAuth().delete(`/weeks/${weekId}`);
            if (result.status === 204) {
                setMessage("Week succesvol verwijderd.");
                await fetchWeeks();
            }
        } catch (err) {
            setMessage("Fout bij verwijderen van week.");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchWeeks();
        fetchStudents();
    }, []);

    return {
        weekData,
        allStudents,
        loading,
        error,
        message,
        setMessage,
        fetchWeeks,
        addWeek,
        removeWeek,
    };
}
