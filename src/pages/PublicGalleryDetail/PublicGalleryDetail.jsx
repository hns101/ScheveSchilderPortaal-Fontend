import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, authApiClient } from '../../api/api.js';
import ArtworkModal from '../../components/common/ArtworkModal.jsx';
import UploadModal from '../../components/user/UploadModal.jsx';
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
    const [collections, setCollections] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [file, setFile] = useState(null);

    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    const isOwner = user?.student?.id === Number(studentId);

    const fetchGalleryDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/public/gallery/${studentId}`);
            setGallery(response.data);
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
        if (!isAdmin && !isOwner) return;
        try {
            // Use the admin endpoint which works with studentId
            await authApiClient.put(`/admin/galleries/${studentId}/cover/${artworkId}`);
            alert("Omslagfoto succesvol ingesteld!");
            setSelectedArtwork(null);
            fetchGalleryDetails();
        } catch (err) {
            console.error("Set cover failed:", err);
            alert("Kon omslagfoto niet instellen.");
        }
    };

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

    const handleAdminDelete = async (artworkId) => {
        if (!isAdmin) return;
        if (!window.confirm("Weet je zeker dat je dit kunstwerk permanent wilt verwijderen? Dit kan niet ongedaan worden gemaakt.")) return;
        try {
            await authApiClient.delete(`/admin/artworks/${artworkId}`);
            alert("Kunstwerk succesvol verwijderd.");
            setSelectedArtwork(null);
            fetchGalleryDetails();
        } catch (err) {
            console.error("Admin delete failed:", err);
            alert("Kon kunstwerk niet verwijderen.");
        }
    };

    const handleAdminUpload = async () => {
        if (!isAdmin || !file) return;
        const formData = new FormData();
        formData.append('title', title);
        formData.append('year', year);
        formData.append('file', file);
        try {
            await authApiClient.post(`/admin/galleries/${studentId}/artworks`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert("Kunstwerk succesvol toegevoegd aan de galerij van deze student!");
            setShowUploadModal(false);
            setTitle("");
            setYear("");
            setFile(null);
            fetchGalleryDetails();
        } catch (err) {
            console.error("Admin upload failed:", err);
            alert("Er ging iets mis tijdens het uploaden.");
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
                    <div className="header-controls">
                        {isAdmin && (
                            <button className="admin-upload-button" onClick={() => setShowUploadModal(true)}>
                                Upload Kunstwerk
                            </button>
                        )}
                        <Link to="/galleries" className="back-to-hub-link">← Terug naar de Gallerij Hub</Link>
                    </div>
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
                    artist={selectedArtwork.artist} // Pass the entire artist object
                    onClose={() => setSelectedArtwork(null)}
                    isOwner={isOwner}
                    isAdmin={isAdmin}
                    isCover={gallery?.coverArtworkId === selectedArtwork.id}
                    onSetCover={handleSetCover}
                    collections={collections}
                    onAddToCollection={handleAddToCollection}
                    onAdminDelete={handleAdminDelete}
                />
            )}

            {isAdmin && showUploadModal && (
                <UploadModal
                    title={title}
                    year={year}
                    file={file}
                    setTitle={setTitle}
                    setYear={setYear}
                    setFile={setFile}
                    onUpload={handleAdminUpload}
                    onClose={() => setShowUploadModal(false)}
                />
            )}
        </>
    );
}

export default PublicGalleryDetail;