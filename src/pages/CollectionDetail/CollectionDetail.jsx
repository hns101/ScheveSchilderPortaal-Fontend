import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, authApiClient } from '../../api/api.js';
import ArtworkModal from '../../components/common/ArtworkModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import './CollectionDetail.css';

function CollectionDetail() {
    const { collectionId } = useParams();
    const { user } = useAuth(); // Get the logged-in user
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedArtwork, setSelectedArtwork] = useState(null);

    const isAdmin = user?.roles?.includes("ROLE_ADMIN");

    const fetchCollectionDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/public/collection/${collectionId}`);
            setCollection(response.data);
        } catch (err) {
            setError('Deze collectie kon niet worden gevonden.');
            console.error("Error fetching collection details:", err);
        } finally {
            setLoading(false);
        }
    }, [collectionId]);

    useEffect(() => {
        fetchCollectionDetails();
    }, [fetchCollectionDetails]);

    const handleSetCover = async (artworkId) => {
        if (!isAdmin) return;
        try {
            await authApiClient.put(`/admin/collections/${collectionId}/cover/${artworkId}`);
            alert("Omslagfoto voor collectie succesvol ingesteld!");
            setSelectedArtwork(null); // Close the modal
            fetchCollectionDetails(); // Refresh to show the change
        } catch (err) {
            console.error("Set collection cover failed:", err);
            alert("Kon omslagfoto voor collectie niet instellen.");
        }
    };

    const handleRemoveFromCollection = async (artworkId) => {
        if (!isAdmin) return;
        if (!window.confirm("Weet je zeker dat je dit kunstwerk uit de collectie wilt verwijderen?")) return;
        try {
            await authApiClient.delete(`/admin/collections/${collectionId}/artworks/${artworkId}`);
            alert("Kunstwerk verwijderd uit collectie.");
            setSelectedArtwork(null); // Close the modal
            fetchCollectionDetails(); // Refresh the artwork list
        } catch (err) {
            console.error("Remove from collection failed:", err);
            alert("Kon kunstwerk niet uit collectie verwijderen.");
        }
    };

    if (loading) return <p className="collection-detail-message">Collectie wordt geladen...</p>;
    if (error) return <p className="collection-detail-message error">{error}</p>;

    return (
        <>
            <main className="collection-detail-container">
                <header className="collection-detail-header">
                    <h1>Collectie: {collection.name}</h1>
                    <Link to="/galleries" className="back-to-hub-link">← Terug naar de Gallerij Hub</Link>
                </header>

                <div className="artwork-grid">
                    {collection.artworks && collection.artworks.length > 0 ? (
                        collection.artworks.map(artwork => (
                            <div key={artwork.id} className="artwork-card" onClick={() => setSelectedArtwork(artwork)}>
                                <img
                                    src={`http://localhost:8080/public/artworks/${artwork.id}/photo`}
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
                        <p>Deze collectie heeft nog geen kunstwerken.</p>
                    )}
                </div>
            </main>

            {selectedArtwork && (
                <ArtworkModal
                    artwork={selectedArtwork}
                    artist={selectedArtwork.artist} // Pass the entire artist object
                    onClose={() => setSelectedArtwork(null)}
                    isAdmin={isAdmin}
                    isCover={collection?.coverArtworkId === selectedArtwork.id}
                    onSetCover={handleSetCover}
                    onRemoveFromCollection={handleRemoveFromCollection}
                />
            )}
        </>
    );
}

export default CollectionDetail;