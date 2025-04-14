function ArtworkPreviewModal({ artwork, onClose, onDelete }) {
    if (!artwork) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content-preview" onClick={(e) => e.stopPropagation()}>
                <img
                    src={`http://localhost:8080/artworks/${artwork.id}/photo`}
                    alt={artwork.title}
                    className="preview-photo"
                />
                <h3>{artwork.title}</h3>
                <p><strong>Jaar:</strong> {artwork.year}</p>
                <p><strong>Kunstenaar:</strong> {artwork.artistName}</p>
                <button type="button" className="photo-delete-button"  aria-label={`Verwijder ${artwork.title}`}
                        onClick={() => onDelete(artwork.id)}>Verwijder</button>
                <button type="button" className="photo-cancel-button" onClick={onClose}>Sluiten</button>
            </div>
        </div>
    );
}

export default ArtworkPreviewModal;
