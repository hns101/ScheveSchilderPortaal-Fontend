import './UserGallery.css';
import { useState } from 'react';
import UploadModal from '../../components/user/UploadModal.jsx';
import GalleryGrid from '../../components/user/GalleryGrid.jsx';
import ArtworkPreviewModal from '../../components/user/ArtworkPreviewModal.jsx';
import useGallery from '../../hooks/useGallery.js';
import { uploadArtwork } from '../../helpers/artworkHelpers.js';
import useAuth from '../../hooks/useAuth.js';

function UserGallery() {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [file, setFile] = useState(null);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const {
        artworks,
        loading,
        error,
        fetchArtworks,
        deleteArtwork,
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
            await deleteArtwork(artworkId);
            alert("Kunstwerk verwijderd");
            setShowPreview(false);
            fetchArtworks();
        } catch (err) {
            console.error("Verwijderen mislukt:", err);
            alert("Fout bij verwijderen.");
        }
    };

    const openPreview = async (art) => {
        try {
            await loadPreviewImage(art.id);
            setSelectedArtwork(art);
            setShowPreview(true);
        } catch (err) {
            console.error("Preview mislukt", err);
            alert("Kon afbeelding niet laden.");
        }
    };

    const closePreview = () => {
        clearPreviewImage();
        setShowPreview(false);
        setSelectedArtwork(null);
    };

    return (
        <main className="gallery-outer-container">
            <div className="gallery-title-container">
                <h2 className="gallery-title">{user.student.firstname}'s Gallerij</h2>
                <button
                    className="open-upload-button"
                    aria-label="Upload een nieuw kunstwerk"
                    onClick={() => setShowModal(true)}
                >
                    Upload kunstwerk
                </button>
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
                <ArtworkPreviewModal
                    artwork={selectedArtwork}
                    imageUrl={previewImageUrl}
                    onDelete={handleDelete}
                    onClose={closePreview}
                />
            )}

            <section className="gallery-inner-container">
                <GalleryGrid artworks={artworks} onSelect={openPreview} />
            </section>
        </main>
    );
}

export default UserGallery;



