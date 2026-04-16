
import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { DayPicker } from 'react-day-picker'
import { setSearchData, loadStays } from "../store/actions/stay.actions.js"
import 'react-day-picker/style.css'

export function StayOrder({ stay }) {
    const location = useLocation() 
    const searchData = useSelector((state) => state.search)
    const [openDropdown, setOpenDropdown] = useState(null)
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [selectedRange, setSelectedRange] = useState({
        from: searchData.startDate ? new Date(searchData.startDate) : undefined,
        to: searchData.endDate ? new Date(searchData.endDate) : undefined,
    })
    const datePickerModalRef = useRef(null)
    const guestDropdownContainerRef = useRef(null)

    const dropdownRef = useRef(null)
    const datePickerRef = useRef(null)
    const guestDropdownRef = useRef(null)
    const cleanFee = 0.095
    const airbnbFee = 0.13

    useEffect(() => {
        function handleClickOutside(e) {
            if (datePickerModalRef.current && !datePickerModalRef.current.contains(e.target)) {
                setIsDatePickerOpen(false)
            }
        }
        if (isDatePickerOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isDatePickerOpen])

    useEffect(() => {
        function handleGuestClickOutside(e) {
            if (guestDropdownContainerRef.current && !guestDropdownContainerRef.current.contains(e.target)) {
                setOpenDropdown(null)
            }
        }
        if (openDropdown === 'who') {
            document.addEventListener('mousedown', handleGuestClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleGuestClickOutside)
    }, [openDropdown])

    function handleDateSelect(range) {
        const newRange = range || { from: undefined, to: undefined }
        setSelectedRange(newRange)
        if (newRange.from && newRange.to) {
            setSearchData({
                ...searchData,
                startDate: newRange.from.toString(),
                endDate: newRange.to.toString(),
            })
            setIsDatePickerOpen(false)
        }
    }

    const handleDropdownOpen = (dropdown) => {
        setOpenDropdown((prev) => (prev === dropdown ? null : dropdown))
    }

    function handleGuestChange(key, delta) {
        const current = searchData.guests?.[key] || 0
        const next = Math.max(0, current + delta)
        setSearchData({
            ...searchData,
            guests: {
                ...searchData.guests,
                [key]: next,
            },
        })
    }

    function handleMouseMove(e) {
        const button = e.currentTarget
        const { x, y } = button.getBoundingClientRect()
        button.style.setProperty("--x", e.clientX - x)
        button.style.setProperty("--y", e.clientY - y)
    }

    const start = searchData.startDate ? new Date(searchData.startDate) : new Date().setDate(new Date().getDate() + 2)
    const end = searchData.endDate ? new Date(searchData.endDate) : new Date().setDate(new Date().getDate() + 9)
    const timeDifference = end - start
    const stayLength = (timeDifference) ? Math.ceil(timeDifference / (1000 * 3600 * 24)) : ''

    return (
        <div className="order-section">
            <div className="order-card">
                <h2 className="order-price">
                    ${stay.price} <span>night</span>
                </h2>

                {/* Check-in & Check-out Dates */}
                <div className="form-order" ref={datePickerModalRef}>
                    <div className="order-dates-in" onClick={() => setIsDatePickerOpen(true)}>
                        <label className="order-dates-label">CHECK-IN</label>
                        <input
                            type="text"
                            placeholder="Add dates"
                            value={
                                searchData.startDate
                                    ? new Date(searchData.startDate).toLocaleDateString()
                                    : new Date(new Date().setDate(new Date().getDate() + 2)).toLocaleDateString()
                            }
                            readOnly
                        />
                    </div>

                    <div className="order-dates-out" onClick={() => setIsDatePickerOpen(true)}>
                        <label className="order-dates-label">CHECK-OUT</label>
                        <input
                            type="text"
                            placeholder="Add dates"
                            value={
                                searchData.endDate
                                    ? new Date(searchData.endDate).toLocaleDateString()
                                    : new Date(new Date().setDate(new Date().getDate() + 9)).toLocaleDateString()
                            }
                            readOnly
                        />
                    </div>

                    {isDatePickerOpen && (
                        <div className="order-date-picker-modal">
                            <DayPicker
                                mode="range"
                                selected={selectedRange}
                                onSelect={handleDateSelect}
                                defaultMonth={selectedRange.from}
                                numberOfMonths={2}
                                showOutsideDays
                                min={1}
                            />
                        </div>
                    )}

                    {/* Guest Selection */}
                    <div className="order-guests" ref={guestDropdownContainerRef}>
                        <label className="order-guests-label">GUESTS</label>
                        <input
                            placeholder="1 guest"
                            name="guests"
                            value={
                                `${(searchData.guests?.adults || 0) + (searchData.guests?.children || 0) || 1} guest${(searchData.guests?.adults || 0) + (searchData.guests?.children || 0) !== 1 ? 's' : ''}`
                                + (searchData.guests?.infants > 0 ? `, ${searchData.guests.infants} infant${searchData.guests.infants !== 1 ? 's' : ''}` : '')
                                + (searchData.guests?.pets > 0 ? `, ${searchData.guests.pets} pet${searchData.guests.pets !== 1 ? 's' : ''}` : '')
                            }
                            readOnly
                            onClick={() => handleDropdownOpen("who")}
                        />
                        {openDropdown === "who" && (
                            <div className="guest-dropdown order-guest-dropdown">
                                <button className="guest-dropdown-close" onClick={() => setOpenDropdown(null)}>✕</button>
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
    )
}

