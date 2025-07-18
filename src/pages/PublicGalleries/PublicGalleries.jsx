import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/api.js';
import HubCard from '../../components/public/HubCard.jsx';
import './PublicGalleries.css';

function PublicGalleries() {
    const [hubItems, setHubItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHubData = async () => {
            setLoading(true);
            try {
                const [galleriesRes, collectionsRes] = await Promise.all([
                    apiClient.get('/public/galleries'),
                    apiClient.get('/public/collections')
                ]);

                const galleriesWithType = galleriesRes.data.map(g => ({ ...g, type: 'gallery' }));
                const collectionsWithType = collectionsRes.data.map(c => ({ ...c, type: 'collection' }));

                const allItems = [...galleriesWithType, ...collectionsWithType];

                // --- UPDATED SORTING LOGIC ---
                allItems.sort((a, b) => {
                    // Rule 1: If one is a collection and the other is not, the collection always comes first.
                    if (a.type === 'collection' && b.type !== 'collection') {
                        return -1; // a comes before b
                    }
                    if (a.type !== 'collection' && b.type === 'collection') {
                        return 1; // b comes before a
                    }

                    // Rule 2: If both are the same type, sort by their displayOrder.
                    return a.displayOrder - b.displayOrder;
                });

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
