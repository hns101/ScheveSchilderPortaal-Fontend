
function UploadModal({ title, setTitle, year, setYear, setFile, onUpload, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Upload nieuw kunstwerk</h3>
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
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <div className="modal-buttons">
                    <button type="button" onClick={onUpload}>Upload</button>
                    <button type="button" onClick={onClose}>Annuleer</button>
                </div>
            </div>
        </div>
    );
}

export default UploadModal;
