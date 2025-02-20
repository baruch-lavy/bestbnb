// Calendar.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { DayPicker } from 'react-day-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-day-picker/style.css';

export function Calendar() {
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


  return (
    <div className="details-calendar-container">
      <h3>9 nights in Taylors Island</h3>
      <h6>Mar 16, 2025 - May 23, 2025</h6>

      <div className="calendar">
        <DayPicker
          captionLayout="label"
          min={1}
          mode="range"
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