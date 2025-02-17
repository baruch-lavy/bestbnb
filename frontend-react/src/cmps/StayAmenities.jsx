import { gAmenities } from '../services/amenities.service'

export function StayAmenities({ amenities }) {
    // Optionally log the amenities array

    return (
        <article className="amenities">
            <h3>What this place offers</h3>
            <ul className="amenities-lines">
                {amenities.slice(0, 5).map((amenity, index) => {
                    const icon = gAmenities.find(item => amenity === item.label);
                    if (!icon) return null; // If no matching icon found, don't render this item
                    
                    return (
                        <li key={index}>
                            <div className="amenity">
                                <span className="amenity-icon">
                                    <img src={icon.icon} alt={amenity} />
                                </span>
                                <span className="amenity-label">{amenity}</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <button>Show all {amenities.length} {amenities.length > 1 ? 'amenities' : 'amenity'}</button>
        </article>
    );
}


// {
//     amenities.map(amenity => (
//         <button key={amenity.id} className="amenity-btn">
//             <span className="amenity-icon">
//                 <img src={`/img/stays/amenities/${amenity.icon}`} alt={amenity.label} />
//             </span>
//             <span className="amenity-label">{amenity.label}</span>
//         </button>
//     ))
// }