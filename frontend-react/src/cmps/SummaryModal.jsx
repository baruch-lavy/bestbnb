

export function SummaryModal({ isOpen, onClose, summary }) {

    const paragraphs = summary.split('. ').map((sentence, index) => {
        return <p key={index}>{sentence.trim()}.</p>
      })

    if (!isOpen) return null
    return (
        <div className="filter-modal-overlay" onClick={onClose}>
            <div className="filter-modal-content" onClick={e => e.stopPropagation()}>
                <header className="filter-modal-header">
                    <button className="close-btn" onClick={onClose}>
                        <svg viewBox="0 0 32 32" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: 3 }}>
                            <path d="m6 6 20 20M26 6 6 26"></path>
                        </svg>
                    </button>
                </header>
                <div className="summary-modal-text">
                    <h2 className="summary-modal-header">About this space</h2>
                    <article >{paragraphs}</article>
                </div>
            </div>
        </div>
    )
}