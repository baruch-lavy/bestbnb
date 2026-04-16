import { useState } from 'react'
import { userService } from '../services/user'

import { ReviewPreview } from './ReviewPreview.jsx'
import { ReviewAllModal } from './ReviewAllModal.jsx'

export function ReviewList({ reviews, onRemoveReview }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    function shouldShowActionBtns(review) {
        const user = userService.getLoggedinUser()
        
        if (!user) return false
        if (user.isAdmin) return true
        return review.by?._id === user._id
    }

    return <section className='reviw-list-main'>
        <ul className="review-list">
            {reviews.slice(0 , 6).map(review =>
                <li key={review.by.id}>
                    <ReviewPreview review={review}/>
                    {shouldShowActionBtns(review) && <div className="actions">
                        <button onClick={() => onRemoveReview(review._id)}>x</button>
                    </div>}
                </li>)
            }
        </ul>
        <button className="reviw-all-btn" onClick={() => setIsModalOpen(true)}>
            Show all {reviews.length} reviews
        </button>
        <ReviewAllModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            reviews={reviews}
        />
    </section>
}