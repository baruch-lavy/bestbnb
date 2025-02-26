import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { userService } from '../services/user.service'
import { orderService } from '../services/order'
import { Loading } from './Loading'
import { setSearchData } from "../store/actions/stay.actions"; // Redux action
import { loadStay, addStayMsg } from '../store/actions/stay.actions'

export function BookOrder() {
    const dispatch = useDispatch()
    const { stayId } = useParams()
    const stay = useSelector(storeState => storeState.stayModule.stay)
    const search = useSelector((state) => state.search || {}); // Ensure state exists
    const searchData = useSelector((state) => state.search)
    const [isBooked, setIsBooked] = useState(false)
    const user = useSelector((state) => state.userModule.user)
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0)
        loadStay(stayId)
      }, [stayId ,isBooked])

    const cleanFee = 0.095
    const airbnbFee = 0.13


    const start = searchData.startDate ? new Date(searchData.startDate) : new Date().setDate(new Date().getDate() + 2);
    const end = searchData.endDate ? new Date(searchData.endDate) : new Date().setDate(new Date().getDate() + 9);
    const timeDifference = end - start;
    const stayLength = (timeDifference) ? timeDifference / (1000 * 3600 * 24) : ''

    if (!searchData.startDate && !searchData.endDate) {
        dispatch(
            setSearchData({
                ...search,
                startDate: new Date(new Date().setDate(new Date().getDate() + 2)).toString(),
                endDate: new Date(new Date().setDate(new Date().getDate() + 9)).toString(), // ✅ Explicitly set `null` to trigger Redux update
            })
        );
    }
    console.log('searchData:', searchData)

    const cancellationDate = new Date(start)
    cancellationDate.setDate(cancellationDate.getDate() - 1)
    const formattedCancellationDate = formatDate(cancellationDate)

    function formatDate(date) {
        const options = { month: 'short', day: 'numeric' }; // Format to "Month Day"
        return new Date(date).toLocaleDateString('en-US', options); // Return "Month Day" (e.g., "May 20")
    }

    function formatDateRange(startDate, endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            return `${formatDate(startDate)} – ${end.getDate()}`
        }
        return `${formatDate(startDate)} – ${formatDate(endDate)}`
    }

    function handleMouseMove(e) {
        const button = e.currentTarget
        const { x, y } = button.getBoundingClientRect()
        button.style.setProperty("--x", e.clientX - x)
        button.style.setProperty("--y", e.clientY - y)
    }

    const handleSubmitOrder = async () => {
        if (!stay || !searchData.startDate || !searchData.endDate) {
            console.error('Please select dates and guests')
            return
        }
        if (isBooked) {
            navigate('/trips')
            setIsBooked(false)
            return
        }
        try {
            setIsBooked(true)
            const newOrder = {
                hostId: stay.host,
                guest: {
                    _id: user._id,
                    fullname: user.fullname,
                },
                totalPrice: parseInt(stay.price * stayLength * (1 + airbnbFee + cleanFee)),
                startDate: formatDate(searchData.startDate),
                endDate: formatDate(searchData.endDate),
                guests: {
                    adults: searchData.guests?.adults || 1,
                    children: searchData.guests?.children || 0,
                },
                stay: {
                    _id: stay._id,
                    name: stay.name,
                    price: stay.price,
                    imgUrl: stay.imgUrls[0],
                    city: stay.loc.city,
                    country: stay.loc.country,
                },
                status: 'pending',
                msgs: []
            }

            const savedOrder = await orderService.save(newOrder)
            console.log('Order saved:', savedOrder)

        } catch (error) {
            console.error('Failed to submit order:', error)
            setIsBooked(false) // Reset on error
            // Optionally show error message to user
        }
    }


    if (!stay) return < Loading />
    return (
        <section className="book-order-container">

            {isBooked ? (
                <div className="success-header">
                    <div className="back-icon">
                        <Link to={`/stay/${stay._id}${window.location.search}`} >
                            <img src="/img/stays/left.svg" alt="" />
                        </Link>
                    </div>
                    <div className="success-header-content">
                        <div className="success-icon">
                            <svg viewBox="0 0 48 48">
                                <path d="M24 4C12.95 4 4 12.95 4 24c0 11.04 8.95 20 20 20 11.04 0 20-8.96 20-20 0-11.05-8.96-20-20-20zm-4 30L10 24l2.83-2.83L20 28.34l15.17-15.17L38 16 20 34z"
                                    fill="#00A699" />
                            </svg>
                        </div>
                        <h1>Your order has been confirmed!</h1>
                    </div>
                </div>
            ) : (
                <div className="success-header">
                    <div className="back-icon">
                        <Link to={`/stay/${stay._id}${window.location.search}`} >
                            <img src="/img/stays/left.svg" alt="" />
                        </Link>
                    </div>
                    <div className="success-header-content">
                        <h1>Confirm and pay</h1>
                    </div>
                </div>
            )}

            <div className="book-order-content">
                <div className="booking-highlights flex">
                    <div className="booking-highlights-text">
                        <h5>This is a rare find.</h5>
                        <h6>{stay.host.fullname}'s place is usually booked.</h6>
                    </div>
                    <img src="/img/stays/diamond.svg" alt="" />
                </div>

                <div className="trip-details">
                    <h3 className="book-order-message">Your trip</h3>
                    <div className="details-row flex">
                        <div className="detail-item flex">
                            <h3>Dates</h3>
                            <p>
                                {formatDateRange(searchData.startDate, searchData.endDate)}
                            </p>
                            {/* <p>{new Date(searchData.startDate).toLocaleDateString()}-{new Date(searchData.endDate).toLocaleDateString()}</p> */}
                        </div>
                        <div className="detail-item flex">
                            <h3>Guests</h3>
                            <p>{
                                `${(searchData.guests?.adults || 0) + (searchData.guests?.children || 0) || 1} guest${(searchData.guests?.adults || 0) + (searchData.guests?.children || 0) !== 1 ? 's' : ''}`
                                + (searchData.guests?.infants > 0 ? `, ${searchData.guests.infants} infant${searchData.guests.infants !== 1 ? 's' : ''}` : '')
                                + (searchData.guests?.pets > 0 ? `, ${searchData.guests.pets} pet${searchData.guests.pets !== 1 ? 's' : ''}` : '')
                            }</p>
                        </div>
                    </div>
                </div>

                {isBooked ? (
                    <div className="cancellation-policy">
                        <h3>Thank you for your request</h3>
                        <p>Your host will be in touch within 24 hours to confirm your reservation.</p>
                    </div>
                ) : (
                    <div>
                        <div className="cancellation-policy">
                            <h3 >Cancellation policy</h3>
                            <p>Cancel before {formattedCancellationDate} for a partial refund. After that, this reservation is non-refundable. <span>Learn more</span></p>
                        </div>

                        <div className="reservation-status">
                            <p>Your reservation won't be confirmed until the Host accepts your request (within 24 hours). You won't be charged until then.</p>
                        </div>
                        <div className="agreement-terms">
                            <p>By selecting the button below, I agree to the <span>Host's House Rules, Ground rules for guests, Bestbnb's Rebooking and Refund Policy,</span> and that Bestbnb can <span>charge my payment method</span> if I'm responsible for damage.</p>
                        </div>
                    </div>
                )}






                <button className="reserve-btn"
                    onClick={() => handleSubmitOrder()}
                    onMouseMove={handleMouseMove}>
                    {isBooked ? `Review your order` : 'Confirm and pay'}
                </button>
            </div>

            <section className='mini-stay-details'>
                <div className='mini-stay-details-card'>
                    <div className="mini-stay-details-content flex">
                        <div className="mini-stay-details-img">
                            <img src={stay.imgUrls[0]} alt="" />
                        </div>
                        <div className="mini-stay-details-header">
                            <h4>{stay.name}</h4>
                            <h5>Entire home</h5>
                            <h5 className="rate"><span>★ {parseFloat((Math.random() * (5 - 4) + 4).toFixed(2))}</span> ({stay.reviews.length} {(stay.reviews.length > 1) ? 'reviews' : 'review'})</h5>

                        </div>
                    </div>

                    <div className="mini-stay-price-details">
                        <div className="mini-stay-price-details-header flex">
                            <h3>Price details</h3>
                            <div className="footer-price-nigts flex">
                                <span>${stay.price} X {stayLength} nights</span><span>${(stay.price * stayLength).toLocaleString()}</span>
                            </div>
                            <div className="footer-price-clean-fee flex">
                                <span>Cleaning fee</span><span>${parseInt(stay.price * stayLength * cleanFee).toLocaleString()}</span>
                            </div>
                            <div className="footer-price-airbnb-fee flex">
                                <span>Bestbnb service fee</span><span>${parseInt(stay.price * stayLength * airbnbFee).toLocaleString()}</span>
                            </div>
                            <div className="footer-price-total flex">
                                <span>Total (USD)</span><span>${parseInt(stay.price * stayLength * (1 + airbnbFee + cleanFee)).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    )
}
