import { userService } from '../services/user'

import { ReviewPreview } from './ReviewPreview.jsx'

export function ReviewList({ reviews, onRemoveReview }) {
    
    // function shouldShowActionBtns(review) {
    //     const user = userService.getLoggedinUser()
        
    //     if (!user) return false
    //     if (user.isAdmin) return true
    //     return review.byUser?._id === user._id
    // }

    return <section className='reviw-list-main'>
        <ul className="review-list">
            {reviews.slice(0 , 6).map(review =>
                <li key={review.at}>
                    <ReviewPreview review={review}/>
                    {/* {shouldShowActionBtns(review) && <div className="actions">
                        <button onClick={() => onRemoveReview(review._id)}>x</button>
                    </div>} */}
                </li>)
            }
        </ul>
        <button className="reviw-all-btn">Show all {reviews.length} reviews</button>
    </section>
}