// Calendar.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { DayPicker } from "react-day-picker";
import "react-datepicker/dist/react-datepicker.css";
import "react-day-picker/style.css";

export function Calendar(){
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Example availability data (this could be fetched from an API)
  const unavailableDates = [
    new Date(2025, 1, 10),  // Unavailable date 1
    new Date(2025, 1, 15),  // Unavailable date 2
    new Date(2025, 1, 20),  // Unavailable date 3
  ];

  const isDateUnavailable = (date) => {
    return unavailableDates.some(
      (unavailableDate) =>
        unavailableDate.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="calendar-container">
      <h3>9 nights in Taylors Island</h3>
      <h6>Mar 16, 2025 - May 23, 2025</h6>

      <div className="calendar">
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
        <DayPicker captionLayout="label" min={1} mode="range" numberOfMonths={2} showOutsideDays />
      </div>
    </div>
  );
};

