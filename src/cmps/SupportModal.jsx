import { useState, useEffect, useRef } from 'react'

export function SupportModal({ isOpen, onClose }) {
    const modalRef = useRef()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className={`support-modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="support-modal" ref={modalRef}>
                <button className="close-btn" onClick={onClose}>×</button>
                
                <div className="modal-content">
                    <div className="modal-section">
                        <h3>Support</h3>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Get help with a safety issue</a></li>
                            <li><a href="#">AirCover</a></li>
                            <li><a href="#">Anti-discrimination</a></li>
                            <li><a href="#">Disability support</a></li>
                            <li><a href="#">Cancellation options</a></li>
                            <li><a href="#">Report neighborhood concern</a></li>
                        </ul>
                    </div>

                    <div className="modal-section">
                        <h3>Hosting</h3>
                        <ul>
                            <li><a href="#">Bestbnb your home</a></li>
                            <li><a href="#">AirCover for Hosts</a></li>
                            <li><a href="#">Hosting resources</a></li>
                            <li><a href="#">Community forum</a></li>
                            <li><a href="#">Hosting responsibly</a></li>
                            <li><a href="#">Bestbnb-friendly apartments</a></li>
                            <li><a href="#">Join a free Hosting class</a></li>
                            <li><a href="#">Find a co-host</a></li>
                        </ul>
                    </div>

                    <div className="modal-section">
                        <h3>Bestbnb</h3>
                        <ul>
                            <li><a href="#">Newsroom</a></li>
                            <li><a href="#">New features</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Investors</a></li>
                            <li><a href="#">Gift cards</a></li>
                            <li><a href="#">Bestbnb.org emergency stays</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
} 