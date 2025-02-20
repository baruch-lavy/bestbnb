import { useState } from 'react'

const amenities = [
    { id: 'wifi', label: 'Wifi', icon: 'asset1.svg' },
    { id: 'kitchen', label: 'Kitchen', icon: 'asset2.svg' },
    { id: 'washer', label: 'Washer', icon: 'asset3.svg' },
    { id: 'dryer', label: 'Dryer', icon: 'asset4.svg' },
    { id: 'air', label: 'Air conditioning', icon: 'asset5.svg' },
    { id: 'heating', label: 'Heating', icon: 'asset6.svg' },
]

const moreAmenities = [
    { id: 'pool', label: 'Pool', icon: 'asset7.svg' },
    { id: 'hot-tub', label: 'Hot tub', icon: 'asset8.svg' },
    { id: 'parking', label: 'Free parking', icon: 'asset9.svg' },
    { id: 'gym', label: 'Gym', icon: 'asset10.svg' },
    { id: 'breakfast', label: 'Breakfast', icon: 'asset11.svg' },
    { id: 'pets', label: 'Pets allowed', icon: 'asset12.svg' },
]

export function FilterModal({ isOpen, onClose }) {
    const [bedrooms, setBedrooms] = useState(0)
    const [beds, setBeds] = useState(0)
    const [bathrooms, setBathrooms] = useState(0)
    const [isAmenitiesExpanded, setIsAmenitiesExpanded] = useState(false)

    const handleIncrement = (setter, value) => {
        setter(value + 1)
    }

    const handleDecrement = (setter, value) => {
        if (value > 0) setter(value - 1)
    }

    const CounterGroup = ({ label, value, setValue }) => (
        <div className="input-group">
            <div className="group-header">
                <label>{label}</label>
            </div>
            <div className="counter-controls">
                <button 
                    className={`counter-btn minus ${value === 0 ? "disabled" : ""}`}
                    onClick={() => handleDecrement(setValue, value)}
                    disabled={value === 0}
                >
                    <svg viewBox="0 0 32 32">
                        <path d="M4 16h24"></path>
                    </svg>
                </button>
                <div className="value-display">
                    {value === 0 ? 'Any' : (
                        <>
                            <span className="number">{value}</span>
                            <span className="plus-sign">+</span>
                        </>
                    )}
                </div>
                <button 
                    className="counter-btn plus"
                    onClick={() => handleIncrement(setValue, value)}
                >
                    <svg viewBox="0 0 32 32">
                        <path d="M16 4v24M4 16h24"></path>
                    </svg>
                </button>
            </div>
        </div>
    )

    if (!isOpen) return null

    return (
        <div className="filter-modal-overlay" onClick={onClose}>
            <div className="filter-modal-content" onClick={e => e.stopPropagation()}>
                <header className="filter-modal-header">
                    <button className="close-btn" onClick={onClose}>
                        <svg viewBox="0 0 32 32" style={{display: "block", fill: "none", height: "16px", width: "16px", stroke: "currentcolor", strokeWidth: 3}}>
                            <path d="m6 6 20 20M26 6 6 26"></path>
                        </svg>
                    </button>
                    <h2>Filters</h2>
                </header>

                <div className="filter-modal-body">
                    <section className="type-of-place">
                        <h3>Type of place</h3>
                        <div className="type-buttons">
                            <button className="type-btn active">
                                <span>Any type</span>
                            </button>
                            <button className="type-btn room">
                                <span>Room</span>
                            </button>
                            <button className="type-btn">
                                <span>Entire home</span>
                            </button>
                        </div>
                    </section>

                    <section className="price-range">
                        <h3>Price range</h3>
                        <p className="subtitle">Nightly prices including fees and taxes</p>
                        <div className="price-graph">
                            <div className="graph-bars">
                                {Array(40).fill().map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="bar" 
                                        style={{ 
                                            height: `${Math.random() * 50 + 10}px`,
                                            opacity: i >= 10 && i <= 30 ? 1 : 0.3
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="price-inputs">
                            <div className="price-input">
                                <label>Minimum</label>
                                <div className="input-wrapper">
                                    <span className="currency">$10</span>
                                    <input type="text" />
                                </div>
                            </div>
                            <span className="price-separator">-</span>
                            <div className="price-input">
                                <label>Maximum</label>
                                <div className="input-wrapper">
                                    <span className="currency">$860</span>
                                    <input type="text" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rooms-and-beds">
                        <h3>Rooms and beds</h3>
                        <div className="rooms-inputs">
                            <CounterGroup 
                                label="Bedrooms"
                                value={bedrooms}
                                setValue={setBedrooms}
                            />
                            <CounterGroup 
                                label="Beds"
                                value={beds}
                                setValue={setBeds}
                            />
                            <CounterGroup 
                                label="Bathrooms"
                                value={bathrooms}
                                setValue={setBathrooms}
                            />
                        </div>
                    </section>

                    <section className="amenities">
                        <h3>Amenities</h3>
                        <div className="amenities-grid">
                            {amenities.map(amenity => (
                                <button key={amenity.id} className="amenity-btn">
                                    <span className="amenity-icon">
                                        <img src={`/img/stays/amenities/${amenity.icon}`} alt={amenity.label} />
                                    </span>
                                    <span className="amenity-label">{amenity.label}</span>
                                </button>
                            ))}
                        </div>

                        {isAmenitiesExpanded && (
                            <div className="amenities-grid">
                                {moreAmenities.map(amenity => (
                                    <button key={amenity.id} className="amenity-btn">
                                        <span className="amenity-icon">
                                            <img src={`/img/stays/amenities/${amenity.icon}`} alt={amenity.label} />
                                        </span>
                                        <span className="amenity-label">{amenity.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <button 
                            className={`show-more-btn ${isAmenitiesExpanded ? "expanded" : ""}`}
                            onClick={() => setIsAmenitiesExpanded(!isAmenitiesExpanded)}
                        >
                            {isAmenitiesExpanded ? 'Show less' : 'Show more'}
                            <svg viewBox="0 0 18 18">
                                <path d="M16.29 4.3a1 1 0 1 1 1.41 1.42l-8 8a1 1 0 0 1-1.41 0l-8-8a1 1 0 1 1 1.41-1.42L9 11.6l7.29-7.3z"/>
                            </svg>
                        </button>
                    </section>
                </div>

                <footer className="filter-modal-footer">
                    <button className="clear-btn">Clear all</button>
                    <button className="show-places-btn">Show 1,000+ places</button>
                </footer>
            </div>
        </div>
    )
} 