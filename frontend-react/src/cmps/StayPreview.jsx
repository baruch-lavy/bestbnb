import { Link } from 'react-router-dom'

export function StayPreview({ stay }) {
    return <article className="preview">
        <header>
            <Link to={`/stay/${stay._id}`}>{stay.vendor}</Link>
        </header>

        <p>Speed: <span>{stay.speed.toLocaleString()} Km/h</span></p>
        {stay.owner && <p>Owner: <span>{stay.owner.fullname}</span></p>}
        
    </article>
}