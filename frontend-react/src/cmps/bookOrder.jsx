import { useSelector } from 'react-redux'

export function BookOrder() {
    const searchData = useSelector((state) => state.search)
    console.log('searchData', searchData)

    return (
        <section className="book-order-container">
            <div className="book-order-content">
                <div className="success-icon">
                    <svg viewBox="0 0 48 48">
                        <path d="M24 4C12.95 4 4 12.95 4 24c0 11.04 8.95 20 20 20 11.04 0 20-8.96 20-20 0-11.05-8.96-20-20-20zm-4 30L10 24l2.83-2.83L20 28.34l15.17-15.17L38 16 20 34z" 
                              fill="#00A699"/>
                    </svg>
                </div>
                <h1>Your reservation is confirmed</h1>
                <p className="book-order-message">You're going to Tel Aviv</p>
                
                <div className="trip-details">
                    <div className="details-row">
                        <div className="detail-item">
                            <h3>Dates</h3>
                            <p>Jul 15-20</p>
                        </div>
                        <div className="detail-item">
                            <h3>Guests</h3>
                            <p>2 guests</p>
                        </div>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="primary-btn">View your trips</button>
                    <button className="secondary-btn">Message host</button>
                </div>
            </div>
        </section>
    )
}
  