import { StayPreview } from './StayPreview.jsx'

export function StayList({ stays }) {
    console.log('🚀 ~ file: StayList.jsx ~ line 5 ~ StayList ~ stays', stays)
    if (!stays?.length) {
        return (
            <div className="no-stays-message">
                <h2>No stays found</h2>
                <p>Try adjusting your search criteria</p>
            </div>
        )
    }

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