import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { stayService } from '../services/stay/index.js'
import { Loading } from '../cmps/Loading.jsx'

export function ReviewerProfile() {
    const { personId } = useParams()
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        window.scrollTo(0, 0)
        loadProfile()
    }, [personId])

    async function loadProfile() {
        try {
            setIsLoading(true)
            const data = await stayService.getReviewerProfile(personId)
            setProfile(data)
        } catch (err) {
            console.error('Failed to load reviewer profile:', err)
            setError('Could not load profile')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return <Loading />
    if (error || !profile?.person) return <div className="reviewer-profile-error">Profile not found</div>

    const { person, hostedStays, reviews } = profile

    return (
        <section className="reviewer-profile">
            <div className="reviewer-profile-layout">

                {/* LEFT COLUMN — Person card */}
                <aside className="reviewer-card">
                    <div className="reviewer-avatar-wrap">
                        <img src={person.imgUrl || person.thumbnailUrl} alt={person.fullname} className="reviewer-avatar" />
                        {person.isSuperhost && (
                            <span className="superhost-badge">
                                <img src="/img/stays/icons/superhost.svg" alt="" />
                                Superhost
                            </span>
                        )}
                    </div>
                    <h2 className="reviewer-name">{person.fullname}</h2>
                    {person.about && <p className="reviewer-about">{person.about}</p>}
                    <div className="reviewer-stats">
                        {hostedStays.length > 0 && (
                            <div className="stat">
                                <strong>{hostedStays.length}</strong>
                                <span>Properties</span>
                            </div>
                        )}
                        <div className="stat">
                            <strong>{reviews.length}</strong>
                            <span>Reviews</span>
                        </div>
                    </div>
                    {person.responseTime && (
                        <p className="reviewer-response">Response time: <strong>{person.responseTime}</strong></p>
                    )}
                </aside>

                {/* RIGHT COLUMN — Content */}
                <div className="reviewer-content">

                    {/* HOSTED STAYS — shown first */}
                    {hostedStays.length > 0 && (
                        <div className="reviewer-section">
                            <h3 className="section-title">
                                {person.fullname.split(' ')[0]}'s places
                                <span className="section-count">{hostedStays.length}</span>
                            </h3>
                            <ul className="hosted-stays-list">
                                {hostedStays.map(stay => (
                                    <li key={stay._id}>
                                        <Link to={`/stay/${stay._id}`} className="hosted-stay-card">
                                            <img
                                                src={stay.imgUrls?.[0]}
                                                alt={stay.name}
                                                className="hosted-stay-img"
                                            />
                                            <div className="hosted-stay-info">
                                                <span className="hosted-stay-type">{stay.type}</span>
                                                <h4 className="hosted-stay-name">{stay.name}</h4>
                                                <span className="hosted-stay-loc">
                                                    {stay.loc?.city}, {stay.loc?.country}
                                                </span>
                                                <span className="hosted-stay-price">${stay.price} / night</span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* REVIEWS WRITTEN */}
                    {reviews.length > 0 && (
                        <div className="reviewer-section">
                            <h3 className="section-title">
                                Reviews by {person.fullname.split(' ')[0]}
                                <span className="section-count">{reviews.length}</span>
                            </h3>
                            <ul className="reviewer-reviews-list">
                                {reviews.map((review, idx) => (
                                    <li key={review.id || idx}>
                                        <Link to={`/stay/${review.stayId}`} className="reviewer-review-card">
                                            <img
                                                src={review.stayImgUrl}
                                                alt={review.stayName}
                                                className="reviewer-review-stay-img"
                                            />
                                            <div className="reviewer-review-info">
                                                <h4 className="reviewer-review-stay-name">{review.stayName}</h4>
                                                <p className="reviewer-review-txt">{review.txt}</p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {hostedStays.length === 0 && reviews.length === 0 && (
                        <p className="reviewer-empty">No activity found for this user.</p>
                    )}
                </div>
            </div>
        </section>
    )
}
