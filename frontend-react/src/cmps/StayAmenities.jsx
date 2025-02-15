import { Link } from 'react-router-dom'

export function StayAmenities({ amenities }) {
    console.log(amenities)
    return <article className="amenities">
        <h3>What this place offers</h3>
        <ul className="amenities-lines">
            {amenities.map(amenity =>
                <li key={amenity}>
                    <div className="amenity">
                        {amenity}
                    </div>
                </li>)
            }
        </ul>
        <button>Show all {amenities.length}  {(amenities.length > 1) ? 'amenities' : 'amenity'}</button>
    </article>
}