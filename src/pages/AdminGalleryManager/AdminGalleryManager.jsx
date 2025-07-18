import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { apiClient, authApiClient } from '../../api/api.js';
import './AdminGalleryManager.css';

// Helper to format the artist's name
const getDisplayName = (student) => {
    if (!student || !student.firstname) return 'Onbekende Artiest';
    const lastNameInitial = student.lastname ? ` ${student.lastname}.` : '';
    return `${student.firstname}${lastNameInitial}`;
};

// --- Draggable Item for Student Galleries ---
function SortableGalleryItem({ id, gallery }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    const coverPhotoUrl = gallery.coverArtworkId
        ? `http://localhost:8080/public/artworks/${gallery.coverArtworkId}/photo`
        : 'https://placehold.co/100x100/EFEFEF/AAAAAA&text=...';

    return (
        <li ref={setNodeRef} style={style} className="gallery-list-item">
            <span className="drag-handle" {...attributes} {...listeners}>☰</span>
            <img src={coverPhotoUrl} alt="Cover" className="item-cover-preview" />
            <div className="item-info">
                <strong>{getDisplayName(gallery.student)}</strong>
                <small>(Galerij ID: {gallery.id})</small>
            </div>
            {/* --- NEW: Visit Gallery Button --- */}
            <div className="item-actions">
                <Link to={`/gallery/${gallery.student.id}`} className="visit-gallery-button" target="_blank" rel="noopener noreferrer">
                    Bezoek
                </Link>
            </div>
        </li>
    );
}

// --- Draggable Item for Admin Collections ---
function SortableCollectionItem({ id, collection, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    const navigate = useNavigate();
    const coverPhotoUrl = collection.coverArtworkId
        ? `http://localhost:8080/public/artworks/${collection.coverArtworkId}/photo`
        : 'https://placehold.co/100x100/EFEFEF/AAAAAA&text=...';

    return (
        <li ref={setNodeRef} style={style} className="gallery-list-item">
            <span className="drag-handle" {...attributes} {...listeners}>☰</span>
            <img src={coverPhotoUrl} alt="Cover" className="item-cover-preview" />
            <div className="item-info">
                <strong>{collection.name}</strong>
                <small>(Collectie ID: {collection.id})</small>
            </div>
            <div className="item-actions">
                <button className="edit-collection-button" onClick={() => navigate(`/admin/collection-editor/${collection.id}`)}>Bewerken</button>
                <button className="delete-collection-button" onClick={() => onDelete(collection.id)}>Verwijderen</button>
            </div>
        </li>
    );
}

function AdminGalleryManager() {
    const [galleries, setGalleries] = useState([]);
    const [collections, setCollections] = useState([]);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const sensors = useSensors(useSensor(PointerSensor));

    // Fetch both galleries and collections on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [galleriesRes, collectionsRes] = await Promise.all([
                    apiClient.get('/public/galleries'),
                    authApiClient.get('/admin/collections')
                ]);
                setGalleries(galleriesRes.data);
                setCollections(collectionsRes.data);
            } catch (err) {
                setError('Kon gegevens niet laden.');
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Drag handlers for the two separate lists
    const handleGalleryDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setGalleries((items) => arrayMove(items, items.findIndex(item => item.id === active.id), items.findIndex(item => item.id === over.id)));
        }
    };
    const handleCollectionDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setCollections((items) => arrayMove(items, items.findIndex(item => item.id === active.id), items.findIndex(item => item.id === over.id)));
        }
    };

    // Save handlers for the two separate lists
    const handleSaveGalleryOrder = async () => {
        const orderedIds = galleries.map(g => g.id);
        try {
            await authApiClient.put('/admin/galleries/order', { galleryIds: orderedIds });
            alert('Galerij volgorde opgeslagen!');
        } catch (err) {
            setError('Kon galerij volgorde niet opslaan.');
        }
    };
    const handleSaveCollectionOrder = async () => {
        const orderedIds = collections.map(c => c.id);
        try {
            await authApiClient.put('/admin/collections/order', { galleryIds: orderedIds }); // Re-using DTO, backend expects 'galleryIds'
            alert('Collectie volgorde opgeslagen!');
        } catch (err) {
            setError('Kon collectie volgorde niet opslaan.');
        }
    };

    // Handlers for creating and deleting collections
    const handleCreateCollection = async (e) => {
        e.preventDefault();
        if (!newCollectionName.trim()) return;
        try {
            const response = await authApiClient.post('/admin/collections', { name: newCollectionName });
            setCollections(prev => [...prev, response.data]);
            setNewCollectionName('');
        } catch (err) {
            setError('Kon collectie niet aanmaken.');
        }
    };

    const handleDeleteCollection = async (id) => {
        if (!window.confirm("Weet je zeker dat je deze collectie wilt verwijderen? Dit kan niet ongedaan worden gemaakt.")) return;
        try {
            await authApiClient.delete(`/admin/collections/${id}`);
            setCollections(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            setError('Kon collectie niet verwijderen.');
        }
    };

    return (
        <main className="admin-gallery-manager">
            {loading && <p>Laden...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* --- Galleries Management Section --- */}
            <div className="management-section">
                <div className="admin-gallery-header">
                    <h2>Beheer Studentengalerijen</h2>
                    <p>Sleep de galerijen om de weergavevolgorde op de publieke hub-pagina aan te passen.</p>
                    {/* --- NEW: Link to Public Hub --- */}
                    <Link to="/galleries" className="view-public-hub-button" target="_blank" rel="noopener noreferrer">
                        Bekijk Publieke Hub
                    </Link>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleGalleryDragEnd}>
                    <ul className="gallery-list">
                        <SortableContext items={galleries.map(g => g.id)} strategy={verticalListSortingStrategy}>
                            {galleries.map((gallery) => (
                                <SortableGalleryItem key={gallery.id} id={gallery.id} gallery={gallery} />
                            ))}
                        </SortableContext>
                    </ul>
                </DndContext>
                <button className="save-order-button" onClick={handleSaveGalleryOrder}>
                    Galerij Volgorde Opslaan
                </button>
            </div>

            {/* --- Collections Management Section --- */}
            <div className="management-section">
                <div className="admin-gallery-header">
                    <h2>Beheer Collecties</h2>
                    <p>Maak nieuwe collecties aan en bepaal hun weergavevolgorde.</p>
                </div>
                <form onSubmit={handleCreateCollection} className="create-collection-form">
                    <input
                        type="text"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        placeholder="Nieuwe collectienaam"
                    />
                    <button type="submit">Aanmaken</button>
                </form>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCollectionDragEnd}>
                    <ul className="gallery-list">
                        <SortableContext items={collections.map(c => c.id)} strategy={verticalListSortingStrategy}>
                            {collections.map((collection) => (
                                <SortableCollectionItem key={collection.id} id={collection.id} collection={collection} onDelete={handleDeleteCollection} />
                            ))}
                        </SortableContext>
                    </ul>
                </DndContext>
                <button className="save-order-button" onClick={handleSaveCollectionOrder}>
                    Collectie Volgorde Opslaan
                </button>
            </div>
        </main>
    );
}

export default AdminGalleryManager;