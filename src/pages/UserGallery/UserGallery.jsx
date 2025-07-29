import './UserGallery.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import UploadModal from '../../components/user/UploadModal.jsx';
import GalleryGrid from '../../components/user/GalleryGrid.jsx';
import ArtworkModal from '../../components/common/ArtworkModal.jsx';
import useGallery from '../../hooks/useGallery.js';
import { uploadArtwork } from '../../helpers/artworkHelpers.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { authApiClient } from '../../api/api.js';
import ToggleSwitch from '../../components/common/ToggleSwitch.jsx';

function UserGallery() {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [file, setFile] = useState(null);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const {
        gallery,
        artworks,
        loading,
        error,
        fetchArtworks,
        fetchGallery,
        deleteArtwork,
        setCoverPhoto,
        previewImageUrl,
        loadPreviewImage,
        clearPreviewImage
    } = useGallery(user.email);

    const handleUpload = async () => {
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

    const openPreview = async (art) => {
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
                <ArtworkModal
                    artwork={selectedArtwork}
                    artist={user.student}
                    onClose={closePreview}
                    isOwner={true}
                    isAdmin={user.roles?.includes("ROLE_ADMIN")}
                    isCover={gallery?.coverArtworkId === selectedArtwork.id}
                    onSetCover={handleSetCover}
                    onDelete={handleDelete} // --- CHANGE: Use the new onDelete prop ---
                />
            )}

            <section className="gallery-inner-container">
                <GalleryGrid artworks={artworks} onSelect={openPreview} />
            </section>
        </main>
    );
}

export default UserGallery;
