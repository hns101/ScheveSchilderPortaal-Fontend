import { useState, useEffect, useCallback } from 'react';
// Import the secure API client
import { authApiClient } from '../api/api.js';

export default function useGallery(email) {
    // --- NEW: State for the gallery object itself ---
    const [gallery, setGallery] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [previewImageUrl, setPreviewImageUrl] = useState(null);

    // --- NEW: Function to fetch the main gallery data ---
    const fetchGallery = useCallback(async () => {
        if (!email) return;
        try {
            const response = await authApiClient.get(`/galleries/${email}`);
            setGallery(response.data);
        } catch (err) {
            // Don't set the main error, as the artwork fetch might still succeed
            console.error("Error fetching gallery details:", err);
        }
    }, [email]);


    const fetchArtworks = useCallback(async () => {
        if (!email) return;
        setLoading(true);
        try {
            const response = await authApiClient.get(`/galleries/${email}/artworks`);
            setArtworks(response.data);
            setError("");
        } catch (err) {
            setError("Fout bij ophalen van kunstwerken.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [email]);

    const deleteArtwork = async (artworkId) => {
        await authApiClient.delete(`/galleries/${email}/artworks/${artworkId}`);
    };

    const loadPreviewImage = async (artworkId) => {
        const res = await authApiClient.get(`/artworks/${artworkId}/photo`, {
            responseType: 'blob',
        });
        setPreviewImageUrl(URL.createObjectURL(res.data));
    };

    const clearPreviewImage = () => {
        if (previewImageUrl) {
            URL.revokeObjectURL(previewImageUrl);
            setPreviewImageUrl(null);
        }
    };

    useEffect(() => {
        // When the component mounts or email changes, fetch both gallery and artworks
        fetchGallery();
        fetchArtworks();
    }, [email, fetchArtworks, fetchGallery]);

    return {
        gallery, // <-- Expose the new gallery state
        artworks,
        loading,
        error,
        fetchArtworks,
        fetchGallery, // <-- Expose the new fetch function
        deleteArtwork,
        previewImageUrl,
        loadPreviewImage,
        clearPreviewImage
    };
}
