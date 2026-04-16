export function AmenitiesModal({ isOpen, onClose, amenities }) {
    if (!isOpen) return null

    return (
        <div className="filter-modal-overlay" onClick={onClose}>
            <div className="amenities-modal-content" onClick={e => e.stopPropagation()}>
                <div className="amenities-modal-scroll">
                    <header className="amenities-modal-header">
                        <button className="amenities-modal-close-btn" onClick={onClose}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222' }}>
                            <svg viewBox="0 0 32 32" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: 3 }}>
                                <path d="m6 6 20 20M26 6 6 26"></path>
                            </svg>
                        </button>
                        <h2 className="amenities-modal-title">What this place offers</h2>
                    </header>
                    <ul className="amenities-modal-list">
                        {amenities.map((amenity, idx) => (
                            <li key={idx}>
                                <div className="amenity">
                                    <span className="amenity-icon">
                                        <img src={amenity.icon} alt={amenity.label} />
                                    </span>
                                    <span className="amenity-label">{amenity.label}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
