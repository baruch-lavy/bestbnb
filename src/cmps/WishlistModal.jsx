import { useState, useEffect } from 'react'

export function WishlistModal({ isOpen, onClose, onSave, imgUrl }) {
    const [isExiting, setIsExiting] = useState(false)

    useEffect(() => {
        if (!isOpen) {
            setIsExiting(false)
        }
    }, [isOpen])

    const handleClose = () => {
        setIsExiting(true)
        setTimeout(() => {
            onClose()
        }, 200)
    }

    const handleSave = () => {
        setIsExiting(true)
        setTimeout(() => {
            onSave()
        }, 200)
    }

    if (!isOpen) return null

    return (
        <div className={`modal-overlay ${isExiting ? 'exit' : ''}`} onClick={handleClose}>
            <div className={`wishlist-modal ${isExiting ? 'exit' : ''}`} onClick={e => e.stopPropagation()}>
                <header>
                    <button className="close-btn" onClick={handleClose}>
                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", fill: "none", height: "16px", width: "16px", stroke: "currentcolor", strokeWidth: 3, overflow: "visible" }}>
                            <path d="m6 6 20 20"></path>
                            <path d="m26 6-20 20"></path>
                        </svg>
                    </button>
                    <h2>Save to wishlist</h2>
                </header>
                
                <div className="wishlist-content">
                    <div className="wishlist-preview">
                        <img src={imgUrl} alt="" />
                        <h3>estates 2025</h3>
                        <p>6 saved</p>
                    </div>
                    
                    <button 
                        className="create-wishlist-btn"
                        onClick={handleSave}>
                        Create new wishlist
                    </button>
                </div>
            </div>
        </div>
    )
} 