import { useState, useEffect } from 'react';
import axiosWithAuth from '../helpers/axiosWithAuth';

export default function useGallery(email) {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [previewImageUrl, setPreviewImageUrl] = useState(null);

    const fetchArtworks = async () => {
        setLoading(true);
        try {
            const response = await axiosWithAuth().get(`/galleries/${email}/artworks`);
            setArtworks(response.data);
            setError("");
        } catch (err) {
            setError("Fout bij ophalen van kunstwerken.");
            console.error(err);
        } finally {
            setLoading(false); // 🔥 Belangrijk!
        }
    };

    const deleteArtwork = async (artworkId) => {
        await axiosWithAuth().delete(`/galleries/${email}/artworks/${artworkId}`);
    };

    const loadPreviewImage = async (artworkId) => {
        const res = await axiosWithAuth().get(`/artworks/${artworkId}/photo`, {
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
        fetchArtworks();
    }, [email]);

    return {
        artworks,
        loading,
        error,
        fetchArtworks,
        deleteArtwork,
        previewImageUrl,
        loadPreviewImage,
        clearPreviewImage
    };
}
