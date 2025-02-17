import { Link } from 'react-router-dom'

export function ReviewPreview({ review }) {
    const { by, aboutUser } = review

    return <article className="preview review-preview">
        {/* <p>About: <Link to={`/user/${aboutUser._id}`}>{aboutUser.fullname}</Link></p> */}
        {/* <p className="review-by">By: <Link to={`/user/${byUser._id}`}>{byUser.fullname}</Link></p> */}
        <p className="review-by">
             <Link to={`/user/${by._id}`}>
             <img src={by.imgUrl} alt="" style={{ borderRadius: '50%', width: '2rem', height: '2rem', objectFit: 'cover' }}
             /></Link>
             {by.fullname}
             <br />4 years on Bestbnb
             </p>
        <p className="review-txt">{review.txt}</p>
    </article>
}