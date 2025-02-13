import { useState } from 'react'
import { Link } from 'react-router-dom'

export function StayPreview({ stay }) {
    const [currentImgIdx, setCurrentImgIdx] = useState(0)
    const [isLiked, setIsLiked] = useState(false)

    if (!stay) return <p>Loading...</p>
    
    return (
        <article className="stay-preview">
            <div className="img-container">
                <img src={stay.imgUrls[+currentImgIdx]} alt={stay.name} />

                <div className="img-btns">
                    <div className="guest-favorite">Guest favorite</div>
                    <button 
                        className={`btn-like ${isLiked ? 'active' : ''}`}
                        onClick={() => setIsLiked(prev => !prev)}>
                        ❤
                    </button>
                </div>
            </div>

            <div className="info">
                <div className="header">
                    <h3>{stay.loc.city}, {stay.loc.country}</h3>
                    <div className="rating">★ {stay.reviews[0]?.rate || 'New'}</div>
                </div>
                <p className="distance">{stay.distance}</p>
                <p className="dates">{stay.dates}</p>
                <p className="price">${stay.price} <span>night</span></p>
            </div>
        </article>
    )
}