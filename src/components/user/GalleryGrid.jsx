import { useEffect, useState, useMemo } from "react";
import axiosWithAuth from "../../helpers/axiosWithAuth";
import { shuffleArray } from "../../helpers/shuffleArray";

function GalleryGrid({ artworks, onSelect }) {
    const [thumbnails, setThumbnails] = useState({});

    const shuffledArtworks = useMemo(() => shuffleArray(artworks), [artworks]);

    useEffect(() => {
        const loadThumbnails = async () => {
            const newThumbs = {};
            for (const art of shuffledArtworks) {
                try {
                    const res = await axiosWithAuth().get(`/artworks/${art.id}/photo`, {
                        responseType: "blob"
                    });
                    const url = URL.createObjectURL(res.data);
                    newThumbs[art.id] = url;
                } catch (err) {
                    console.error(`Kan afbeelding niet laden voor artwork ${art.id}`, err);
                }
            }

            Object.values(thumbnails).forEach(url => URL.revokeObjectURL(url));
            setThumbnails(newThumbs);
        };

        if (shuffledArtworks.length > 0) {
            loadThumbnails();
        }

        return () => {
            Object.values(thumbnails).forEach(url => URL.revokeObjectURL(url));
        };
    }, [shuffledArtworks]);

    return (
        <div className="gallery-grid">
            {shuffledArtworks.map((art) => (
                <div key={art.id} className="gallery-card">
                    {thumbnails[art.id] ? (
                        <img
                            src={thumbnails[art.id]}
                            alt={art.title}
                            className="gallery-photo"
                            onClick={() => onSelect(art)}
                        />
                    ) : (
                        <div className="gallery-photo loading-placeholder">Laden...</div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default GalleryGrid;

