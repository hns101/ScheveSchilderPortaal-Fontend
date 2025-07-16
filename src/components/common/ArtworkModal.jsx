import React, { useState } from 'react';
import './ArtworkModal.css';

const ArtworkModal = ({ artwork, artistName, onClose, isOwner, isAdmin, onSetCover, isCover, collections, onAddToCollection }) => {
    const [selectedCollection, setSelectedCollection] = useState('');

    if (!artwork) return null;

    const handleModalContentClick = (e) => e.stopPropagation();
    const imageUrl = `http://localhost:8080/public/artworks/${artwork.id}/photo`;

    const handleAddClick = () => {
        if (selectedCollection) {
            onAddToCollection(selectedCollection, artwork.id);
        }
    };

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

                    {/* --- Admin/Owner Action Buttons --- */}
                    {(isOwner || isAdmin) && (
                        <div className="modal-actions">
                            {isCover ? (
                                <button className="set-cover-button disabled" disabled>Huidige Omslagfoto</button>
                            ) : (
                                <button className="set-cover-button" onClick={() => onSetCover(artwork.id)}>Instellen als Omslagfoto</button>
                            )}
                        </div>
                    )}

                    {/* --- NEW: Admin-only "Add to Collection" feature --- */}
                    {isAdmin && (
                        <div className="admin-collection-adder">
                            <select
                                value={selectedCollection}
                                onChange={(e) => setSelectedCollection(e.target.value)}
                            >
                                <option value="">Kies een collectie...</option>
                                {collections.map(col => (
                                    <option key={col.id} value={col.id}>{col.name}</option>
                                ))}
                            </select>
                            <button onClick={handleAddClick} disabled={!selectedCollection}>
                                Toevoegen
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtworkModal;