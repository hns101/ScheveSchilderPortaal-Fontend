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
    const previewArtwork = gallery.artworks?.find(art => art.id);
    // Use the NEW public and secure artwork photo endpoint
    const previewImageUrl = previewArtwork
        ? `http://localhost:8080/public/artworks/${previewArtwork.id}/photo`
        : 'https://placehold.co/600x400/EFEFEF/AAAAAA&text=Geen+Preview';

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