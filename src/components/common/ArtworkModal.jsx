import React from 'react';
import './ArtworkModal.css';

const ArtworkModal = ({ artwork, artistName, onClose, isOwner, onSetCover, isCover }) => {
    if (!artwork) {
        return null;
    }

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
                    {/* --- NEW: Conditional Button --- */}
                    {isOwner && (
                        <div className="modal-actions">
                            {isCover ? (
                                <button type="button" className="set-cover-button disabled" disabled>Huidige Omslagfoto</button>
                            ) : (
                                <button type="button" className="set-cover-button" onClick={() => onSetCover(artwork.id)}>Instellen als Omslagfoto</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtworkModal;