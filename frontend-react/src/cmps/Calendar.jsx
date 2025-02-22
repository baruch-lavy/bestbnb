// Calendar.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux'
import DatePicker from 'react-datepicker';
import { DayPicker } from 'react-day-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-day-picker/style.css';

export function Calendar({ stay }) {
  const searchData = useSelector((state) => state.search);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  function handleDayClick(date){
    if (!startDate || endDate) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      setEndDate(date);
    }
  }

  const start = new Date(searchData.startDate);
  const end = new Date(searchData.endDate);
  const timeDifference = end - start;
  const stayLength = (timeDifference) ? timeDifference / (1000 * 3600 * 24) : ''

  function formatDate(date) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }


  const [selectedDays, setSelectedDays] = useState([
    new Date(2025, 2, 12), // Mar 12, 2025
    new Date(2025, 2, 16)  // Mar 16, 2025
  ]);

  return (
    <div className="details-calendar-container">
      <h3>{stayLength} nights in {stay.name}</h3>
      <h6>{formatDate(start)} - {formatDate(end)}</h6>

      <div className="calendar">
        <DayPicker
          captionLayout="label"
          min={1}
          mode="range"
          selectedDays={selectedDays}
          selected={selectedDays}
          numberOfMonths={2}
          showOutsideDays
          onDayClick={handleDayClick}/>
       <div>
        {startDate && endDate ? (
          <p>
            Selected Range: {startDate.toLocaleDateString()} to{' '}
            {endDate.toLocaleDateString()}
          </p>
        ) : (
          <p>Select a start date, then an end date.</p>
        )}
      </div>
      </div>
    </div>
  );
};




// const [startDate, setStartDate] = useState(null);
// const [endDate, setEndDate] = useState(null);

// // Example availability data (this could be fetched from an API)
// const unavailableDates = [
//   new Date(2025, 1, 10),  // Unavailable date 1
//   new Date(2025, 1, 15),  // Unavailable date 2
//   new Date(2025, 1, 20),  // Unavailable date 3
// ];

// const isDateUnavailable = (date) => {
//   return unavailableDates.some(
//     (unavailableDate) =>
//       unavailableDate.toDateString() === date.toDateString()
//   );
// };


{/* <DatePicker
  selected={startDate}
  onChange={(date) => setStartDate(date)}
  startDate={startDate}
  endDate={endDate}
  selectsStart
  placeholderText="Select start date"
  minDate={new Date()}
  filterDate={(date) => !isDateUnavailable(date)}
/>
<span>to</span>
<DatePicker
  selected={endDate}
  onChange={(date) => setEndDate(date)}
  startDate={startDate}
  endDate={endDate}
  selectsEnd
  minDate={startDate}
  placeholderText="Select end date"
  filterDate={(date) => !isDateUnavailable(date)}
/> */}