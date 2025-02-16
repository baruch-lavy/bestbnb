import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WishlistModal } from './WishlistModal'
import { SuccessMessage } from './SuccessMessage'

export function StayPreview({ stay }) {
  
    console.log(stay)
    const [currentImgIdx, setCurrentImgIdx] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const handleModalClose = () => {
        setIsModalOpen(false)
    }

    const showSuccessMessage = (message) => {
        if (showSuccess) {
            const successMessage = document.querySelector('.success-message')
            if (successMessage) {
                successMessage.classList.add('exit')
                setTimeout(() => {
                    setShowSuccess(false)
                    setTimeout(() => {
                        setSuccessMessage(message)
                        setShowSuccess(true)
                    }, 100)
                }, 300)
            }
        } else {
            setSuccessMessage(message)
            setShowSuccess(true)
        }

        setTimeout(() => {
            const successMessage = document.querySelector('.success-message')
            if (successMessage) {
                successMessage.classList.add('exit')
                setTimeout(() => {
                    setShowSuccess(false)
                }, 300)
            }
        }, 4700)
    }

    const handleWishlistSave = () => {
        setIsLiked(true)
        setIsModalOpen(false)
        showSuccessMessage('Saved to Countryside 2025')
    }

    const handleLikeClick = () => {
        if (isLiked) {
            setIsLiked(false)
            showSuccessMessage('Removed from Countryside 2025')
        } else {
            setIsModalOpen(true)
        }
    }

    if (!stay) return <Loader />
    
    return (
        <>
            <article className="stay-preview">
                <div className="img-container">
                    <Link to={`/stay/${stay._id}`} target="_blank">
                        <img src={stay.imgUrls[0]} alt={stay.name} />
                    </Link>
                    
                    <div className="img-btns">
                        {stay.isFavorite && (
                            <Link to={`/stay/${stay._id}`} target="_blank">
                                <div className="guest-favorite">Guest favorite</div>
                            </Link>
                        )}
                        <button 
                            className="btn-like"
                            onClick={handleLikeClick}>
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
                    <div className="header-stay">
                        <h3>{stay.loc.city}, {stay.loc.country}</h3>
                        <div className="rating">★ {stay.reviews[0]?.rate || 'New'}</div>
                    </div>
                    <p className="distance">{stay.distance}</p>
                    <p className="dates">{stay.dates}</p>
                    <p className="price">${stay.price} <span>night</span></p>
                </div>
            </article>

            <WishlistModal 
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSave={handleWishlistSave}
                imgUrl={stay.imgUrls[0]}
            />

            {showSuccess && (
                <SuccessMessage 
                    message={successMessage}
                    onClose={() => setIsModalOpen(true)}
                    imgUrl={stay.imgUrls[0]}
                />
            )}
        </>
    )
}