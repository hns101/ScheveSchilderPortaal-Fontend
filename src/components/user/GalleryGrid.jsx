function GalleryGrid({ artworks, onSelect }) {
    return (
        <div className="gallery-grid">
            {artworks.map((art) => (
                <div key={art.id} className="gallery-card">
                    <img
                        src={`http://localhost:8080/artworks/${art.id}/photo`}
                        alt={art.title}
                        className="gallery-photo"
                        onClick={() => onSelect(art)}
                    />
                </div>
            ))}
        </div>
    );
}

export default GalleryGrid;