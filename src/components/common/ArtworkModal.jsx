import React from 'react';
import './ArtworkModal.css'; // We'll create this next

const ArtworkModal = ({ artwork, artistName, onClose }) => {
    if (!artwork) {
        return null;
    }

    // Stop the click from propagating to the overlay and closing the modal
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    const imageUrl = `http://localhost:8080/public/artworks/${artwork.id}/photo`;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={handleModalContentClick}>
                <button className="modal-close-button" onClick={onClose}>×</button>
                <div className="modal-image-container">
                    <img src={imageUrl} alt={artwork.title} />
                </div>
                <div className="modal-info">
                    <h2 className="modal-title">{artwork.title}</h2>
                    <p className="modal-detail"><strong>Jaar:</strong> {artwork.year}</p>
                    <p className="modal-detail"><strong>Kunstenaar:</strong> {artistName}</p>
                </div>
            </div>
        </div>
    );
};

export default ArtworkModal;