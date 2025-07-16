import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, authApiClient } from '../../api/api.js';
import ArtworkModal from '../../components/common/ArtworkModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import './PublicGalleryDetail.css';

const getDisplayName = (student) => {
    if (!student || !student.firstname) return 'een artiest';
    const lastNameInitial = student.lastname ? ` ${student.lastname}.` : '';
    return `${student.firstname}${lastNameInitial}`;
};

function PublicGalleryDetail() {
    const { studentId } = useParams();
    const { user } = useAuth();
    const [gallery, setGallery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedArtwork, setSelectedArtwork] = useState(null);

    // --- NEW: State for admin features ---
    const [collections, setCollections] = useState([]);
    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    const isOwner = user?.student?.id === Number(studentId);

    const fetchGalleryDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/public/gallery/${studentId}`);
            setGallery(response.data);

            // --- NEW: If user is admin, fetch all collections ---
            if (isAdmin) {
                const collectionsRes = await authApiClient.get('/admin/collections');
                setCollections(collectionsRes.data);
            }

        } catch (err) {
            setError('Deze galerij kon niet worden gevonden of is privé.');
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    }, [studentId, isAdmin]);

    useEffect(() => {
        fetchGalleryDetails();
    }, [fetchGalleryDetails]);

    const handleSetCover = async (artworkId) => {
        if (!isOwner && !isAdmin) return; // Allow admin or owner
        const userEmail = gallery.student.userEmail; // Assuming DTO provides this
        try {
            await authApiClient.put(`/galleries/${userEmail}/cover/${artworkId}`);
            alert("Omslagfoto succesvol ingesteld!");
            setSelectedArtwork(null);
            fetchGalleryDetails();
        } catch (err) {
            console.error("Set cover failed:", err);
            alert("Kon omslagfoto niet instellen.");
        }
    };

    // --- NEW: Handler for adding artwork to a collection ---
    const handleAddToCollection = async (collectionId, artworkId) => {
        if (!isAdmin) return;
        try {
            await authApiClient.post(`/admin/collections/${collectionId}/artworks`, { artworkId });
            alert(`Kunstwerk toegevoegd aan collectie!`);
        } catch (err) {
            console.error("Add to collection failed:", err);
            alert("Kon kunstwerk niet toevoegen aan collectie.");
        }
    };

    if (loading) return <p className="gallery-detail-message">Laden...</p>;
    if (error) return <p className="gallery-detail-message error">{error}</p>;

    const artistName = getDisplayName(gallery.student);

    return (
        <>
            <main className="gallery-detail-container">
                <header className="gallery-detail-header">
                    <h1>Galerij van {artistName}</h1>
                    <Link to="/galleries" className="back-to-hub-link">← Terug naar de Gallerij Hub</Link>
                </header>

                <div className="artwork-grid">
                    {gallery.artworks?.map(artwork => (
                        <div key={artwork.id} className="artwork-card" onClick={() => setSelectedArtwork(artwork)}>
                            <img src={`http://localhost:8080/public/artworks/${artwork.id}/photo`} alt={artwork.title} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/EFEFEF/AAAAAA&text=Fout+bij+laden'; }} />
                            <div className="artwork-info"><p className="artwork-title">{artwork.title}</p><p className="artwork-year">{artwork.year}</p></div>
                        </div>
                    ))}
                </div>
            </main>

            {selectedArtwork && (
                <ArtworkModal
                    artwork={selectedArtwork}
                    artistName={artistName}
                    onClose={() => setSelectedArtwork(null)}
                    isOwner={isOwner}
                    isAdmin={isAdmin} // Pass admin status
                    isCover={gallery?.coverArtworkId === selectedArtwork.id}
                    onSetCover={handleSetCover}
                    collections={collections} // Pass the list of collections
                    onAddToCollection={handleAddToCollection} // Pass the handler
                />
            )}
        </>
    );
}

export default PublicGalleryDetail;