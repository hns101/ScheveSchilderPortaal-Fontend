import React from 'react';
import { Link } from 'react-router-dom';
import './GalleryCard.css';

const getDisplayName = (student) => {
    if (!student || !student.firstname) {
        return 'Onbekende Artiest';
    }
    const lastNameInitial = student.lastname ? ` ${student.lastname}.` : '';
    return `${student.firstname}${lastNameInitial}`;
};

function GalleryCard({ gallery }) {
    let previewImageUrl = 'https://placehold.co/600x400/EFEFEF/AAAAAA&text=Geen+Preview';

    // --- UPDATED LOGIC ---
    // 1. Prioritize the selected cover artwork.
    if (gallery.coverArtworkId) {
        previewImageUrl = `http://localhost:8080/public/artworks/${gallery.coverArtworkId}/photo`;
    }
    // 2. If no cover is set, fall back to the first artwork in the gallery.
    else if (gallery.artworks?.length > 0) {
        const firstArtwork = gallery.artworks[0];
        previewImageUrl = `http://localhost:8080/public/artworks/${firstArtwork.id}/photo`;
    }
    // 3. If no artworks exist, the placeholder will be used.

    return (
        <Link to={`/gallery/${gallery.student?.id}`} className="gallery-card">
            <div className="gallery-card-image-container">
                <img
                    src={previewImageUrl}
                    alt={`Preview of gallery by ${getDisplayName(gallery.student)}`}
                    className="gallery-card-image"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/EFEFEF/AAAAAA&text=Fout+bij+laden'; }}
                />
            </div>
            <div className="gallery-card-info">
                <h3 className="gallery-card-title">
                    Galerij van {getDisplayName(gallery.student)}
                </h3>
            </div>
        </Link>
    );
}

export default GalleryCard;