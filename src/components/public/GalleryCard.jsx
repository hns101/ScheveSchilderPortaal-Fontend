import React from 'react';
import { Link } from 'react-router-dom';
import './GalleryCard.css'; // We'll create this next

function GalleryCard({ gallery }) {
    // Find the first artwork with a photo to use as a preview
    const previewArtwork = gallery.artworks?.find(art => art.photoUrl);
    const previewImageUrl = previewArtwork ? `http://localhost:8080/uploads/${previewArtwork.photoUrl}` : 'https://placehold.co/600x400/EFEFEF/AAAAAA&text=Geen+Preview';

    return (
        <Link to={`/gallery/${gallery.studentId}`} className="gallery-card">
            <div className="gallery-card-image-container">
                <img
                    src={previewImageUrl}
                    alt={`Preview of gallery by ${gallery.student?.firstname}`}
                    className="gallery-card-image"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/EFEFEF/AAAAAA&text=Fout+bij+laden'; }}
                />
            </div>
            <div className="gallery-card-info">
                <h3 className="gallery-card-title">
                    Galerij van {gallery.student?.firstname || 'Onbekende artiest'}
                </h3>
            </div>
        </Link>
    );
}

export default GalleryCard;