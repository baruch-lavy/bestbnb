import { Link } from 'react-router-dom'
import { useState } from 'react'
import { SummaryModal } from '../cmps/SummaryModal.jsx'



export function ReviewPreview({ review }) {
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false)
    const { by, aboutUser } = review

    function getRandomDate() {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const randomMonth = months[Math.floor(Math.random() * months.length)];
        const randomYear = Math.floor(Math.random() * (2024 - 2022 + 1)) + 2022;
        return `${randomMonth} ${randomYear}`;
    }

    const length = 160
    const isLongText = review.txt.length > length

    return <article className="review-preview">
        <div className="review-by flex">
            <Link to={`/user/${by._id}`}>
                <img src={by.imgUrl} alt=""
                /></Link>
            <div className="reviewer-details">
                <h5>{by.fullname}</h5>
                <h6>{(parseInt(Math.random() * 12) + 2)} years on Bestbnb</h6>
            </div>
        </div>
        <div className="review-contant flex">
            <div className="review-rate">
                ★★★★★ · <span>{getRandomDate()}</span> · Stayed a few nights
            </div>
            <p className="review-txt">{review.txt}</p>
            {isLongText &&
                <button className="show-more-review-txt"
                    onClick={() => setIsSummaryModalOpen(true)}>
                    Show more
                </button>}
                <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summary={review.txt}
    />
        </div>
    </article>
}
//     