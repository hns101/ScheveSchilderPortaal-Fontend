import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/api.js'; // Use the public client
import GalleryCard from '../../components/public/GalleryCard.jsx'; // We'll create this next
import './PublicGalleries.css'; // We'll create this next

function PublicGalleries() {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPublicGalleries = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/public/galleries');
                setGalleries(response.data);
            } catch (err) {
                setError('Kon de galerijen niet laden. Probeer het later opnieuw.');
                console.error("Error fetching public galleries:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPublicGalleries();
    }, []);

    return (
        <main className="public-galleries-container">
            <header className="public-galleries-header">
                <h1>Gallerij Hub</h1>
                <p>Ontdek de prachtige kunstwerken van onze getalenteerde studenten.</p>
            </header>

            {loading && <p className="loading-message">Galerijen worden geladen...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="public-galleries-grid">
                {galleries.map(gallery => (
                    <GalleryCard key={gallery.id} gallery={gallery} />
                ))}
            </div>
        </main>
    );
}

export default PublicGalleries;
