import './UserGallery.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {shuffleArray} from "../../helpers/shuffleArray.js";

function UserGallery() {
    const [artworks, setArtworks] = useState([]);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchArtworks = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/galleries/${user.email}/artworks`);
            const shuffled = shuffleArray(response.data);
            setArtworks(shuffled);
        } catch (err) {
            console.error("Error fetching artworks:", err);
        }
    };

    useEffect(() => {
        fetchArtworks();
    }, []);

    const handleUpload = async () => {
        try {
            const metadataRes = await axios.post(`http://localhost:8080/galleries/${user.email}/artworks`, {
                title,
                year,
            });

            const artworkId = metadataRes.data.id;

            const formData = new FormData();
            formData.append("file", file);

            await axios.post(`http://localhost:8080/artworks/${artworkId}/photo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

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
                 <button className="open-upload-button" onClick={() => setShowModal(true)}>Upload kunstwerk</button>
            </div>


            {showModal && (
                <div className="modal-overlay">
                <div className="modal-content">
                        <h3>Upload nieuw kunstwerk</h3>
                        <input type="text" placeholder="Titel" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <input type="text" placeholder="Jaar" value={year} onChange={(e) => setYear(e.target.value)} />
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                        <div className="modal-buttons">
                            <button onClick={handleUpload}>Upload</button>
                            <button onClick={() => setShowModal(false)}>Annuleer</button>
                        </div>
                    </div>
                </div>
            )}

            {showPreview && selectedArtwork && (
                <div className="modal-overlay" onClick={() => setShowPreview(false)}>
                    <div className="modal-content-preview" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={`http://localhost:8080/artworks/${selectedArtwork.id}/photo`}
                            alt={selectedArtwork.title}
                            className="preview-photo"
                        />
                        <h3>{selectedArtwork.title}</h3>
                        <p><strong>Jaar:</strong> {selectedArtwork.year}</p>
                        <p><strong>Kunstenaar:</strong> {selectedArtwork.artistName}</p>
                        <button className="photo-delete-button" onClick={() => handleDelete(selectedArtwork.id)}>Verwijder</button>
                        <button className="photo-cancel-button" onClick={() => setShowPreview(false)}>Sluiten</button>
                    </div>
                </div>
            )}

            <section className="gallery-inner-container">
                <div className="gallery-grid">
                    {artworks.map((art) => (
                        <div key={art.id} className="gallery-card">
                            <img
                                src={`http://localhost:8080/artworks/${art.id}/photo`}
                                alt={art.title}
                                className="gallery-photo"
                                onClick={() => {
                                    setSelectedArtwork(art);
                                    setShowPreview(true);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default UserGallery;
