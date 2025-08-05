import './UserGallery.css';
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import UploadModal from '../../components/user/UploadModal.jsx';
import GalleryGrid from '../../components/user/GalleryGrid.jsx';
import useGallery from '../../hooks/useGallery.js';
import { uploadArtwork } from '../../helpers/artworkHelpers.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { authApiClient } from '../../api/api.js';
import ToggleSwitch from '../../components/common/ToggleSwitch.jsx';
import { shuffleArray } from '../../helpers/shuffleArray.js';

// --- NEW: Local Modal Component, defined inside UserGallery ---
// This modal is completely separate from the shared ArtworkModal
function UserGalleryModal({ artwork, imageUrl, onClose, onSetCover, isCover, onDelete }) {
    if (!artwork) return null;

    const handleModalContentClick = (e) => e.stopPropagation();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content-photo" onClick={handleModalContentClick}>
                <button className="modal-close-button" onClick={onClose}>×</button>
                <div className="modal-image-container">
                    {/* It uses the pre-loaded imageUrl */}
                    <img src={imageUrl} alt={artwork.title} />
                </div>
                <div className="modal-info">
                    <h2 className="modal-title">{artwork.title}</h2>
                    <p className="modal-detail"><strong>Jaar:</strong> {artwork.year}</p>
                    <div className="modal-actions">
                        {isCover ? (
                            <button className="set-cover-button disabled" disabled>Huidige Omslagfoto</button>
                        ) : (
                            <button className="set-cover-button" onClick={() => onSetCover(artwork.id)}>Instellen als Omslagfoto</button>
                        )}
                        <button className="delete-button" onClick={() => onDelete(artwork.id)}>Verwijder Kunstwerk</button>
                    </div>
                </div>
            </div>
        </div>
    );
}


function UserGallery() {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [file, setFile] = useState(null);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    // --- NEW: Thumbnail state is now managed here ---
    const [thumbnails, setThumbnails] = useState({});

    const {
        gallery,
        artworks,
        loading,
        error,
        fetchArtworks,
        fetchGallery,
        setCoverPhoto,
    } = useGallery(user.email);

    // Shuffle artworks once when they are loaded
    const shuffledArtworks = useMemo(() => shuffleArray(artworks), [artworks]);

    // --- NEW: Thumbnail loading logic is now here ---
    useEffect(() => {
        const loadThumbnails = async () => {
            const newThumbs = {};
            for (const art of shuffledArtworks) {
                try {
                    // Note: This still uses a separate request for each image,
                    // which is necessary for blob URLs.
                    const res = await authApiClient.get(`/artworks/${art.id}/photo`, {
                        responseType: "blob"
                    });
                    const url = URL.createObjectURL(res.data);
                    newThumbs[art.id] = url;
                } catch (err) {
                    console.error(`Kan afbeelding niet laden voor artwork ${art.id}`, err);
                }
            }
            // Clean up old blob URLs before setting new ones
            Object.values(thumbnails).forEach(url => URL.revokeObjectURL(url));
            setThumbnails(newThumbs);
        };

        if (shuffledArtworks.length > 0) {
            loadThumbnails();
        }

        // Cleanup function to revoke URLs when the component unmounts
        return () => {
            Object.values(thumbnails).forEach(url => URL.revokeObjectURL(url));
        };
    }, [shuffledArtworks]);


    const handleUpload = async () => {
        if (!title.trim() || !year.trim() || !file) {
            alert("Vul alstublieft alle velden in (Titel, Jaar, en Bestand) voordat u uploadt.");
            return;
        }
        try {
            await uploadArtwork({ email: user.email, title, year, file });
            alert("Kunstwerk succesvol toegevoegd!");
            setShowModal(false);
            setTitle("");
            setYear("");
            setFile(null);
            fetchArtworks();
        } catch (err) {
            console.error("Upload mislukt:", err);
            alert("Er ging iets mis tijdens uploaden.");
        }
    };

    const handleDelete = async (artworkId) => {
        if (!window.confirm("Weet je zeker dat je dit kunstwerk wilt verwijderen?")) return;
        try {
            await authApiClient.delete(`/galleries/${user.email}/artworks/${artworkId}`);
            alert("Kunstwerk verwijderd");
            setShowPreview(false);
            fetchArtworks();
        } catch (err) {
            console.error("Verwijderen mislukt:", err);
            alert("Fout bij verwijderen.");
        }
    };

    const openPreview = (art) => {
        setSelectedArtwork(art);
        setShowPreview(true);
    };

    const closePreview = () => {
        setShowPreview(false);
        setSelectedArtwork(null);
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await authApiClient.put(`/galleries/${user.email}/status`, { isPublic: newStatus });
            if (fetchGallery) {
                fetchGallery();
            }
        } catch (err) {
            console.error("Status update failed:", err);
            alert("Kon de status van de galerij niet bijwerken.");
        }
    };

    const handleSetCover = async (artworkId) => {
        try {
            await setCoverPhoto(artworkId);
            alert("Omslagfoto succesvol ingesteld!");
            closePreview();
            fetchGallery();
        } catch (err) {
            console.error("Set cover failed:", err);
            alert("Kon omslagfoto niet instellen.");
        }
    };

    return (
        <main className="gallery-outer-container">
            <div className="gallery-title-container">
                <Link to="/galleries" className="view-public-button">
                    Gallerijen Hub
                </Link>
                <h2 className="gallery-title">{user.student.firstname}'s Gallerij</h2>
            </div>

            <div className="gallery-settings-container">
                <button
                    className="open-upload-button"
                    aria-label="Upload een nieuw kunstwerk"
                    onClick={() => setShowModal(true)}
                >
                    Upload kunstwerk
                </button>
                <ToggleSwitch
                    label={gallery?.isPublic ? "Publieke galerij" : "Privé gallerij"}
                    checked={gallery?.isPublic || false}
                    onChange={handleStatusChange}
                />
            </div>

            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}

            {showModal && (
                <UploadModal
                    title={title}
                    year={year}
                    file={file}
                    setTitle={setTitle}
                    setYear={setYear}
                    setFile={setFile}
                    onUpload={handleUpload}
                    onClose={() => setShowModal(false)}
                />
            )}

            {showPreview && selectedArtwork && (
                <UserGalleryModal
                    artwork={selectedArtwork}
                    imageUrl={thumbnails[selectedArtwork.id]}
                    onClose={closePreview}
                    isCover={gallery?.coverArtworkId === selectedArtwork.id}
                    onSetCover={handleSetCover}
                    onDelete={handleDelete}
                />
            )}

            <section className="gallery-inner-container">
                <GalleryGrid
                    artworks={shuffledArtworks}
                    thumbnails={thumbnails}
                    onSelect={openPreview}
                />
            </section>
        </main>
    );
}

export default UserGallery;
