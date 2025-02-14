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
                    {stay.isFavorite && (
                        <div className="guest-favorite">Guest favorite</div>
                    )}
                    <button 
                        className={`btn-like`}
                        onClick={() => setIsLiked(prev => !prev)}>
                        <svg 
                            viewBox="0 0 32 32" 
                            xmlns="http://www.w3.org/2000/svg" 
                            aria-hidden="true" 
                            role="presentation" 
                            focusable="false"
                            className={isLiked ? 'active' : ''}>
                            <path d="M16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z" />
                        </svg>
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