import { useState, useEffect } from 'react'

const AMENITIES = [
    { id: 'wifi', label: 'Wifi', icon: 'asset1.svg' },
    { id: 'kitchen', label: 'Kitchen', icon: 'asset2.svg' },
    { id: 'washer', label: 'Washer', icon: 'asset3.svg' },
    { id: 'dryer', label: 'Dryer', icon: 'asset4.svg' },
    { id: 'air', label: 'Air conditioning', icon: 'asset5.svg' },
    { id: 'heating', label: 'Heating', icon: 'asset6.svg' },
]

const MORE_AMENITIES = [
    { id: 'pool', label: 'Pool', icon: 'asset7.svg' },
    { id: 'hot-tub', label: 'Hot tub', icon: 'asset8.svg' },
    { id: 'parking', label: 'Free parking', icon: 'asset9.svg' },
    { id: 'gym', label: 'Gym', icon: 'asset10.svg' },
    { id: 'breakfast', label: 'Breakfast', icon: 'asset11.svg' },
    { id: 'pets', label: 'Pets allowed', icon: 'asset12.svg' },
]

const PROPERTY_TYPES = ['Any type', 'Room', 'Entire home']

const DEFAULT_LOCAL = {
    minPrice: '',
    maxPrice: '',
    propertyType: 'Any type',
    selectedAmenities: [],
    minBedrooms: 0,
    minBeds: 0,
    minBathrooms: 0,
}

export function FilterModal({ isOpen, onClose, filterBy, onApply }) {
    const [local, setLocal] = useState(DEFAULT_LOCAL)
    const [isAmenitiesExpanded, setIsAmenitiesExpanded] = useState(false)

    // Sync local state from filterBy each time the modal opens
    useEffect(() => {
        if (!isOpen) return
        setLocal({
            minPrice: filterBy?.minPrice || '',
            maxPrice: filterBy?.maxPrice && filterBy.maxPrice !== Infinity ? filterBy.maxPrice : '',
            propertyType: filterBy?.propertyType || 'Any type',
            selectedAmenities: [...(filterBy?.amenities || [])],
            minBedrooms: filterBy?.minBedrooms || 0,
            minBeds: filterBy?.minBeds || 0,
            minBathrooms: filterBy?.minBathrooms || 0,
        })
    }, [isOpen, filterBy])

    function handleCounterChange(field, delta) {
        setLocal(prev => ({ ...prev, [field]: Math.max(0, (prev[field] || 0) + delta) }))
    }

    function toggleAmenity(label) {
        setLocal(prev => {
            const has = prev.selectedAmenities.includes(label)
            return {
                ...prev,
                selectedAmenities: has
                    ? prev.selectedAmenities.filter(a => a !== label)
                    : [...prev.selectedAmenities, label],
            }
        })
    }

    function handleClearAll() {
        setLocal(DEFAULT_LOCAL)
        onApply({
            minPrice: 0,
            maxPrice: Infinity,
            propertyType: '',
            amenities: [],
            minBedrooms: 0,
            minBeds: 0,
            minBathrooms: 0,
        })
        onClose()
    }

    function handleApply() {
        const filter = {
            minPrice: local.minPrice !== '' ? Number(local.minPrice) : 0,
            maxPrice: local.maxPrice !== '' ? Number(local.maxPrice) : Infinity,
            propertyType: local.propertyType === 'Any type' ? '' : local.propertyType,
            amenities: local.selectedAmenities,
            minBedrooms: local.minBedrooms,
            minBeds: local.minBeds,
            minBathrooms: local.minBathrooms,
        }
        onApply(filter)
        onClose()
    }

    const CounterGroup = ({ label, field }) => (
        <div className="input-group">
            <div className="group-header">
                <label>{label}</label>
            </div>
            <div className="counter-controls">
                <button
                    className={`counter-btn minus ${local[field] === 0 ? 'disabled' : ''}`}
                    onClick={() => handleCounterChange(field, -1)}
                    disabled={local[field] === 0}
                >
                    <svg viewBox="0 0 32 32"><path d="M4 16h24"></path></svg>
                </button>
                <div className="value-display">
                    {local[field] === 0 ? 'Any' : (
                        <><span className="number">{local[field]}</span><span className="plus-sign">+</span></>
                    )}
                </div>
                <button
                    className="counter-btn plus"
                    onClick={() => handleCounterChange(field, 1)}
                >
                    <svg viewBox="0 0 32 32"><path d="M16 4v24M4 16h24"></path></svg>
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
                        <svg viewBox="0 0 32 32" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: 3 }}>
                            <path d="m6 6 20 20M26 6 6 26"></path>
                        </svg>
                    </button>
                    <h2>Filters</h2>
                </header>

                <div className="filter-modal-body">
                    <section className="type-of-place">
                        <h3>Type of place</h3>
                        <div className="type-buttons">
                            {PROPERTY_TYPES.map(type => (
                                <button
                                    key={type}
                                    className={`type-btn ${local.propertyType === type ? 'active' : ''}`}
                                    onClick={() => setLocal(prev => ({ ...prev, propertyType: type }))}
                                >
                                    <span>{type}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="price-range">
                        <h3>Price range</h3>
                        <p className="subtitle">Nightly prices including fees and taxes</p>
                        <div className="price-graph">
                            <div className="graph-bars">
                                {Array(40).fill(null).map((_, i) => (
                                    <div
                                        key={i}
                                        className="bar"
                                        style={{
                                            height: `${Math.random() * 50 + 10}px`,
                                            opacity: i >= 10 && i <= 30 ? 1 : 0.3,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="price-inputs">
                            <div className="price-input">
                                <label>Minimum</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={local.minPrice}
                                        onChange={e => setLocal(prev => ({ ...prev, minPrice: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <span className="price-separator">–</span>
                            <div className="price-input">
                                <label>Maximum</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="4000"
                                        value={local.maxPrice}
                                        onChange={e => setLocal(prev => ({ ...prev, maxPrice: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rooms-and-beds">
                        <h3>Rooms and beds</h3>
                        <div className="rooms-inputs">
                            <CounterGroup label="Bedrooms" field="minBedrooms" />
                            <CounterGroup label="Beds" field="minBeds" />
                            <CounterGroup label="Bathrooms" field="minBathrooms" />
                        </div>
                    </section>

                    <section className="amenities">
                        <h3>Amenities</h3>
                        <div className="amenities-grid">
                            {AMENITIES.map(amenity => (
                                <button
                                    key={amenity.id}
                                    className={`amenity-btn ${local.selectedAmenities.includes(amenity.label) ? 'selected' : ''}`}
                                    onClick={() => toggleAmenity(amenity.label)}
                                >
                                    <span className="amenity-icon">
                                        <img src={`/img/stays/amenities/${amenity.icon}`} alt={amenity.label} />
                                    </span>
                                    <span className="amenity-label">{amenity.label}</span>
                                </button>
                            ))}
                        </div>

                        {isAmenitiesExpanded && (
                            <div className="amenities-grid">
                                {MORE_AMENITIES.map(amenity => (
                                    <button
                                        key={amenity.id}
                                        className={`amenity-btn ${local.selectedAmenities.includes(amenity.label) ? 'selected' : ''}`}
                                        onClick={() => toggleAmenity(amenity.label)}
                                    >
                                        <span className="amenity-icon">
                                            <img src={`/img/stays/amenities/${amenity.icon}`} alt={amenity.label} />
                                        </span>
                                        <span className="amenity-label">{amenity.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            className={`show-more-btn ${isAmenitiesExpanded ? 'expanded' : ''}`}
                            onClick={() => setIsAmenitiesExpanded(prev => !prev)}
                        >
                            {isAmenitiesExpanded ? 'Show less' : 'Show more'}
                            <svg viewBox="0 0 18 18">
                                <path d="M16.29 4.3a1 1 0 1 1 1.41 1.42l-8 8a1 1 0 0 1-1.41 0l-8-8a1 1 0 1 1 1.41-1.42L9 11.6l7.29-7.3z" />
                            </svg>
                        </button>
                    </section>
                </div>

                <footer className="filter-modal-footer">
                    <button className="clear-btn" onClick={handleClearAll}>Clear all</button>
                    <button className="show-places-btn" onClick={handleApply}>Show places</button>
                </footer>
            </div>
        </div>
    )
}
