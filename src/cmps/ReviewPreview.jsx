import { Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import { SummaryModal } from '../cmps/SummaryModal.jsx'



export function ReviewPreview({ review }) {
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false)
    const { by, aboutUser } = review
    const randomDateRef = useRef()
    const yearsOnBestbnbRef = useRef()


    if (!randomDateRef.current) {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const randomMonth = months[Math.floor(Math.random() * months.length)]
        const randomYear = Math.floor(Math.random() * (2024 - 2022 + 1)) + 2022
        randomDateRef.current = `${randomMonth} ${randomYear}`
    }

    if (!yearsOnBestbnbRef.current) {
        yearsOnBestbnbRef.current = parseInt(Math.random() * 12) + 2
    }

    const length = 160
    const isLongText = review.txt.length > length

    return <article className="review-preview">
        <Link to={`/reviewer/${by._id}`} className="review-by flex">
            <img src={by.imgUrl} alt="" />
            <div className="reviewer-details">
                <h5>{by.fullname}</h5>
                <h6>{yearsOnBestbnbRef.current} years on Bestbnb</h6>
            </div>
        </Link>
        <div className="review-contant flex">
            <div className="review-rate">
                ★★★★★ · <span>{randomDateRef.current}</span> · Stayed a few nights
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