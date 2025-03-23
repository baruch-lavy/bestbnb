import { gAmenities } from '../services/amenities.service'

export function StayAmenities({ amenities }) {

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5)
    }

    const shuffledAmenities = [...gAmenities]
    shuffleArray(shuffledAmenities)

    const selectedAmenities = shuffledAmenities.slice(0, amenities.length) 

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
            <button>Show all {amenities.length} {amenities.length > 1 ? 'amenities' : 'amenity'}</button>
        </article>
    )
}
