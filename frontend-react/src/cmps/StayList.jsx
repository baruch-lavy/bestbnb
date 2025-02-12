import { StayPreview } from './StayPreview.jsx'

export function StayList({ stays }) {
    if (!stays || !stays.length) return <div>No stays found</div>
    
    return (
        <ul className="stay-list">
            {stays.map(stay => (
                <li key={stay._id}>
                    <StayPreview stay={stay} />
                </li>
            ))}
        </ul>
    )
}