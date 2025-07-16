import React from 'react';

// The component now accepts two new props: onSetCover and isCover
const ArtworkPreviewModal = ({ artwork, imageUrl, onClose, onDelete, onSetCover, isCover }) => {
    if (!artwork) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content-preview" onClick={(e) => e.stopPropagation()}>
                <img
                    src={imageUrl}
                    alt={artwork.title}
                    className="preview-photo"
                />
                <h3>{artwork.title}</h3>
                <p><strong>Jaar:</strong> {artwork.year}</p>
                <p><strong>Kunstenaar:</strong> {artwork.artistName}</p>

                {/* --- NEW: Action buttons container --- */}
                <div className="modal-actions">
                    {isCover ? (
                        <button className="set-cover-button disabled" disabled>
                            Huidige Omslagfoto
                        </button>
                    ) : (
                        <button className="set-cover-button" onClick={() => onSetCover(artwork.id)}>
                            Instellen als Omslagfoto
                        </button>
                    )}
                    <button type="button" className="photo-delete-button" onClick={() => onDelete(artwork.id)}>
                        Verwijder
                    </button>
                </div>
                <button type="button" className="photo-cancel-button" onClick={onClose}>
                    Sluiten
                </button>
            </div>
        </div>
    );
};

export default ArtworkPreviewModal;

