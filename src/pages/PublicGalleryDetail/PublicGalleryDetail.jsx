import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../api/api.js';
import './PublicGalleryDetail.css';

function PublicGalleryDetail() {
    const { studentId } = useParams(); // Get studentId from the URL
    const [gallery, setGallery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGalleryDetails = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get(`/public/gallery/${studentId}`);
                setGallery(response.data);
            } catch (err) {
                setError('Deze galerij kon niet worden gevonden of is privé.');
                console.error("Error fetching public gallery details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryDetails();
    }, [studentId]);

    if (loading) {
        return <p className="gallery-detail-message">Galerij wordt geladen...</p>;
    }

    if (error) {
        return <p className="gallery-detail-message error">{error}</p>;
    }

    return (
        <main className="gallery-detail-container">
            <header className="gallery-detail-header">
                <h1>Galerij van {gallery.student?.firstname || 'een artiest'}</h1>
                <Link to="/galleries" className="back-to-hub-link">← Terug naar de Gallerij Hub</Link>
            </header>

            <div className="artwork-grid">
                {gallery.artworks && gallery.artworks.length > 0 ? (
                    gallery.artworks.map(artwork => (
                        <div key={artwork.id} className="artwork-card">
                            <img
                                src={`http://localhost:8080/uploads/${artwork.photoUrl}`}
                                alt={artwork.title}
                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/EFEFEF/AAAAAA&text=Fout+bij+laden'; }}
                            />
                            <div className="artwork-info">
                                <p className="artwork-title">{artwork.title}</p>
                                <p className="artwork-year">{artwork.year}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Deze galerij heeft nog geen kunstwerken.</p>
                )}
            </div>
        </main>
    );
}

export default PublicGalleryDetail;