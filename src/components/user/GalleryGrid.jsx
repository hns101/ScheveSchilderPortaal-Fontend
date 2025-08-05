import React from 'react';

// This component is now simpler. It just receives the artworks and thumbnails and displays them.
function GalleryGrid({ artworks, thumbnails, onSelect }) {
    return (
        <div className="gallery-grid">
            {artworks.map((art) => (
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

