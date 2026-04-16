import { useState, useMemo } from 'react'
import { gAmenities } from '../services/amenities.service'
import { AmenitiesModal } from './AmenitiesModal.jsx'

export function StayAmenities({ amenities }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5)
    }

    const selectedAmenities = useMemo(() => {
        const shuffled = [...gAmenities].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, amenities.length)
    }, [amenities.length])

    return (
        <article className="amenities">
            <h3>What this place offers</h3>
            <ul className="amenities-lines">
                {selectedAmenities.slice(0, 10).map((amenity , idx) => 
                        <li key={idx}>
                            <div className="amenity">
                                <span className="amenity-icon">
                                    <img src={amenity.icon} alt={amenity.label} />
                                </span>
                                <span className="amenity-label">{amenity.label}</span>
                            </div>
                        </li>
                    )
                }
            </ul>
            <button onClick={() => setIsModalOpen(true)}>
                Show all {amenities.length} {amenities.length > 1 ? 'amenities' : 'amenity'}
            </button>
            <AmenitiesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                amenities={selectedAmenities}
            />
        </article>
    )
}
