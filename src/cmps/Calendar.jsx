// Calendar.js
import React, { useState , useEffect } from 'react'
import { useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import { DayPicker } from 'react-day-picker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-day-picker/style.css'

export function Calendar({ stay }) {

  const searchData = useSelector((state) => state.search)
  const [selectedRange, setSelectedRange] = useState({ from: searchData.startDate, to: searchData.endDate })
  const [startDate, setStartDate] = useState(new Date(searchData.startDate)) 
  const [endDate, setEndDate] = useState(new Date(searchData.endDate)) 

  function handleDayClick(date) {
    if (!startDate || endDate) {
      setStartDate(date)
      setEndDate(null)
    } else if (startDate && !endDate) {
      setEndDate(date)
    }
  }

  const start = new Date(searchData.startDate)
  const end = new Date(searchData.endDate)
  const timeDifference = end - start
  const stayLength = timeDifference ? Math.ceil(timeDifference / (1000 * 3600 * 24)) : ''

  function formatDate(date) {
    // Ensure the date is a valid Date object before calling toLocaleDateString
    if (date instanceof Date && !isNaN(date)) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }
  }

  useEffect(() => {
  }, [startDate, endDate])


  return (
    <div className="details-calendar-container">
      <h3>{stayLength} nights in {stay.name}</h3>
      <h6>{formatDate(start)} - {formatDate(end)}</h6>

      <div className="calendar">
        <DayPicker
          captionLayout="label"
          min={1}
          mode="range"
          selected={selectedRange}
          defaultMonth={selectedRange.from}
          numberOfMonths={2}
          showOutsideDays
          onDayClick={handleDayClick}/>
      </div>
    </div>
  )
}