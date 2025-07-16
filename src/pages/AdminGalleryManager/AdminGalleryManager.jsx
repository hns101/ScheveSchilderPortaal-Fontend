import React, { useState, useEffect } from 'react';
// NEW: Import from @dnd-kit
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

// NEW: A separate component for each draggable item
function SortableGalleryItem({ id, gallery }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="gallery-list-item"
        >
            <span className="drag-handle">☰</span>
            <div className="gallery-info">
                <strong>{getDisplayName(gallery.student)}</strong>
                <small>(ID: {gallery.id})</small>
            </div>
        </li>
    );
}


function AdminGalleryManager() {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Define sensors for pointer devices (mouse, touch)
    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    useEffect(() => {
        const fetchGalleries = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/public/galleries');
                setGalleries(response.data);
            } catch (err) {
                setError('Kon de galerijen niet laden.');
                console.error("Error fetching galleries:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGalleries();
    }, []);

    // NEW: Updated drag end handler for @dnd-kit
    const handleOnDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setGalleries((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSaveOrder = async () => {
        const orderedIds = galleries.map(g => g.id);

        try {
            await authApiClient.put('/admin/galleries/order', { galleryIds: orderedIds });
            alert('Volgorde succesvol opgeslagen!');
        } catch (err) {
            setError('Kon de volgorde niet opslaan.');
            console.error("Error saving order:", err);
        }
    };

    return (
        <main className="admin-gallery-manager">
            <div className="admin-gallery-header">
                <h2>Beheer Galerij Hub</h2>
                <p>Sleep de galerijen om de weergavevolgorde op de publieke hub-pagina aan te passen.</p>
                <button className="save-order-button" onClick={handleSaveOrder}>
                    Volgorde Opslaan
                </button>
            </div>

            {loading && <p>Laden...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* NEW: DndContext replaces DragDropContext */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleOnDragEnd}
            >
                <ul className="gallery-list">
                    {/* NEW: SortableContext provides context for the items */}
                    <SortableContext
                        items={galleries.map(g => g.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {galleries.map((gallery) => (
                            <SortableGalleryItem key={gallery.id} id={gallery.id} gallery={gallery} />
                        ))}
                    </SortableContext>
                </ul>
            </DndContext>
        </main>
    );
}

export default AdminGalleryManager;