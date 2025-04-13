import './UserGallery.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function UserGallery() {
    const [artworks, setArtworks] = useState([]);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchArtworks = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/galleries/${user.email}/artworks`);
            setArtworks(response.data);
        } catch (err) {
            console.error("Error fetching artworks:", err);
        }
    };

    useEffect(() => {
        fetchArtworks();
    }, []);

    const handleUpload = async () => {
        try {
            // Step 1: Save metadata
            const metadataRes = await axios.post(`http://localhost:8080/galleries/${user.email}/artworks`, {
                title,
                year,
            });

            const artworkId = metadataRes.data.id;

            // Step 2: Upload photo
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
            fetchArtworks();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Verwijderen mislukt.");
        }
    };

    return (
        <main className="gallery-outer-container">
            <h2 className="gallery-title">Jouw Gallerij</h2>
            <div className="gallery-upload">
                <input
                    type="text"
                    placeholder="Titel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Jaar"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                />
                <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
                <button onClick={handleUpload}>Upload</button>
            </div>
            <section className="gallery-inner-container">
                <div className="gallery-grid">
                    {artworks.map((art) => (
                        <div key={art.id} className="gallery-card">
                            <img
                                src={`http://localhost:8080/artworks/${art.id}/photo`}
                                alt={art.title}
                                className="gallery-photo"
                            />
                            <h4>{art.title}</h4>
                            <p>{art.year}</p>
                            <p>{art.artistName}</p>
                            <button onClick={() => handleDelete(art.id)}>Verwijder</button>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default UserGallery;
