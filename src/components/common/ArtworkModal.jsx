import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ArtworkModal.css';

const getDisplayName = (artist) => {
    if (!artist || !artist.firstname) return 'Onbekende Artiest';
    const lastNameInitial = artist.lastname ? ` ${artist.lastname}.` : '';
    return `${artist.firstname}${lastNameInitial}`;
};

const ArtworkModal = ({
                          artwork,
                          artist,
                          onClose,
                          isOwner,
                          isAdmin,
                          isCover,
                          onSetCover,
                          collections,
                          onAddToCollection,
                          onRemoveFromCollection,
                          onDelete // This is our unified delete prop
                      }) => {
    const [selectedCollection, setSelectedCollection] = useState('');

    if (!artwork) return null;

    const handleModalContentClick = (e) => e.stopPropagation();
    const imageUrl = `http://localhost:8080/public/artworks/${artwork.id}/photo`;

    const handleAddClick = () => {
        if (selectedCollection) {
            onAddToCollection(selectedCollection, artwork.id);
        }
    };

    const artistName = getDisplayName(artist);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content-photo" onClick={handleModalContentClick}>
                <button className="modal-close-button" onClick={onClose}>×</button>
                <div className="modal-image-container">
                    <img src={imageUrl} alt={artwork.title} />
                </div>
                <div className="modal-info">
                    <h2 className="modal-title">{artwork.title}</h2>
                    <p className="modal-detail"><strong>Jaar:</strong> {artwork.year}</p>
                    <p className="modal-detail">
                        <strong>Kunstenaar:</strong>
                        {artist && artist.id ? (
                            <Link to={`/gallery/${artist.id}`} className="artist-link" onClick={onClose}>
                                {artistName}
                            </Link>
                        ) : (
                            <span> {artistName}</span>
                        )}
                    </p>

                    <div className="modal-actions">
                        {(isOwner || isAdmin) && onSetCover && (
                            <>
                                {isCover ? (
                                    <button className="set-cover-button disabled" disabled>Huidige Omslagfoto</button>
                                ) : (
                                    <button className="set-cover-button" onClick={() => onSetCover(artwork.id)}>Instellen als Omslagfoto</button>
                                )}
                            </>
                        )}
                        {isAdmin && onRemoveFromCollection && (
                            <button className="delete-button" onClick={() => onRemoveFromCollection(artwork.id)}>Verwijder uit Collectie</button>
                        )}
                        {/* --- UPDATED: Show delete button for owner OR admin --- */}
                        {(isOwner || isAdmin) && onDelete && (
                            <button className="delete-button" onClick={() => onDelete(artwork.id)}>Verwijder Kunstwerk</button>
                        )}
                    </div>

                    {isAdmin && onAddToCollection && (
                        <div className="admin-collection-adder">
                            <select
                                value={selectedCollection}
                                onChange={(e) => setSelectedCollection(e.target.value)}
                            >
                                <option value="">Kies een collectie...</option>
                                {collections?.map(col => (
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