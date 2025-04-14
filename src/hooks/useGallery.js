import { useState, useEffect } from 'react';
import axios from 'axios';
import { shuffleArray } from '../helpers/shuffleArray.js';

export default function useGallery(email) {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchArtworks = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/galleries/${email}/artworks`);
            setArtworks(shuffleArray(response.data));
        } catch (err) {
            setError("Fout bij ophalen van kunstwerken.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (email) fetchArtworks();
    }, [email]);

    return { artworks, fetchArtworks, loading, error };
}