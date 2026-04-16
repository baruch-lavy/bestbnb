// Calendar.js
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { DayPicker } from 'react-day-picker'
import { setSearchData } from '../store/actions/stay.actions'
import 'react-day-picker/style.css'

export function Calendar({ stay }) {

  const searchData = useSelector((state) => state.search)
  const [selectedRange, setSelectedRange] = useState({
    from: searchData.startDate ? new Date(searchData.startDate) : undefined,
    to: searchData.endDate ? new Date(searchData.endDate) : undefined,
  })

  function handleSelect(range) {
    setSelectedRange(range || { from: undefined, to: undefined })
    if (range?.from && range?.to) {
      setSearchData({
        ...searchData,
        startDate: range.from.toString(),
        endDate: range.to.toString(),
      })
    }
  }

  const start = new Date(searchData.startDate)
  const end = new Date(searchData.endDate)
  const timeDifference = end - start
  const stayLength = timeDifference ? Math.ceil(timeDifference / (1000 * 3600 * 24)) : ''

  function formatDate(date) {
    if (date instanceof Date && !isNaN(date)) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }
  }

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
          onSelect={handleSelect}/>
      </div>
    </div>
  )
}