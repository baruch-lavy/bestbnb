
//     return(
//         <div className="order-card">
//             <span><button>Make order here</button></span>
//             </div>
//     )}

import React, { useState } from "react";

export function StayOrder({ stay }) {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const stayLength = 5
    const cleanFee = 0.095
    const airbnbFee = 0.13


    const handleMouseMove = (e) => {
        const button = e.currentTarget;
        const { x, y } = button.getBoundingClientRect();
        button.style.setProperty("--x", e.clientX - x);
        button.style.setProperty("--y", e.clientY - y);
    };

    return (
        <div className="d">
            <h2 className="e">${stay.price}<span> night</span></h2>

            {/* Check-in & Check-out Dates */}
            <div className="mb-4">
                <label className="s">CHECK-IN</label>
                <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="d"
                />
            </div>

            <div className="mb-4">
                <label className="KJH">CHECK-OUT</label>
                <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w"
                />
            </div>

            {/* Guest Selection */}
            <div className="mb-4">
                <label className="blo">GUESTS</label>
                <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-fu"
                >
                    {[...Array(5).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>
                            {num + 1} {num + 1 === 1 ? "Guest" : "Guests"}
                        </option>
                    ))}
                </select>
            </div>

            {/* Reserve Button */}
            <button
             className="reserve-btn"
             onMouseMove={handleMouseMove}>
                Reserve
            </button>

            <p>You won't be charged yet</p>
            <div>
                <span>${stay.price} X {stayLength} nights</span><span>${stay.price * stayLength}</span>
            </div>
            <div>
                <span>Cleaning fee</span><span>${parseInt(stay.price * stayLength * cleanFee)}</span>
            </div>
            <div>
                <span>Airbnb service fee</span><span>${parseInt(stay.price * stayLength * airbnbFee)}</span>
            </div>
            <div>
                <span>Total</span><span>${parseInt(stay.price * stayLength * (1 + airbnbFee + cleanFee))}</span>
            </div>
        </div>
    );
};

// export default ReservationCard;