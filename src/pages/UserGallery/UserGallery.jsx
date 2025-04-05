import './UserGallery.css'


function UserGallery({user}) {
    return (
        <>
            <main className="gallery-outer-container">
                <h2 className="gallery-title">{user.firstname}'s Gallerij</h2>
                <section className="gallery-inner-container">
                    <div className="gallery-line"></div>
                    <div className="gallery-line"></div>
                    <div className="gallery-line"></div>
                </section>

            </main>

        </>
    );
}

export default UserGallery;