import React from 'react';
import { Link } from 'react-router-dom';
import './HubCard.css'; // We'll create a new CSS file for this

const getDisplayName = (student) => {
    if (!student || !student.firstname) return 'Onbekende Artiest';
    const lastNameInitial = student.lastname ? ` ${student.lastname}.` : '';
    return `${student.firstname}${lastNameInitial}`;
};

function HubCard({ item }) {
    const isGallery = item.type === 'gallery';

    // Determine the title, link, and preview image based on the item type
    const title = isGallery ? `Galerij van ${getDisplayName(item.student)}` : item.name;
    const linkTo = isGallery ? `/gallery/${item.student?.id}` : `/collection/${item.id}`;

    const previewImageUrl = item.coverArtworkId
        ? `http://localhost:8080/public/artworks/${item.coverArtworkId}/photo`
        : 'https://placehold.co/600x400/EFEFEF/AAAAAA&text=Geen+Preview';

    return (
        <Link to={linkTo} className="hub-card">
            <div className="hub-card-image-container">
                <img
                    src={previewImageUrl}
                    alt={`Preview of ${title}`}
                    className="hub-card-image"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/EFEFEF/AAAAAA&text=Fout+bij+laden'; }}
                />
                {/* Add a tag to distinguish collections */}
                {!isGallery && <span className="collection-tag">Collectie</span>}
            </div>
            <div className="hub-card-info">
                <h3 className="hub-card-title">{title}</h3>
            </div>
        </Link>
    );
}

export default HubCard;