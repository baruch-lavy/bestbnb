import { Link } from 'react-router-dom'

export function StayGallery({ stay }) {
    console.log(stay)
    return <article className="gallery">
        <header>
            <Link to={`/stay/${stay._id}`}>{'<'}</Link>
        </header>
        <ul className="gallery-imgs">
            {stay.imgUrls.map(imgUrl =>
                <li key={imgUrl}>
                    <div className="actions">
                        <img src={imgUrl} alt="house image" />
                    </div>
                </li>)
            }
        </ul>
    </article>
}