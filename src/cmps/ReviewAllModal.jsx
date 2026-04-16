import { ReviewPreview } from './ReviewPreview.jsx'

export function ReviewAllModal({ isOpen, onClose, reviews }) {
    if (!isOpen) return null

    return (
        <div className="filter-modal-overlay" onClick={onClose}>
            <div className="review-all-modal-content" onClick={e => e.stopPropagation()}>
                <div className="review-all-modal-scroll">
                    <header className="filter-modal-header review-all-modal-header">
                        <button className="close-btn review-all-close-btn" onClick={onClose}>
                            <svg viewBox="0 0 32 32" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: 3 }}>
                                <path d="m6 6 20 20M26 6 6 26"></path>
                            </svg>
                        </button>
                        <h2 className="review-all-modal-title">{reviews.length} reviews</h2>
                    </header>
                    <ul className="review-all-modal-list">
                        {reviews.map((review, idx) => (
                            <li key={review._id || review.by?.id || idx}>
                                <ReviewPreview review={review} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
