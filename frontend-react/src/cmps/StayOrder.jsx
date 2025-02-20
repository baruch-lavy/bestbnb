
import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { setSearchData, loadStays } from "../store/actions/stay.actions.js";

export function StayOrder({ stay }) {
    const location = useLocation() // ✅ Get current query params from URL
    const searchData = useSelector((state) => state.search)
    const [openDropdown, setOpenDropdown] = useState(null)

    console.log('searchData', searchData)
    const dropdownRef = useRef(null);
    const datePickerRef = useRef(null);
    const guestDropdownRef = useRef(null);

    const dispatch = useDispatch();
    const cleanFee = 0.095
    const airbnbFee = 0.13

    // useEffect(() => {
    //     const searchParams = new URLSearchParams(window.location.search);
    //     const filterBy = {
    //         destination: searchParams.get("destination") || "Anywhere",
    //         startDate: searchParams.get("startDate") || "",
    //         endDate: searchParams.get("endDate") || "",
    //         guests: Number(searchParams.get("guests")) || 1,
    //     };

    //     console.log("🚀 Syncing Redux with URL search parameters:", filterBy);
    //     dispatch(setSearchData(filterBy));
    // }, [dispatch]);

    // console.log('searchData', searchData)

    const handleDropdownOpen = (dropdown) => {
        setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
    };

    //  const handleGuestChange = (type, amount) => {
    //     const updatedGuests = {
    //       ...search.guests,
    //       [type]: Math.max(0, (search.guests?.[type] || 0) + amount),
    //     };

    //     dispatch(
    //       setSearchData({
    //         ...search,
    //         guests: { ...updatedGuests }, // ✅ Ensuring new object reference
    //       })
    //     );
    //   };

    function handleMouseMove(e) {
        const button = e.currentTarget;
        const { x, y } = button.getBoundingClientRect();
        button.style.setProperty("--x", e.clientX - x);
        button.style.setProperty("--y", e.clientY - y);
    }

    const start = new Date(searchData.startDate);
    const end = new Date(searchData.endDate);
    const timeDifference = end - start;
    const stayLength = (timeDifference) ? timeDifference / (1000 * 3600 * 24) : ''

    return (
        <div className="order-section">
            <div className="order-card">
                <h2 className="order-price">
                    ${stay.price} <span>night</span>
                </h2>

                {/* Check-in & Check-out Dates */}
                <div className="form-order">
                    {/* <div className="order-dates-container"> */}
                    <div className="order-dates-in">
                        <label className="order-dates-label">CHECK-IN</label>
                        <input
                            type="text"
                            placeholder="Add dates"
                            value={
                                searchData.startDate
                                    ? new Date(searchData.startDate).toLocaleDateString()
                                    : ""
                            }
                            readOnly
                        />
                    </div>


                    <div className="order-dates-out">
                        <label className="order-dates-label">CHECK-OUT</label>
                        <input
                            type="text"
                            placeholder="Add dates"
                            value={
                                searchData.endDate
                                    ? new Date(searchData.endDate).toLocaleDateString()
                                    : ""
                            }
                            readOnly
                        />
                    </div>
                    {/* </div> */}

                    {/* Guest Selection */}
                    <div className="order-guests">
                        <label className="order-guests-label">GUESTS</label>
                        <input
                            placeholder="1 guest"
                            name="guests"
                            value={
                                `${(searchData.guests?.adults || 0) + (searchData.guests?.children || 0) || 1} guest${(searchData.guests?.adults || 0) + (searchData.guests?.children || 0) !== 1 ? 's' : ''}`
                                + (searchData.guests?.infants > 0 ? `, ${searchData.guests.infants} infant${searchData.guests.infants !== 1 ? 's' : ''}` : '')
                                + (searchData.guests?.pets > 0 ? `, ${searchData.guests.pets} pet${searchData.guests.pets !== 1 ? 's' : ''}` : '')
                            }

                            // value={((searchData.guests?.adults || 0) + (searchData.guests?.children || 0)) <= 1 ? "1 guest" : `${(searchData.guests?.adults || 0) + (searchData.guests?.children || 0)
                            //     } guests`}
                            readOnly
                            onClick={() => handleDropdownOpen("who")}
                        />
                        {openDropdown === "who" && (
                            <div className="guest-dropdown">
                                {["adults", "children", "infants", "pets"].map((key) => (
                                    <div className="guest-row" key={key}>
                                        <div className="guest-info">
                                            <strong>
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </strong>
                                            <p>
                                                {key === "pets" ? (
                                                    <a href="#">Bringing a service animal?</a>
                                                ) : (
                                                    `Ages for ${key}`
                                                )}
                                            </p>
                                        </div>
                                        <div className="guest-controls">
                                            <button
                                                className="guest-btn"
                                                onClick={() => handleGuestChange(key, -1)}
                                                disabled={searchData.guests?.[key] === 0}
                                            >
                                                −
                                            </button>
                                            <span>{searchData.guests?.[key] || 0}</span>
                                            <button
                                                className="guest-btn"
                                                onClick={() => handleGuestChange(key, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* <section className="rooms-and-beds">
                        <h3>Rooms and beds</h3>
                        <div className="rooms-inputs">
                            <CounterGroup 
                                label="Bedrooms"
                                value={bedrooms}
                                setValue={setBedrooms}
                            />
                            <CounterGroup 
                                label="Beds"
                                value={beds}
                                setValue={setBeds}
                            />
                            <CounterGroup 
                                label="Bathrooms"
                                value={bathrooms}
                                setValue={setBathrooms}
                            />
                        </div>
                    </section> */}

                {/* Reserve Button */}
                <Link to={`/stay/book/${stay._id}${location.search}`}>
                    <button
                        className="reserve-btn"
                        onMouseMove={handleMouseMove}>
                        Reserve
                    </button>
                </Link>

                {/* {checkIn && checkOut && */}
                    <div className="order-footer flex">
                        <span>You won't be charged yet</span>
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
                            <span>Total</span><span>${parseInt(stay.price * stayLength * (1 + airbnbFee + cleanFee)).toLocaleString()}</span>
                        </div>
                    </div>
            </div>
        </div>
    );
};

