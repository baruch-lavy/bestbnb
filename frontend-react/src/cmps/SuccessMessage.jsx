import { useState, useEffect } from 'react'

export function SuccessMessage({ message, onClose, imgUrl, onExited }) {
    const [isExiting, setIsExiting] = useState(false)

    useEffect(() => {
        return () => {
            if (onExited) onExited()
        }
    }, [onExited])

    const handleExit = () => {
        setIsExiting(true)
        setTimeout(() => {
            onClose()
        }, 300) 
    }

    return (
        <div className={`success-message ${isExiting ? 'exit' : ''}`}>
            <div className="success-content">
                <img src={imgUrl} alt="" />
                <span>{message}</span>
                <button className="change-btn" onClick={handleExit}>Change</button>
            </div>
        </div>
    )
} 