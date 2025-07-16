import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { authApiClient } from '../../api/api.js';
import './CollectionEditor.css';

// --- Draggable Artwork Item Component ---
function SortableArtworkItem({ id, artwork, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    const imageUrl = `http://localhost:8080/public/artworks/${artwork.id}/photo`;

    return (
        <li ref={setNodeRef} style={style} className="artwork-list-item">
            <span className="drag-handle" {...attributes} {...listeners}>☰</span>
            <img src={imageUrl} alt={artwork.title} className="artwork-preview-thumb" />
            <div className="artwork-details">
                <strong>{artwork.title}</strong>
                <small>({artwork.year}) - ID: {artwork.id}</small>
            </div>
            <button className="remove-artwork-button" onClick={() => onRemove(artwork.id)}>Verwijder</button>
        </li>
    );
}

function CollectionEditor() {
    const { collectionId } = useParams();
    const [collection, setCollection] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        const fetchCollection = async () => {
            setLoading(true);
            try {
                const response = await authApiClient.get(`/admin/collections/${collectionId}`);
                setCollection(response.data);
                setArtworks(response.data.artworks || []);
            } catch (err) {
                setError('Kon de collectie niet laden.');
                console.error("Error fetching collection:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCollection();
    }, [collectionId]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setArtworks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleRemoveArtwork = async (artworkId) => {
        if (!window.confirm("Weet je zeker dat je dit kunstwerk uit de collectie wilt verwijderen?")) return;
        try {
            await authApiClient.delete(`/admin/collections/${collectionId}/artworks/${artworkId}`);
            setArtworks(prev => prev.filter(art => art.id !== artworkId));
            alert("Kunstwerk verwijderd uit collectie.");
        } catch (err) {
            setError('Kon kunstwerk niet verwijderen.');
        }
    };

    // Note: Saving the new artwork order would require another backend endpoint.
    // For now, this component only manages adding/removing.

    if (loading) return <p>Laden...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!collection) return <p>Collectie niet gevonden.</p>;

    return (
        <main className="collection-editor-container">
            <header className="collection-editor-header">
                <h1>Beheer Collectie: "{collection.name}"</h1>
                <Link to="/gallerij-beheer" className="back-link">← Terug naar Overzicht</Link>
            </header>

            <p>Sleep de kunstwerken om hun weergavevolgorde binnen deze collectie aan te passen.</p>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <ul className="artwork-list">
                    <SortableContext items={artworks.map(art => art.id)} strategy={verticalListSortingStrategy}>
                        {artworks.map(artwork => (
                            <SortableArtworkItem
                                key={artwork.id}
                                id={artwork.id}
                                artwork={artwork}
                                onRemove={handleRemoveArtwork}
                            />
                        ))}
                    </SortableContext>
                </ul>
            </DndContext>
        </main>
    );
}

export default CollectionEditor;