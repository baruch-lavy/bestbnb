import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { userService } from '../services/user.service'
import { orderService } from '../services/order/order.service.local'


export function BookOrder() {
    const { stayId } = useParams()
    const stay = useSelector(storeState => storeState.stayModule.stay)
    const searchData = useSelector((state) => state.search)
    const [isBooked, setIsBooked] = useState(false);

    const loggedInUser = userService.getLoggedinUser() || {
        _id: 'u101',
        fullname: 'Guest User'
    }

    //  useEffect(() => {
    //         loadStay()
    //     }, [id])

    //     const loadStay = async () => {
    //         try {
    //             const stay = await stayService.getById(id)
    //             setStay(stay)
    //         } catch (err) {
    //             console.error('Failed to load stay:', err)
    //         }
    //     }

    const cleanFee = 0.095
    const airbnbFee = 0.13


    const start = new Date(searchData.startDate);
    const end = new Date(searchData.endDate);
    const timeDifference = end - start;
    const stayLength = (timeDifference) ? timeDifference / (1000 * 3600 * 24) : ''
    // const calculateNights = (startDate, endDate) => {
    //     const start = new Date(startDate)
    //     const end = new Date(endDate)
    //     const diffTime = Math.abs(end - start)
    //     return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    // }

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

    const handleSubmitOrder = async () => {
        if (!stay || !searchData.startDate || !searchData.endDate) {
            console.error('Please select dates and guests')
            return
        }

        try {
            setIsBooked(true)
            const newOrder = {
                _id: '',
                hostId: stay.host,
                guest: {
                    _id: loggedInUser._id,
                    fullname: loggedInUser.fullname,
                },
                totalPrice: parseInt(stay.price * stayLength * (1 + airbnbFee + cleanFee)).toLocaleString(),
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
                },
                status: 'pending',
                msgs: []
            }
            await orderService.save(newOrder)
        } catch (error) {
            console.error('Failed to submit order:', error)
            // } finally {
            //     setIsBooked(false)
        }
    }

    //to do
    // handleclick(){
    // if isBooked {
    // navigate('/confirmation', { 
    //     state: { 
    //         stay: stay.name,
    //         dates: `${formatDate(searchData.startDate)} - ${formatDate(searchData.endDate)}`,
    //         guests: `${searchData.guests?.adults + (searchData.guests?.children || 0)} guests`,
    //     } 
    // })

    if (!stay) return <div>Loading...</div>
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
                                `${(searchData.guests?.adults || 0) + (searchData.guests?.children || 0) > 0
                                    ? (searchData.guests?.adults || 0) + (searchData.guests?.children || 0)
                                    : 1} guest${(searchData.guests?.adults || 0) + (searchData.guests?.children || 0) !== 1 ? 's' : ''}, ${searchData.guests?.infants || 0} infant${(searchData.guests?.infants || 0) !== 1 ? 's' : ''}, ${searchData.guests?.pets || 0} pet${(searchData.guests?.pets || 0) !== 1 ? 's' : ''}`
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
                            <h3>Cancellation policy</h3>
                            <p>Free cancellation before Feb 22. Cancel before Mar 17 for a partial refund. Learn more</p>
                        </div>

                        <div className="reservation-status">
                            <p>Your reservation won’t be confirmed until the Host accepts your request (within 24 hours). You won’t be charged until then.</p>
                        </div>
                        <div className="agreement-terms">
                            <p>By selecting the button below, I agree to the Host's House Rules, Ground rules for guests, Airbnb's Rebooking and Refund Policy, and that Airbnb can charge my payment method if I’m responsible for damage. I agree to pay the total amount shown if the Host accepts my booking request.</p>
                            <p>I also agree to the updated Terms of Service, Payments Terms of Service, and I acknowledge the Privacy Policy.</p>
                        </div>
                    </div>
                )}






                <button className="confirm-btn"
                    onClick={handleSubmitOrder}>
                    {isBooked ? `Review your order` : 'Confirm and pay'}
                </button>
            </div>

            <section className='mini-stay-details'>
                <div className='mini-stay-details-card'>
                    <div className="mini-stay-details-content">
                        <div className="mini-stay-details-header">
                            <h4>{stay.title}</h4>
                            <h5>Entire home</h5>
                        </div>
                        <div className="mini-stay-details-img">
                            <img src={stay.imgUrls[0]} alt="" />
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
