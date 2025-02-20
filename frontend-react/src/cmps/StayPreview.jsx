import { useState, useMemo ,useEffect } from 'react'
import { Link, useLocation , useSearchParams } from 'react-router-dom'
import { WishlistModal } from './WishlistModal'
import { SuccessMessage } from './SuccessMessage'

function generateRandomData(stay) {
    const rating = (Math.random() * (5 - 4) + 4).toFixed(2)
    
    const distance = Math.floor(Math.random() * 14000 + 1000)
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const randomMonth = months[Math.floor(Math.random() * months.length)]
    const randomDay = Math.floor(Math.random() * 20 + 1)
    const dates = `${randomMonth} ${randomDay} - ${randomMonth} ${randomDay + 7}`

    return {
        rate: rating,
        distance: `${distance.toLocaleString()}`,
        dates
    }
}

export function StayPreview({ stay , queryParams }) {
    const location = useLocation() // ✅ Get current query params from URL
    const [searchParams] = useSearchParams(); // ✅ Use this instead of `useLocation()`
    const [currentImgIdx, setCurrentImgIdx] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')


  useEffect(() => {
    console.log("Updated location.search:", location.search);
  }, [location.search , searchParams]); // ✅ Logs query param changes

    const randomData = useMemo(() => generateRandomData(stay), [stay._id])

    const handleModalClose = () => setIsModalOpen(false)

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
                setTimeout(() => setShowSuccess(false), 300)
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

    const nextImage = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        if (currentImgIdx < stay.imgUrls.length - 1) {
            setCurrentImgIdx(prev => prev + 1)
        }
    }

    const prevImage = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        if (currentImgIdx > 0) {
            setCurrentImgIdx(prev => prev - 1)
        }
    }

    // if (!stay) return <Loader />

    return (
        <>
            <article className="stay-preview">
                <div className="img-container">
                    <div 
                        className="images-wrapper" 
                        style={{ transform: `translateX(-${currentImgIdx * 100}%)` }}
                    >
                        {stay.imgUrls.map((url, idx) => (
                            <Link 
                                key={idx} 
                                to={{ pathname:`/stay/${stay._id}`, search: location.search }} target="_blank"
                            >
                                <img src={url} alt={stay.name} />
                            </Link>
                        ))}
                    </div>

                    {currentImgIdx > 0 && (
                        <button className="nav-btn prev" onClick={prevImage}>❮</button>
                    )}
                    {currentImgIdx < stay.imgUrls.length - 1 && (
                        <button className="nav-btn next" onClick={nextImage}>❯</button>
                    )}

                    <div className="dots-container">
                        {stay.imgUrls.map((_, idx) => (
                            <span 
                                key={idx} 
                                className={`dot ${idx === currentImgIdx ? 'active' : ''}`}
                            />
                        ))}
                    </div>

                    <div className="img-btns">
                        {stay.isFavorite && (
                            <Link to={`/stay/${stay._id}${location.search}`} target="_blank">
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
                        <div className="rating">★ {randomData.rate}</div>
                    </div>
                    <p className="distance">{randomData.distance} kilometers away</p>
                    <p className="dates">{randomData.dates}</p>
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
