import './UserGallery.css';
import { useState } from 'react';
import UploadModal from '../../components/user/UploadModal.jsx';
import GalleryGrid from '../../components/user/GalleryGrid.jsx';
import ArtworkPreviewModal from "../../components/user/ArtworkPreviewModal.jsx";
import useGallery from "../../hooks/useGallery.js";
import { uploadArtwork } from '../../helpers/artworkHelpers.js';
import useAuth from "../../hooks/useAuth.js";

function UserGallery() {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const { artworks, fetchArtworks, loading, error } = useGallery(user.email);

    const handleUpload = async () => {
        try {
            await uploadArtwork({ email: user.email, title, year, file });
            alert("Kunstwerk succesvol toegevoegd!");
            setTitle("");
            setYear("");
            setFile(null);
            setShowModal(false);
            fetchArtworks();
        } catch (err) {
            console.error("Upload mislukt:", err);
            alert("Er ging iets mis tijdens uploaden.");
        }
    };

    const handleDelete = async (artworkId) => {
        const confirmDelete = window.confirm("Weet je zeker dat je dit kunstwerk wilt verwijderen?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/galleries/${user.email}/artworks/${artworkId}`);
            alert("Kunstwerk verwijderd");
            setShowPreview(false);
            fetchArtworks();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Verwijderen mislukt.");
        }
    };

    return (
        <main className="gallery-outer-container">
            <div className="gallery-title-container">
                <h2 className="gallery-title">{user.student.firstname}'s Gallerij</h2>
                <button
                    aria-label="Upload een nieuw kunstwerk"
                    type="button"
                    className="open-upload-button"
                    onClick={() => setShowModal(true)}
                >
                    Upload kunstwerk
                </button>
            </div>

            {loading && <p className="loading">Laden...</p>}
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
                    onDelete={handleDelete}
                    onClose={() => setShowPreview(false)}
                />
            )}

            <section className="gallery-inner-container">
                <GalleryGrid
                    artworks={artworks}
                    onSelect={(art) => {
                        setSelectedArtwork(art);
                        setShowPreview(true);
                    }}
                />
            </section>
        </main>
    );
}

export default UserGallery;

