import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/api.js';
import HubCard from '../../components/public/HubCard.jsx'; // We'll create this new component
import './PublicGalleries.css';

function PublicGalleries() {
    const [hubItems, setHubItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHubData = async () => {
            setLoading(true);
            try {
                // Fetch both galleries and collections in parallel
                const [galleriesRes, collectionsRes] = await Promise.all([
                    apiClient.get('/public/galleries'),
                    apiClient.get('/public/collections')
                ]);

                // Add a 'type' property to distinguish them
                const galleriesWithType = galleriesRes.data.map(g => ({ ...g, type: 'gallery' }));
                const collectionsWithType = collectionsRes.data.map(c => ({ ...c, type: 'collection' }));

                // Combine and sort the items by their displayOrder
                const allItems = [...galleriesWithType, ...collectionsWithType];
                allItems.sort((a, b) => a.displayOrder - b.displayOrder);

                setHubItems(allItems);
            } catch (err) {
                setError('Kon de hub-items niet laden. Probeer het later opnieuw.');
                console.error("Error fetching hub data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHubData();
    }, []);

    return (
        <main className="public-galleries-container">
            <header className="public-galleries-header">
                <h1>Gallerij Hub</h1>
                <p>Ontdek de prachtige kunstwerken van onze getalenteerde studenten en speciale collecties.</p>
            </header>

            {loading && <p className="loading-message">Items worden geladen...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="public-galleries-grid">
                {hubItems.map(item => (
                    <HubCard key={`${item.type}-${item.id}`} item={item} />
                ))}
            </div>
        </main>
    );
}

export default PublicGalleries;