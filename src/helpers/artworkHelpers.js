import axios from "axios";

export async function uploadArtwork({ email, title, year, file }) {
    const metadataRes = await axios.post(`http://localhost:8080/galleries/${email}/artworks`, { title, year });
    const artworkId = metadataRes.data.id;

    const formData = new FormData();
    formData.append("file", file);

    await axios.post(`http://localhost:8080/artworks/${artworkId}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    return artworkId;
}
