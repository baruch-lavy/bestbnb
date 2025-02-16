
import React, { useState } from "react";

export function StayReserve({ stay }) {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const stayLength = 5
    const cleanFee = 0.095
    const airbnbFee = 0.13


    function handleMouseMove(e) {
        const button = e.currentTarget;
        const { x, y } = button.getBoundingClientRect();
        button.style.setProperty("--x", e.clientX - x);
        button.style.setProperty("--y", e.clientY - y);
    }

    return (
        <div className="order-section">
            <div className="order-card">
                {/* {(checkIn && checkOut) ? */}
                    <h2 className="order-price">${stay.price}<span> night</span></h2>
                    {/* : <h2 className="order-price">Add dates for prices</h2>} */}

                {/* Check-in & Check-out Dates */}
                <div className="form-reservation">
                    {/* <div className="reservation-dates-container"> */}
                        <div className="reservation-dates-in">
                            <label className="reservation-dates-label">CHECK-IN</label>
                            <input
                                placeholder="Add date"
                                value="16/3/2025"
                                // {checkIn}
                                // type="date"
                                // onChange={(e) => setCheckIn(e.target.value)}
                                className="date-input"
                            />
                        </div>


                        <div className="reservation-dates-out">
                            <label className="reservation-dates-label">CHECK-OUT</label>
                            <input
                                placeholder="Add date"
                                value="19/3/2025"
                                // {checkOut}
                                // type="date"
                                // onChange={(e) => setCheckOut(e.target.value)}
                                className="date-input"
                            />
                        </div>
                    {/* </div> */}

                    {/* Guest Selection */}
                    <div className="reservation-guests">
                        <label className="reservation-guests-label">GUESTS</label>
                        <select
                            placeholder="1 guest"
                            name="guests"
                            value="1 guest"
                            // {guests}
                            // onChange={(e) => setGuests(Number(e.target.value))}
                            className="guests"
                        >
                            {[...Array(5).keys()].map((num) => (
                                <option key={num + 1} value={num + 1}>
                                    {num + 1} {num + 1 === 1 ? "Guest" : "Guests"}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Reserve Button */}
                {/* <Link to={`/stay/confirmation/${stay._id}`}> */}
                <button
                    className="reserve-btn"
                    onMouseMove={handleMouseMove}>
                    Reserve
                </button>
                {/* </Link> */}

                {/* {checkIn && checkOut && */}
                <div className="reservation-footer flex">
                    <span>You won't be charged yet</span>
                    <div className="footer-price-nigts flex">
                        <span>${stay.price} X {stayLength} nights</span><span>${stay.price * stayLength}</span>
                    </div>
                    <div className="footer-price-clean-fee flex">
                        <span>Cleaning fee</span><span>${parseInt(stay.price * stayLength * cleanFee)}</span>
                    </div>
                    <div className="footer-price-airbnb-fee flex">
                        <span>Airbnb service fee</span><span>${parseInt(stay.price * stayLength * airbnbFee)}</span>
                    </div>
                    <div className="footer-price-total flex">
                        <span>Total</span><span>${parseInt(stay.price * stayLength * (1 + airbnbFee + cleanFee))}</span>
                    </div>
                </div>
                {/* } */}
            </div>
        </div>
    );
};

// export default ReservationCard;