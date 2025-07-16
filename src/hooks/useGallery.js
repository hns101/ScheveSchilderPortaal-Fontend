import { useState, useEffect, useCallback } from 'react';
import { authApiClient } from '../api/api.js';

export default function useGallery(email) {
    const [gallery, setGallery] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [previewImageUrl, setPreviewImageUrl] = useState(null);

    const fetchGallery = useCallback(async () => {
        if (!email) return;
        try {
            const response = await authApiClient.get(`/galleries/${email}`);
            setGallery(response.data);
        } catch (err) {
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

    // --- NEW METHOD ---
    const setCoverPhoto = async (artworkId) => {
        await authApiClient.put(`/galleries/${email}/cover/${artworkId}`);
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
        fetchGallery();
        fetchArtworks();
    }, [email, fetchArtworks, fetchGallery]);

    return {
        gallery,
        artworks,
        loading,
        error,
        fetchArtworks,
        fetchGallery,
        deleteArtwork,
        setCoverPhoto, 
        previewImageUrl,
        loadPreviewImage,
        clearPreviewImage
    };
}