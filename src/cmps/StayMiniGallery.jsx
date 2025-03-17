
export function StayMiniGallery({ stay, handleImageLoad, isImgLoading }) {

    return (<>
        <article className="mini-gallery">
            <div className="main-image"
                onLoad={handleImageLoad}
                style={{ display: isImgLoading ? 'none' : 'block' }}>
                <img src={stay.imgUrls[0]} alt="Main house image" />
            </div>
            <div className="other-images">
                {stay.imgUrls.slice(1, 5).map((imgUrl, index) => (
                    <img key={index} src={imgUrl} alt={`house image ${index + 1}`} />
                ))}
            </div>
        </article>
        <button className="gallery-btn">
            <img src="/img/stays/show-gallery.svg" alt="show-gallery" />
            Show all photos
        </button>
    </>)
}